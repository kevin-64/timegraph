import Timestamp from "./Timestamp"

export default interface SchedulePoint {
  timeArr?: Timestamp
  timeDep?: Timestamp
  station: string

  //allow additional properties, e.g. statistics for visualization purposes
  [x: string]: any
}