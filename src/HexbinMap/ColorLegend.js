import React, { useEffect } from 'react';
import * as d3 from 'd3';

const ColorLegend = ({ colorScale }) => {
    useEffect(() => {
        const svg = d3.select('#color-legend')
            .attr("width", 70) 
            .attr("height", 300);

        const legendWidth = 20;
        const legendHeight = 100;
        svg.selectAll("*").remove();

    
        const gradient = svg.append("defs")
            .append("linearGradient")
            .attr("id", "gradient")
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "0%") 
            .attr("y2", "100%");

     
        const domain = colorScale.domain();
        const minValue = domain[0];
        const maxValue = domain[domain.length - 1];

  
        const numStops = 5; 
        for (let i = 0; i <= numStops; i++) {
            const value = minValue + (i / numStops) * (maxValue - minValue); 
            
            gradient.append("stop")
                .attr("offset", `${(i / numStops) * 100}%`)
                .attr("stop-color", colorScale(value)); 
        }

       
        svg.append("rect")
            .attr("class", "gradient-rect")
            .attr("x", 0)
            .attr("y", 20)
            .attr("width", legendWidth)
            .attr("height", legendHeight)
            .style("fill", "url(#gradient)");

       
        const ticks = colorScale.ticks(numStops); 
        ticks.forEach((tick, index) => {
            svg.append("text")
                .attr("class", "legend-tick") 
                .attr("x", legendWidth + 5) 
                .attr("y", (index / (ticks.length - 1)) * legendHeight + 20) 
                .attr("text-anchor", "start") 
                .text(tick.toFixed(2)); 
        });

    }, [colorScale]);

    return <svg id="color-legend"></svg>; 
};

export default ColorLegend;