import React, { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts'
import GraphProps from './GraphProps'
import Tooltip from '../Tooltip/Tooltip';

const Graph = ({ width, height, graphData }: GraphProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipX, setTooltipX] = useState(0);
  const [tooltipY, setTooltipY] = useState(0);
  const [tooltipContent, setTooltipContent] = useState('');

  const [lineData, setLineData] = useState<any[]>([]);

  //process line information to put it in a format that recharts understands (shared x, separate y props for each line)
  useEffect(() => {
    const newData: any = [];
    graphData.lines.forEach((line, index) => line.points.forEach(pt => newData.push({x: pt.x, [`y${index}`]: pt.y})));
    setLineData(newData)

  }, [graphData.lines]);

  return (
    <>
      <Tooltip x={tooltipX} y={tooltipY} visible={showTooltip} content={tooltipContent} />
      <LineChart className='chart-container' width={width} height={height} data={lineData}>
        <CartesianGrid stroke="#ccc" />
        <XAxis 
          ticks={[0, 0.042, 0.083, 0.125, 0.167, 0.208, 0.25, 0.292, 0.333, 0.375, 0.417, 0.458, 0.5, 0.542, 0.583, 0.625, 0.667, 0.708, 0.75, 0.792, 0.833, 0.875, 0.917, 0.958, 1]}
          tickFormatter={(tick) => Math.round(tick * 24).toString()}
          type="number" dataKey="x" domain={[0, 1]} />
        <YAxis width={100} 
          ticks={graphData.stationSeries.map(s => s.relativePosition)}
          tickFormatter={(tick) => graphData.stationSeries.find(s => s.relativePosition === tick)!.identifier} 
          />
        {graphData.lines.map(
          (line, index) => <Line 
                              dot={false} stroke={line.color} isAnimationActive={false} 
                              dataKey={`y${index}`} name={line.name} key={`line${index}`} 
                              onMouseEnter={(_, e) => {
                                setTooltipX(e.clientX + 10);
                                setTooltipY(e.clientY + 10);
                                setTooltipContent(line.name);
                                setShowTooltip(true);
                              }}
                              onMouseLeave={() => {
                                setTimeout(() => {
                                  setTooltipX(0);
                                  setTooltipX(0);
                                  setTooltipContent('');
                                  setShowTooltip(false);
                                }, 200);
                              }}
                              />
        )}
    </LineChart>
    </>
  )
}

export default Graph;