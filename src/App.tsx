import React, { useState } from 'react';
import Graph from './components/Graph/Graph';
import GraphData from './types/GraphData';
import "react-range-slider-input/dist/style.css";
import "../public/main.css"

import RangeSlider from 'react-range-slider-input';

interface AppProps {
  graphData: GraphData
}

const App = ({graphData}: AppProps) => {
  const [xRange, setXRange] = useState([0, 1440]);
  const [yRange, setYRange] = useState([0, 100]);
  return (
    <div className="main-flex-container">
      <RangeSlider orientation="vertical" min={0} max={100} value={yRange} onInput={setYRange} />
      <div className="secondary-flex-container">
        <Graph
          xLeft={xRange[0]/1440}
          xRight={xRange[1]/1440}
          yTop={yRange[0]/100}
          yBottom={yRange[1]/100}
          width={1000}
          height={500}
          graphData={graphData}
        />
        <RangeSlider min={0} max={1440} step={10} value={xRange} onInput={setXRange} />
      </div>
    </div>
  )
}

export default App;