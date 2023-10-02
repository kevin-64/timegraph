import AggregateType from "./AggregateType"
import VisualizationStyle from "./VisualizationStyle"

interface VisualizationStyleMap {
  [value: string]: VisualizationStyle
}

export default interface VisualizationOptions {
  property: string
  on: "schedule" | "call",
  aggregate?: AggregateType,
  style: VisualizationStyleMap
}

export { VisualizationStyleMap }