import React, { useEffect, useState } from 'react';
import { hexbin } from 'd3-hexbin'; 
import { Marks } from './Marks';
import { Markscity } from './Markscity'; 
import { geoMercator } from 'd3-geo';

export const Hexbinmap = ({ data, yValueField, hexbinSize }) => {
    const svgHeight = 900;
    const svgWidth = 900;

    const projection = geoMercator()
        .center([10.537, 52.210])
        .scale(125000)
        .translate([svgWidth / 2, svgHeight / 2]);

    const createHexbinGenerator = (size) => {
        return hexbin()
            .extent([[0, 0], [svgWidth, svgHeight]])
            .radius(size);
    };

    const [bins, setBins] = useState([]);
    const [projectedData, setProjectedData] = useState([]);

    useEffect(() => {
        const newData = data.map(d => {
            const coords = projection(d.coords); 
            return { ...d, x: coords[0], y: coords[1] };
        });

        setProjectedData(newData);

        // Filter valid data points before generating bins
        const validHexbinData = newData.filter(d => 
            d[yValueField] != null && 
            d[yValueField] !== '' && 
            !isNaN(d[yValueField]) && 
            d[yValueField] > 0
        );

        const hexbinGenerator = createHexbinGenerator(hexbinSize);
        const newBins = hexbinGenerator(validHexbinData.map(d => [d.x, d.y]));
        setBins(newBins);
    }, [data, yValueField, hexbinSize, projection]);

    return (
        <svg width={svgWidth} height={svgHeight}>
            <Marks bins={bins} data={projectedData} yValueField={yValueField} hexbinSize={hexbinSize} projection={projection} />
            <Markscity projectedData={projectedData} /> 
        </svg>
    );
};