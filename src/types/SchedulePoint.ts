import Timestamp from "./Timestamp"

export default interface SchedulePoint {
  timeArr: Timestamp
  timeDep?: Timestamp
  station: string
}