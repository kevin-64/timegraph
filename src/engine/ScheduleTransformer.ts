import GraphData from "../types/GraphData";
import GraphStation from "../types/GraphStation";
import InputSchedule from "../types/InputSchedule";
import Line from "../types/Line";
import Point from "../types/Point";
import Schedule from "../types/Schedule";
import SchedulePoint from "../types/SchedulePoint";
import Timestamp from "../types/Timestamp";
import VisualizationOptions, { VisualizationRangeStyle, VisualizationStyleMap } from "../types/VisualizationOptions";
import { transform as scaleTime, diff, sum, isBefore } from './TimestampUtils';

const offsetSchedulePoints = (points: SchedulePoint[], amount: Timestamp): SchedulePoint[] => {
  return points.map(pt => { 
    return { 
      ...pt,
      ...(pt.timeArr && {timeArr: sum(pt.timeArr!, amount)}),
      ...(pt.timeDep && {timeDep: sum(pt.timeDep!, amount)}),
    }
  })
}

const moveScheduleTo = (points: SchedulePoint[], newDeparture: Timestamp): SchedulePoint[] => {
  const offset = diff(newDeparture, points[0].timeDep!)
  return offsetSchedulePoints(points, offset)
}

const transformInputSchedule = (sch: InputSchedule, 
                                stations: GraphStation[],
                                visualizationOptions?: VisualizationOptions): Line[] => {
  const points = sch.calls.flatMap(call => {
    const stationY = stations.find(s => s.identifier === call.station)!.relativePosition

    if (call.timeArr && call.timeDep) {
      //station stop
      return [
        {
          x: scaleTime(call.timeArr!),
          y: stationY
        },
        {
          x: scaleTime(call.timeDep!),
          y: stationY
        }
      ]
    } else {
      //station pass/departure
      return {
        x: scaleTime((call.timeArr || call.timeDep)!),
        y: stationY
      }
    }
  })

  //any property of the schedule can be used in the identifier, in an interpolation-like syntax;
  //e.g. "{category} {number}" will be replaced with the real category and number of the schedule
  const scheduleName = sch.identifier.replace(/(\{[a-z][a-zA-Z]*\})/g, 
                          (group: string) => (sch as any)[group.replace(/\{|\}/g, '')].toString())
          
  if (!visualizationOptions) {
    return [{
      name: scheduleName,
      points,
      color: '#000000'
    }]
  }

  return getLinesWithStyle(sch, scheduleName, points, visualizationOptions)
}

const transform = (schedule: Schedule): GraphData => {
  const actualStations = new Set(schedule.inputSchedules.flatMap(is => is.calls.flatMap(c => c.station)));
  if ([...actualStations].find((s: string) => !schedule.stations.has(s))) {
    throw new Error('At least one station not included in schedule');
  }

  //normalize station positions to 0-1 interval
  const stationSeries: GraphStation[] = []
  let max = 0
  const stations = [...schedule.stations]
  stations.forEach(([_, distance]) => {
    if (max < distance) {
      max = distance
    }
  })
  stations.forEach(([station, distance]) => {
    stationSeries.push({identifier: station, relativePosition: distance/max})
  })

  //convert lines to x/y notation
  const lines: Line[] = schedule.inputSchedules.flatMap(sch => {
    const scheduleLines: Line[] = []
    if (sch.repeat) {
      let departures: Timestamp[] = [] 

      if (sch.repeat.at) {
        departures = [sch.calls[0].timeDep!, ...sch.repeat.at]
      } else if (sch.repeat.every) {
        let nextDeparture = sch.calls[0].timeDep!
        let count = 0;

        //whichever condition is used to limit the number of repetitions
        //(max number or latest departure time) is called after every new schedule
        const moreDepartures = sch.repeat.last 
          ? (dep: Timestamp, _: number) => isBefore(dep, sch.repeat!.last!)
          : (_: Timestamp, count: number) => count < sch.repeat!.max!

        while (moreDepartures(nextDeparture, count)) {
          departures.push(nextDeparture)
          nextDeparture = sum(nextDeparture, sch.repeat.every)
          count++
        }
      } else {
        throw new Error(`Invalid schedule repetition: ${JSON.stringify(sch.repeat)}`)
      }

      departures.forEach((inst, index) => {
        const newSch = {...sch, number: sch.number + (sch.repeat!.numberOffset * index)}
        newSch.calls = moveScheduleTo(newSch.calls, inst)
        scheduleLines.push(...transformInputSchedule(newSch, stationSeries, schedule.visualize))
      })
    } else {
      scheduleLines.push(...transformInputSchedule(sch, stationSeries, schedule.visualize))
    }
    return scheduleLines
  }) 

  console.log(lines)

  return {
    stationSeries,
    lines
  }
}

const getLinesWithStyle = (schedule: InputSchedule, name: string, points: Point[], visualizationOptions: VisualizationOptions): Line[] => {
  if (visualizationOptions.on === "schedule") {
    const lineStyle = (visualizationOptions.style as VisualizationStyleMap)[(schedule as any)[visualizationOptions.property]]
    return [
      {
        name,
        points,
        color: lineStyle.color!,
        thickness: lineStyle.strokeThickness,
        strokeDashes: lineStyle.strokeDashes
      }
    ]
  } else {
    //calculate value per call
    //at each call, if the value changes, commit old line and create a new line
    //at the end, commit the last line
    const lines : Line[] = []
    let allPoints: Point[] = []
    let lastVizPropValue: any = undefined
    let lastVizStyle
    let lineStyle
    const isRanged = !!visualizationOptions.style.length
    
    let pointIndex = 0
    schedule.calls.forEach((call) => {
      let newVizValue: any
      
      if (isRanged) {
        const propValue = (call as any)[visualizationOptions.property] as number
        console.log(propValue)
        ;(visualizationOptions.style as VisualizationRangeStyle[]).forEach(range => {
          if (propValue >= range.min && propValue <= range.max) {
            newVizValue = range
          }
        })
      } else {
        newVizValue = (call as any)[visualizationOptions.property]
      }

      if (!lastVizPropValue) {
        lastVizPropValue = newVizValue
        lastVizStyle = newVizValue.style
      } else if (lastVizPropValue !== newVizValue) {
      
        lineStyle = isRanged ? lastVizStyle! : (visualizationOptions.style as VisualizationStyleMap)[lastVizPropValue]
        const lineSoFar = {
          name,
          key: `${name}-${pointIndex}`,
          points: [...allPoints],
          color: lineStyle.color!,
          thickness: lineStyle.strokeThickness,
          strokeDashes: lineStyle.strokeDashes
        }
        lines.push(lineSoFar)

        allPoints = allPoints.slice(-1)
        lastVizPropValue = newVizValue
        lastVizStyle = newVizValue.style
      }

      allPoints.push(points[pointIndex])

      //for stops, push both points at the same time
      if (pointIndex + 1 < points.length && points[pointIndex + 1].y === points[pointIndex].y) {
        allPoints.push(points[pointIndex + 1])
        pointIndex++
      }
      pointIndex++
    })

    lines.push({
      name,
      key: `${name}-${points.length}`,
      points: [...allPoints],
      color: lastVizStyle!.color!,
      thickness: lastVizStyle!.strokeThickness,
      strokeDashes: lastVizStyle!.strokeDashes
    })

    console.log(lines)
    return lines
  }
}

export default transform;