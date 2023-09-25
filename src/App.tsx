import React, { useEffect, useState } from 'react';
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
  const [zoomModeActive, setZoomModeActive] = useState(false);

  const resetZoom = () => {
    setXRange([0, 1440])
    setYRange([0, 100])
  }

  return (
    <div className="main-flex-container">
      <RangeSlider orientation="vertical" min={0} max={100} value={yRange} onInput={setYRange} />
      <div className="secondary-flex-container">
        <Graph
          xLeft={xRange[0]/1440}
          xRight={xRange[1]/1440}
          yBottom={1 - (yRange[1]/100)}
          yTop={1 - (yRange[0]/100)}
          width={1000}
          height={500}
          graphData={graphData}
          zoomModeActive={zoomModeActive}
          setXRange={setXRange}
          setYRange={setYRange}
        />
        <RangeSlider min={0} max={1440} value={xRange} onInput={setXRange} />
        <div className="zoom-mode-container">
          <input id="zoomMode" type="checkbox" checked={zoomModeActive} onChange={() => setZoomModeActive(!zoomModeActive)} />
          <label htmlFor="zoomMode">Zoom Mode</label>
          <button onClick={resetZoom}>Reset zoom</button>
        </div>
      </div>
    </div>
  )
}

export default App;