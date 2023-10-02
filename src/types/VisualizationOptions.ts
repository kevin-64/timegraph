import AggregateType from "./AggregateType"
import VisualizationStyle from "./VisualizationStyle"

interface VisualizationStyleMap {
  [value: string]: VisualizationStyle
}

interface VisualizationRangeStyle {
  min: number
  max: number
  style: VisualizationStyle
}

export default interface VisualizationOptions {
  property: string
  on: "schedule" | "call",
  aggregate?: AggregateType,
  style: VisualizationStyleMap | VisualizationRangeStyle[]
}

export { VisualizationStyleMap, VisualizationRangeStyle }