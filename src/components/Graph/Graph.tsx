import React, { useEffect, useState } from 'react'
import GraphTheme from './GraphTheme';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryContainer, VictoryArea } from 'victory';
import GraphProps from './GraphProps'
import Tooltip from '../Tooltip/Tooltip';

const Graph = ({width, height, graphData, xLeft, xRight, yTop, yBottom, zoomModeActive, setXRange, setYRange}: GraphProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipX, setTooltipX] = useState(0);
  const [tooltipY, setTooltipY] = useState(0);
  const [tooltipContent, setTooltipContent] = useState('');

  //zoom data: graph offsets w/r/t page, as well as x-y coordinates where the zoom
  //box should be drawn, in graph units
  //TODO: encapsulate in hook
  const [offsets, setOffsets] = useState<number[]>([]);
  const [showZoomBox, setShowZoomBox] = useState(false);
  const [x1, setX1] = useState(0);
  const [x2, setX2] = useState(0);
  const [y1, setY1] = useState(0);
  const [y2, setY2] = useState(0);

  //functions that use the offsets to convert screen coordinates to graph x-y units
  const convertX = (x: number) => (x - offsets[0])/(offsets[2] - offsets[0])
  const convertY = (y: number) => 1 - ((y - offsets[1])/(offsets[3] - offsets[1]))

  //captures the graph offsets w/r/t page, based on the position of a transparent line that traverses the
  //entire area of the graph
  useEffect(() => {
    for (let elem of document.querySelectorAll('g')) {
      if (elem.children.length > 1 && 
          elem.children[0].tagName === 'defs' && 
          (elem.children[1] as HTMLElement).style.stroke === 'transparent') {
        const rect = elem.getBoundingClientRect()

        setOffsets([rect.left, rect.top, rect.left + rect.width, rect.top + rect.height])
      }
    }
  }, []);

  //activates the zoom box, fixing its starting point and making it visible
  const startZoomBox = (e: any) => {
    if (!zoomModeActive) return;

    const actualX = convertX(e.clientX)
    const actualY = convertY(e.clientY)

    setX1(actualX);
    setY1(actualY);
    setX2(actualX);
    setY2(actualY);
    setShowZoomBox(true);
  };

  //hides the zoom box and applies the corresponding zoom to the graph
  const endZoomBox = () => {
    if (!zoomModeActive) return;

    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);

    setXRange([minX*1440, maxX*1440]);
    setYRange([(1 - maxY)*100, (1 - minY)*100]);

    setShowZoomBox(false);
  };

  //continuously redraws the zoom box at the coordinates where the mouse is dragged to
  const adjustZoomBox = (e: any) => {
    if (!zoomModeActive || !showZoomBox) return;

    const actualX = convertX(e.clientX)
    const actualY = convertY(e.clientY)
    
    setX2(actualX);
    setY2(actualY);
  }

  //if the mouse exits the graph, we stop drawing the zoom box
  const abortZoomBox = (e: any) => {
    if (!zoomModeActive || !showZoomBox) return

    setShowZoomBox(false)
  }

  return (
    <>
      <Tooltip x={tooltipX} y={tooltipY} visible={showTooltip} content={tooltipContent} />
      <VictoryChart domain={{x: [xLeft, xRight], y: [yBottom, yTop]}} theme={GraphTheme} width={width} height={height} containerComponent={<VictoryContainer responsive={false}/>} events={[{
        target: 'parent',
        eventKey: 'all',
        eventHandlers: {
          onMouseDown: startZoomBox,
          onMouseUp: endZoomBox,
          onMouseMove: adjustZoomBox,
          onMouseLeave: abortZoomBox
        }
      }]}>
        <VictoryAxis 
          tickValues={[0, 0.042, 0.083, 0.125, 0.167, 0.208, 0.25, 0.292, 0.333, 0.375, 0.417, 0.458, 0.5, 0.542, 0.583, 0.625, 0.667, 0.708, 0.75, 0.792, 0.833, 0.875, 0.917, 0.958, 1].filter(tick => tick >= xLeft && tick <= xRight)}
          tickFormat={(tick) => Math.round(tick * 24).toString()}
          crossAxis
          width={width}
          height={height}
          domain={[xLeft, xRight]}
          standalone={false}
        />
         <VictoryAxis 
          tickValues={graphData.stationSeries.map(s => s.relativePosition).filter(tick => tick >= yBottom && tick <= yTop)}
          tickFormat={(tick) => graphData.stationSeries.find(s => s.relativePosition === tick)?.identifier || ''}
          crossAxis 
          dependentAxis
          width={width}
          height={height}
          domain={[yBottom, yTop]}
          standalone={false}
        />
        {showZoomBox && <VictoryArea 
        style={{data: { fill: 'transparent', stroke: 'black', strokeWidth: 1 }}} 
        data={[
          { x: Math.min(x1, x2), y0: Math.min(y1, y2), y: Math.max(y1, y2) },
          { x: Math.max(x1, x2), y0: Math.min(y1, y2), y: Math.max(y1, y2)} 
        ]} />}
         {showZoomBox && <VictoryLine 
        data={[
          { x: Math.min(x1, x2), y: Math.max(y1, y2) },
          { x: Math.min(x1, x2), y: Math.min(y1, y2) },
          { x: Math.max(x1, x2), y: Math.min(y1, y2) }, 
          { x: Math.max(x1, x2), y: Math.max(y1, y2) },
        ]} />}
        {graphData.lines.map(
          (line, index) => <VictoryLine
          data={line.points}
          style={{data: { stroke: line.color }}}
          name={line.name} key={`line${index}`} 
          // onMouseEnter={(_, e) => {
          //   setTooltipX(e.clientX + 10);
          //                       setTooltipY(e.clientY + 10);
          //                       setTooltipContent(line.name);
          //                       setShowTooltip(true);
          //                     }}
          //                     onMouseLeave={() => {
          //                       setTimeout(() => {
          //                         setTooltipX(0);
          //                         setTooltipX(0);
          //                         setTooltipContent('');
          //                         setShowTooltip(false);
          //                       }, 200);
          //                     }}
                              />
          )}
          <VictoryLine 
          events={[{
            target: 'parent',
            eventKey: 'all',
            eventHandlers: {
              onClick: (e: any, x: any) => console.log(e, x),
            }
          }]}
          
          data={[{x: 0, y: 0}, {x:1, y:1}]} 
          style={{data: { stroke: 'transparent', opacity: 0.1234, strokeWidth: 0.5678 }} as any} 
          key="myline" />
    </VictoryChart>
    </>
  )
}

export default Graph;