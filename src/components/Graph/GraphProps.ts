import GraphData from "../../types/GraphData"

export default interface GraphProps {
  //size of the graph
  width: number
  height: number

  //x&y axis domain and functions to set them from outside
  xLeft: number
  xRight: number  
  yTop: number
  yBottom: number
  setXRange: any
  setYRange: any

  //data to represent on the graph
  graphData: GraphData

  //allow zoom or not
  zoomModeActive: boolean
}