import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import transform from './engine/ScheduleTransformer';

const domNode = document.getElementById('root');
const root = createRoot(domNode!);

const inputGraphData = transform({
  identifier: 'TO-MI line',
  stations: new Map([
    ["Torino PN", 0],
    ["Torino PS", 0.05],
    ["Chivasso", 0.15],
    ["Santhia", 0.25],
    ["Vercelli", 0.35],
    ["Novara", 0.55],
    ["Magenta", 0.70],
    ["Rho Fiera", 0.9],
    ["Milano C.le",1],
  ]),
  visualize : {
    property: 'delay',
    on: "call",
    style: [{
      min: 0,
      max: 5,
      style: {
        color: 'black',
        strokeThickness: 1,
      }
    },
    {
      min: 6,
      max: 10,
      style: {
        color: 'red',
        strokeThickness: 2,
      }
    },
    {
      min: 11,
      max: 20,
      style: {
        color: 'red',
        strokeThickness: 5,
      }
    }]
  },
  inputSchedules: [
    { 
      identifier: '{category} {number}',
      category: 'RV',
      number: 2001,
      calls: [
        { station: "Torino PN", timeDep: { hh: 4, mm: 55}, delay: 0},
        { station: "Torino PS", timeArr: { hh: 5, mm: 4}, timeDep: { hh: 5, mm: 5}, delay: 5},
        { station: "Chivasso", timeArr: { hh: 5, mm: 18}, timeDep: { hh: 5, mm: 20 }, delay: 7},
        { station: "Santhia", timeArr: { hh: 5, mm: 36}, timeDep: { hh: 5, mm: 38 }, delay: 12},
        { station: "Vercelli", timeArr: { hh: 5, mm: 48}, timeDep: { hh: 5, mm: 49 }, delay: 5},
        { station: "Novara", timeArr: { hh: 6, mm: 3}, timeDep: { hh: 6, mm: 5 }, delay: 8},
        { station: "Magenta", timeArr: { hh: 6, mm: 16}, timeDep: { hh: 6, mm: 17 }, delay: 15},
        { station: "Rho Fiera", timeArr: { hh: 6, mm: 32}, timeDep: { hh: 6, mm: 33 }, delay: 12},
        { station: "Milano C.le", timeArr: { hh: 6, mm: 45}, delay: 7},
      ],
      // repeat: {
      //   every: { hh: 1 },
      //   last: { hh: 21, mm: 30 },
      //   numberOffset: 2
      // }
    },
    { 
      identifier: '{category} {number}', 
      category: 'RV',
      number: 2000,
      calls: [
      { station: "Milano C.le", timeDep: { hh: 6, mm: 15}, delay: 0},
      { station: "Rho Fiera", timeArr: { hh: 6, mm: 24}, timeDep: { hh: 6, mm: 25 }, delay: 1},
      { station: "Magenta", timeArr: { hh: 6, mm: 37}, timeDep: { hh: 6, mm: 38 }, delay: 2},
      { station: "Novara", timeArr: { hh: 6, mm: 54}, timeDep: { hh: 6, mm: 56 }, delay: 10},
      { station: "Vercelli", timeArr: { hh: 7, mm: 8}, timeDep: { hh: 7, mm: 9 }, delay: 8},
      { station: "Santhia", timeArr: { hh: 7, mm: 19}, timeDep: { hh: 7, mm: 21 }, delay: 7},
      { station: "Chivasso", timeArr: { hh: 7, mm: 40}, timeDep: { hh: 7, mm: 42 }, delay: 11},
      { station: "Torino PS", timeArr: { hh: 7, mm: 54}, timeDep: { hh: 7, mm: 55 }, delay: 10},
      { station: "Torino PN", timeArr: { hh: 8, mm: 5}, delay: 7},
    ],
    // repeat: {
    //   every: { hh: 1 },
    //   last: { hh: 22, mm: 30 },
    //   numberOffset: 2
    // }
  },
  ],
})

root.render(<App graphData={inputGraphData} />)