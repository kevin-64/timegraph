import RepeatInfo from "./RepeatInfo";
import SchedulePoint from "./SchedulePoint";

export default interface InputSchedule {
  identifier: string
  category: string
  number: number
  calls: SchedulePoint[]
  repeat?: RepeatInfo
}