import React from 'react';
import { hexbin } from 'd3-hexbin'; 
import { Marks } from './Marks';
import { Markscity } from './Markscity';
import { geoMercator } from 'd3-geo';

export const Hexbinmap = ({ data, worldAtlas, yValueField, hexbinSize }) => {
    const svgHeight = 900;
    const svgWidth = 900;

    const projection = geoMercator()
        .center([10.537, 52.210])
        .scale(125000)
        .translate([svgWidth / 2, svgHeight / 2]);

    const hexbinGenerator = hexbin()
        .extent([[0, 0], [svgWidth, svgHeight]])
        .radius(hexbinSize); 

    const projectedData = data.map(d => {
        const coords = projection(d.coords); 
        return { ...d, x: coords[0], y: coords[1] };
    });

    const bins = hexbinGenerator(projectedData.map(d => [d.x, d.y]));

    return (
        <>
            <svg width={svgWidth} height={svgHeight}>
                <Marks bins={bins} data={projectedData} yValueField={yValueField} hexbinSize={hexbinSize} /> 
                <Markscity data={projectedData} projection={projection} /> 
            </svg>
        </>
    );
};