import React, { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts'
import GraphProps from './GraphProps'

const Graph = ({ width, height, lines }: GraphProps) => {
  const [lineData, setLineData] = useState<any[]>([]);

  useEffect(() => {
    const newData: any = [];
    lines.forEach((line, index) => line.points.forEach(pt => newData.push({x: pt.x, [`y${index}`]: pt.y})));
    setLineData(newData)

  }, [lines]);

  return (
    <LineChart className='chart-container' width={width} height={height} data={lineData}>
      <CartesianGrid stroke="#ccc" />
      <XAxis ticks={[0.1, 0.2, 0.3, 0.5]} type="number" dataKey="x" domain={[0, 1]} />
      <YAxis width={100} tickFormatter={(tick) => `Station ${Math.floor(tick*10)}`} ticks={[0, 0.2, 0.5, 1]} />
      {lines.map((line, index) => <Line dot={false} stroke={line.color} isAnimationActive={false} dataKey={`y${index}`} key={`line${index}`} />)}
    </LineChart>
  )
}

export default Graph;