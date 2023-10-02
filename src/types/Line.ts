import Point from "./Point"

export default interface Line {
  name: string
  points: Point[]
  color: string
  thickness?: number
  strokeDashes?: string
}