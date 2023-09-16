import GraphData from "../types/GraphData";
import GraphStation from "../types/GraphStation";
import Line from "../types/Line";
import Schedule from "../types/Schedule";
import scaleTime from './TimestampTransformer';

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
  const lines: Line[] = schedule.inputSchedules.map(sch => {
    const points = sch.calls.map(call => {
      return {
        x: scaleTime(call.timeArr), //TODO: handle stops
        y: stationSeries.find(s => s.identifier === call.station)!.relativePosition
      }
    })

    return {
      name: sch.identifier,
      points,
      color: '#000000' //TODO: support line colors
    }
  }) 

  return {
    stationSeries,
    lines
  }
}

export default transform;