import React, { useState } from 'react';
import * as d3 from 'd3'; 
import { hexbin as d3Hexbin } from 'd3-hexbin'; 

export const Marks = ({ bins, data, yValueField, hexbinSize }) => {
    const [tooltip, setTooltip] = useState({ display: 'none', x: 0, y: 0, content: [] });

    const hrvValues = data.map(d => d[yValueField]).filter(h => h != null && h !== 0);
    const colorScale = d3.scaleLinear()
        .domain([d3.min(hrvValues), d3.mean(hrvValues), d3.max(hrvValues)]) 
        .range(['yellow', 'orange', 'red']); 

    return (
        <g className="marks">
            {bins.map((bin, i) => {
                const binData = data.filter(d => 
                    d.x >= bin.x - 15 && d.x <= bin.x + 15 &&
                    d.y >= bin.y - 15 && d.y <= bin.y + 15
                );

                const validDataPoints = binData.filter(d => d[yValueField] != null && d[yValueField] !== 0);
                
                const meanValue = validDataPoints.length > 0 
                    ? validDataPoints.reduce((sum, d) => sum + d[yValueField], 0) / validDataPoints.length 
                    : 0;

            
                if (meanValue === 0 || validDataPoints.length === 0) {
                    return null;
                }

                const fillColor = colorScale(meanValue);

                return (
                    <g key={i}
                       onMouseEnter={(e) => {
                           setTooltip({
                               display: 'block',
                               x: 700,
                               y: 505,
                               content: [
                                   `Numbers of Data Points: ${validDataPoints.length}`,
                                   `Mean Value: ${meanValue.toFixed(2)}`
                               ], 
                           });
                       }}
                       onMouseLeave={() => {
                           setTooltip({ display: 'none', x: 0, y: 0, content: [] });
                       }}>
                        <path 
                            d={d3Hexbin().hexagon(hexbinSize)} 
                            transform={`translate(${bin.x}, ${bin.y})`} 
                            fill={fillColor} 
                            stroke="black" 
                            strokeWidth={1} 
                        />
                    </g>
                );
            })}
            
        
            <g transform={`translate(${tooltip.x}, ${tooltip.y})`} style={{ display: tooltip.display, pointerEvents: 'none' }}>
                <text fill="black" fontSize="12" fontWeight='bold' textAnchor="left" stroke='white' strokeWidth={0.2}>
                    {tooltip.content.map((line, index) => (
                        <tspan x="0" dy={index === 0 ? 0 : 15} key={index}>
                            {line}
                        </tspan>
                    ))}
                </text>
            </g>
        </g>
    );
};