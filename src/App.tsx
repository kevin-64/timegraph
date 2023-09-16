import React from 'react';
import Graph from './components/Graph';

const App = () => {
  return (
    <div>
      <span>Timegraph</span>
      <Graph
        width={1000}
        height={500}
        lines={[
          { color: '#000000', points: [{x: 0.1, y: 0}, { x:0.2, y: 0.2}, {x:0.3, y:0.5}, {x:0.5, y: 1}]},
          { color: '#000064', points: [{x: 0.1, y: 1}, { x:0.3, y: 0.5}, {x:0.5, y:0.2}, {x:0.6, y: 0}]},
        ]}
      />
    </div>
  )
}

export default App;