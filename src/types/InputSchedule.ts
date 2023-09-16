import Periodicity from "./Periodicity";
import SchedulePoint from "./SchedulePoint";

export default interface InputSchedule {
  identifier: string
  calls: SchedulePoint[]
  periodicity?: Periodicity
}