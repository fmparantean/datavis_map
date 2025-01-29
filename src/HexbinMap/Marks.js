import React, { useState } from 'react';
import * as d3 from 'd3'; 
import { hexbin as d3Hexbin } from 'd3-hexbin'; 

export const Marks = ({ bins, data, yValueField, hexbinSize, projection }) => {
    const [tooltip, setTooltip] = useState({ display: 'none', x: 0, y: 0, content: [] });

    // Fixed ranges for each yValueField
    const yValueRanges = {
        HR_mad_filtered: { 
            thresholds: [-3, -0.5, 0.3, 1.1, 2.6, 5], // Adjusted thresholds for HR_mad
            colors: ['#FFFF00', '#FFDA00', '#FF8C00', '#FF4500', '#FF0000']
        },
        HRV: { 
            thresholds: [1, 10, 20, 40, 70, 190], // Ranges for HRV
            colors: ['#FFFF00', '#FFDA00', '#FF8C00', '#FF4500', '#FF0000']
        },
        stress_xs: { 
            thresholds: [1, 2, 4, 6, 8, 10], // Ranges for Stress
            colors: ['#FFFF00', '#FFDA00', '#FF8C00', '#FF4500', '#FF0000']
        },
        satisfaction_journey_xs: { 
            thresholds: [0, 1, 5, 7, 8, 10], // Ranges for Satisfaction
            colors: ['#FFFF00', '#FFDA00', '#FF8C00', '#FF4500', '#FF0000']
        },
    };

    // Retrieve thresholds and colors based on the selected yValueField
    const { thresholds, colors } = yValueRanges[yValueField];

    // Create a color scale with thresholds
    const colorScale = d3.scaleThreshold()
        .domain(thresholds.slice(1)) // Exclude the first lower bound for color mapping
        .range(colors); // Define your color range

    return (
        <g className="marks">
            {bins.map((bin, i) => {
                const binData = data.filter(d => {
                    const coords = projection(d.coords);
                    return (
                        coords[0] >= bin.x - hexbinSize && 
                        coords[0] <= bin.x + hexbinSize &&
                        coords[1] >= bin.y - hexbinSize && 
                        coords[1] <= bin.y + hexbinSize
                    );
                });

                // Filter valid data points based on selected field rules
                const validDataPoints = binData.filter(d => 
                    d[yValueField] != null &&        
                    d[yValueField] !== '' && 
                    !isNaN(d[yValueField]) && // Ensure it's a valid number
                    (yValueField === 'HR_mad_filtered' || d[yValueField] > 0) // Allow negatives for HR_mad_filtered only
                );

                const meanValue = validDataPoints.length > 0 
                    ? validDataPoints.reduce((sum, d) => sum + d[yValueField], 0) / validDataPoints.length 
                    : 0; 

                if (validDataPoints.length === 0) {
                    return null; // Skip rendering if no valid data points
                }

                const fillColor = colorScale(meanValue); // Determine fill color using the scale

                return (
                    <g key={i}
                       onMouseEnter={(e) => {
                           setTooltip({
                               display: 'block',
                               x: 720,
                               y: 485,
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