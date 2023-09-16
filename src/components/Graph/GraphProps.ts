import GraphData from "../../types/GraphData"

export default interface GraphProps {
  width: number
  height: number
  xLeft: number
  xRight: number  
  yTop: number
  yBottom: number
  graphData: GraphData
}