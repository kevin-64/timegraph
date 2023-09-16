import InputSchedule from "./InputSchedule";

export default interface Schedule {
  identifier: string
  inputSchedules: InputSchedule[]
  stations: Map<string, number>
}