import Timestamp from "./Timestamp"

export default interface RepeatInfo {
  //periodic repetition, with limit of either departure time or number of schedules
  every?: Timestamp
  last?: Timestamp
  max?: number

  //specific repetitions at given departure times
  at?: Timestamp[]

  //how repeated schedules should be numbered
  numberOffset: number
}