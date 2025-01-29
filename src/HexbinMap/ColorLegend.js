import React, { useEffect } from 'react';
import * as d3 from 'd3';

const ColorLegend = ({ yValueField }) => {
    useEffect(() => {
        // Define the fixed ranges and colors for the legend inside useEffect
        const legendData = {
            HR_mad_filtered: [
                { range: '(-3) - (-0.5)', color: '#FFFF00' },
                { range: '(-0.5) - 0.3', color: '#FFDA00' },
                { range: '0.3 - 1.1', color: '#FF8C00' },
                { range: '1.1 - 2.6', color: '#FF4500' },
                { range: '2.6 - 5', color: '#FF0000' }
            ],
            HRV: [
                { range: '1 - 10', color: '#FFFF00' },
                { range: '10 - 20', color: '#FFDA00' },
                { range: '20 - 40', color: '#FF8C00' },
                { range: '40 - 70', color: '#FF4500' },
                { range: '70 - 190', color: '#FF0000' }
            ],
            stress_xs: [
                { range: '1 - 2', color: '#FFFF00' },
                { range: '2 - 4', color: '#FFDA00' },
                { range: '4 - 6', color: '#FF8C00' },
                { range: '6 - 8', color: '#FF4500' },
                { range: '8 - 10', color: '#FF0000' }
            ],
            satisfaction_journey_xs: [
                { range: '1 - 2', color: '#FFFF00' },
                { range: '2 - 4', color: '#FFDA00' },
                { range: '4 - 6', color: '#FF8C00' },
                { range: '6 - 8', color: '#FF4500' },
                { range: '8 - 10', color: '#FF0000' }
            ],
        };

        const svg = d3.select('#color-legend')
            .attr("width", 90)
            .attr("height", 200);

        const legendHeight = 20; // Height of each block

        svg.selectAll("*").remove(); // Clear previous contents

        // Render blocks and corresponding text for each range
        legendData[yValueField].forEach((entry, index) => {
            const rectY = index * legendHeight; // Positioning based on index

            // Draw rectangles
            svg.append("rect")
                .attr("x", 0)
                .attr("y", rectY)
                .attr("width", 15)
                .attr("height", legendHeight)
                .style("fill", entry.color); // Set color for each range

            // Add text labels next to the blocks
            svg.append("text")
                .attr("x", 20) // Adjacent to the blocks
                .attr("y", rectY + legendHeight / 2 + 5) // Center the text vertically
                .attr("font-size", "9px") // Adjust font size
                .attr("font-weight", "bold") // Make the font thicker
                .attr("text-anchor", "start")
                .text(entry.range); // Display the range
        });

    }, [yValueField]); // Recalculate when the yValueField changes

    return <svg id="color-legend" className="color-legend" />; // Add className here
};

export default ColorLegend;