import React, { useState } from 'react';
import * as d3 from 'd3'; 
import { hexbin as d3Hexbin } from 'd3-hexbin'; 

export const Marks = ({ bins, data, yValueField, hexbinSize, projection }) => {
    const [tooltip, setTooltip] = useState({ display: 'none', x: 0, y: 0, content: [] });

    
    const fieldValues = data.map(d => d[yValueField]).filter(h => h != null && h !== '' && !isNaN(h) && h > 0);
    const colorScale = d3.scaleLinear()
        .domain([d3.min(fieldValues) || 0, d3.mean(fieldValues) || 0, d3.max(fieldValues) || 0])
        .range(['yellow', 'orange', 'red']); 

    return (
        <g className="marks">
            {bins.map((bin, i) => {
           
                const binData = data.filter(d => {
                    const coords = projection(d.coords);
                    return (
                        coords[0] >= bin.x - hexbinSize && coords[0] <= bin.x + hexbinSize &&
                        coords[1] >= bin.y - hexbinSize && coords[1] <= bin.y + hexbinSize
                    );
                });

         
                const validDataPoints = binData.filter(d => 
                    d[yValueField] != null &&        
                    d[yValueField] !== '' && 
                    !isNaN(d[yValueField]) &&          
                    d[yValueField] > 0                 
                );

                const meanValue = validDataPoints.length > 0 
                    ? validDataPoints.reduce((sum, d) => sum + d[yValueField], 0) / validDataPoints.length 
                    : 0; 

                if (validDataPoints.length === 0) {
                    return null;
                }

                const fillColor = colorScale(meanValue); 

                return (
                    <g key={i}
                       onMouseEnter={(e) => {
                           setTooltip({
                               display: 'block',
                               x: e.clientX,
                               y: e.clientY,
                               content: [
                                   `Number of Data Points: ${validDataPoints.length}`,  
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