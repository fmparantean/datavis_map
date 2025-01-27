import React, { useState } from 'react';
import * as d3 from 'd3'; 
import { hexbin as d3Hexbin } from 'd3-hexbin'; 

export const Marks = ({ bins, data, yValueField, hexbinSize, projection }) => {
    const [tooltip, setTooltip] = useState({ display: 'none', x: 0, y: 0, content: [] });

    // Generate color scale based on current selected yValueField
    const fieldValues = data.map(d => d[yValueField]).filter(h => h != null && h !== '' && !isNaN(h) && h > 0);
    const colorScale = d3.scaleLinear()
        .domain([d3.min(fieldValues) || 0, d3.mean(fieldValues) || 0, d3.max(fieldValues) || 0])
        .range(['yellow', 'orange', 'red']); 

    return (
        <g className="marks">
            {bins.map((bin, i) => {
                // Filter data points within the hexbin area
                const binData = data.filter(d => {
                    const coords = projection(d.coords);
                    return (
                        coords[0] >= bin.x - hexbinSize && coords[0] <= bin.x + hexbinSize &&
                        coords[1] >= bin.y - hexbinSize && coords[1] <= bin.y + hexbinSize
                    );
                });

                // Filter valid data points for mean calculation; exclude 0
                const validDataPoints = binData.filter(d => 
                    d[yValueField] != null &&         // Ensure field isn't null
                    d[yValueField] !== '' && 
                    !isNaN(d[yValueField]) &&          // Ensure it is a number
                    d[yValueField] > 0                 // Ensure the value is greater than 0
                );

                const meanValue = validDataPoints.length > 0 
                    ? validDataPoints.reduce((sum, d) => sum + d[yValueField], 0) / validDataPoints.length // Calculate mean
                    : 0; // Default to 0 if no valid points

                // Skip rendering if no valid data
                if (validDataPoints.length === 0) {
                    return null;
                }

                const fillColor = colorScale(meanValue); // Determine color based on mean

                return (
                    <g key={i}
                       onMouseEnter={(e) => {
                           setTooltip({
                               display: 'block',
                               x: e.clientX,
                               y: e.clientY,
                               content: [
                                   `Number of Data Points: ${validDataPoints.length}`,  // Display number of valid points
                                   `Mean Value: ${meanValue.toFixed(2)}`   // Display the calculated mean
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