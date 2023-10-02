import InputSchedule from "./InputSchedule";
import VisualizationOptions from "./VisualizationOptions";

export default interface Schedule {
  identifier: string
  inputSchedules: InputSchedule[]
  stations: Map<string, number>
  visualize?: VisualizationOptions
}