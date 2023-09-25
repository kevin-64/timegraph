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
    ["Vercelli", 0.35],
    ["Novara", 0.55],
    ["Magenta", 0.85],
    ["Rho Fiera", 0.9],
    ["Milano C.le",1],
  ]),
  inputSchedules: [
    { 
      identifier: '{category} {number}',
      category: 'RV',
      number: 2001,
      calls: [
        { station: "Torino PN", timeArr: { hh: 5, mm: 30}},
        { station: "Torino PS", timeArr: { hh: 5, mm: 40}},
        { station: "Vercelli", timeArr: { hh: 6, mm: 10}},
        { station: "Novara", timeArr: { hh: 6, mm: 40}},
        { station: "Magenta", timeArr: { hh: 7, mm: 10}},
        { station: "Rho Fiera", timeArr: { hh: 7, mm: 20}},
        { station: "Milano C.le", timeArr: { hh: 7, mm: 30}},
      ],
      repeat: {
        at: [{hh: 6, mm: 30},{hh: 7, mm: 30},{hh: 8, mm: 30},{hh: 10, mm: 30},{hh: 14, mm: 30}],
        numberOffset: 2
      }
      // repeat: {
      //   every: { hh: 1 },
      //   last: { hh: 22, mm: 30 }
      // }
    },
    { 
      identifier: '{category} {number}', 
      category: 'RV',
      number: 2000,
      calls: [
      { station: "Milano C.le", timeArr: { hh: 5, mm: 20}},
      { station: "Rho Fiera", timeArr: { hh: 5, mm: 30}},
      { station: "Magenta", timeArr: { hh: 5, mm: 40}},
      { station: "Novara", timeArr: { hh: 6, mm: 10}},
      { station: "Vercelli", timeArr: { hh: 6, mm: 40}},
      { station: "Torino PS", timeArr: { hh: 7, mm: 10}},
      { station: "Torino PN", timeArr: { hh: 7, mm: 20}},
    ]},
  ],
})

root.render(<App graphData={inputGraphData} />)