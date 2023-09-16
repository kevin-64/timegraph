import GraphStation from "./GraphStation";
import Line from "./Line";

export default interface GraphData {
  stationSeries: GraphStation[]
  lines: Line[]
}