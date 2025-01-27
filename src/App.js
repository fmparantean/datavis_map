import React, { useState } from 'react';
import { useWorldAtlas } from './useWorldAtlas';
import './App.css';
import { useData } from './useData';
import { Hexbinmap } from './HexbinMap/index.js';
import { DateHistogram } from './DateHistogram/index.js';
import { scaleLinear } from 'd3';
import ColorLegend from './HexbinMap/ColorLegend.js';
import * as d3 from 'd3';
import Filters from './Filters';
import Instructions from './Instructions';


const width = 900;
const height = 1000;
const dateHistogramSize = 0.24;
const orderedDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const App = () => {
    const worldAtlas = useWorldAtlas();
    const data = useData();

    const [brushExtent, setBrushExtent] = useState(null);
    const [participant, setParticipant] = useState("All");
    const [gender, setGender] = useState("Both");
    const [modeButton, setModeButton] = useState("Both");
    const [yValueField, setYValueField] = useState("HRV");
    const [hexbinSize, setHexbinSize] = useState(5);


    if (!worldAtlas || !data || data.length === 0) {
        return (
            <svg width={width} height={height}>
                <text 
                x={width / 2} 
                y={height / 2} 
                textAnchor="middle" 
                fontSize="14" 
                fill="black">
                    Loading...
                </text>
            </svg>
        );
    }

    const uniqueParticipants = Array.from(new Set(data.map(d => d.Participant)))
        .sort((a, b) => a - b);

    const filteredData = data.filter(d => {
        const participantFilter = participant === "All" || d.Participant.toString() === participant;
        const genderFilter = gender === "Both" || d.Gender === gender;
        const modeButtonFilter = modeButton === "Both" || d.ModeButton_xs === modeButton;
        return participantFilter && genderFilter && modeButtonFilter;
    });




const fieldValues = data.map(d => d[yValueField]).filter(h => h != null && h !== '' && !isNaN(h));
    const colorScale = scaleLinear()
        .domain([d3.min(fieldValues) || 0, d3.mean(fieldValues) || 0, d3.max(fieldValues) || 0])
        .range(['yellow', 'orange', 'red']);
        

    return (
        <div style={{ display: 'flex' }}>
            <div className="filters">
                <Filters
                    participant={participant}
                    setParticipant={setParticipant}
                    gender={gender}
                    setGender={setGender}
                    modeButton={modeButton}
                    setModeButton={setModeButton}
                    yValueField={yValueField}
                    setYValueField={setYValueField}
                    uniqueParticipants={uniqueParticipants}
                    hexbinSize={hexbinSize}
                    setHexbinSize={setHexbinSize}
                />
                <img
                    src="bus.png"
                    alt="bus Logo"
                    style={{ width: '100px', height: 'auto', marginTop: '210px', marginLeft: '35px', alignSelf: 'center' }}
                />
            </div>

            <svg width={width} height={height}>
                <text x={width / 2} y={45} textAnchor="middle" className="title">
                    The Interactive Map of Travel Experience with D3-React
                </text>
                <image
                    id='map-image'
                    href="datamap.png"
                    x={21}
                    y={72}
                    height={height}
                    width={width}
                />
                <g transform={`translate(0,30)`}>
                    <Hexbinmap
                        data={brushExtent ? filteredData.filter(d => brushExtent.includes(orderedDays[d.DayOrder])) : []}
                        worldAtlas={worldAtlas}
                        yValueField={yValueField}
                        hexbinSize={hexbinSize}
                    />
                </g>
                <g transform={`translate(0, 700)`}>
                    <DateHistogram
                        data={filteredData}
                        width={width}
                        height={dateHistogramSize * height}
                        setBrushExtent={setBrushExtent}
                        xValue={d => d.DayOrder}
                        yValueField={yValueField}
                    />
                </g>
                <g transform={`translate(820, 550)`}>
                    <ColorLegend
                        colorScale={colorScale}
                        yValueField={yValueField}
                        data={filteredData}
                    />
                </g>
            </svg>

            <Instructions/>

        
        </div>
    );
};


export default App;