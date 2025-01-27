import {
    scaleLinear,
    scaleBand,
    max,
    brushX,
    select,
    min
} from 'd3';
import { useRef, useEffect } from 'react';
import { AxisBottom } from './AxisBottom';
import { AxisLeft } from './AxisLeft';
import { Marks } from './Marks';

const margin = { top: 20, right: 10, bottom: 50, left: 90 };

export const DateHistogram = ({
    data,
    width,
    height,
    setBrushExtent,
    yValueField
}) => {
    const innerHeight = height - margin.top - margin.bottom;
    const innerWidth = width - margin.left - margin.right;

    const xScale = scaleBand()
        .domain(["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"])
        .range([0, innerWidth])
        .padding(0.1);

    const yValue = d => d[yValueField];
    const filteredData = data.filter(d => d[yValueField] != null && d[yValueField] !== '');
    const yScale = scaleLinear()
        .domain([min(filteredData, yValue), max(filteredData, yValue)])
        .range([innerHeight, 0])
        .nice();

    const brushRef = useRef();
    const initialBrushSet = useRef(false);

    useEffect(() => {
        const brush = brushX()
            .extent([[0, 0], [innerWidth, innerHeight]])
            .on('brush end', (event) => {
                const selection = event.selection;
                if (!selection) return;
                const selectedDays = xScale.domain().filter(day => {
                    const dayPosition = xScale(day);
                    return dayPosition >= selection[0] && dayPosition <= selection[1];
                });

                setBrushExtent(selectedDays);
            });

        brush(select(brushRef.current));

        select(brushRef.current)
            .selectAll('.handle')
            .attr('fill', 'rgba(6, 1, 38, 0.3)') 

        select(brushRef.current)
            .selectAll(".selection")
            .attr('fill', 'rgba(30, 64, 186, 0.46)') 
           
        if (!initialBrushSet.current) {
            const initialSelection = [0, innerWidth / 2];
            brush.move(select(brushRef.current), initialSelection);

            const initialSelectedDays = xScale.domain().filter(day => {
                const dayPosition = xScale(day);
                return dayPosition >= initialSelection[0] && dayPosition <= initialSelection[1];
            });
            setBrushExtent(initialSelectedDays);

            initialBrushSet.current = true;
        }
    }, [height, innerHeight, innerWidth, setBrushExtent, xScale]);

    const getYAxisLabel = (field) => {
        switch (field) {
            case 'HR_mad_filtered':
                return 'HR Mad Score';
            case 'HRV':
                return 'HRV Score';
            case 'stress_xs':
                return 'Stress Score';
            case 'satisfaction_journey_xs':
                return 'Satisfaction Score';
            default:
                return 'Score';
        }
    };

    return (
        <>
            <rect width={width} height={height} fill="white" />
            <g transform={`translate(${margin.left},${margin.top})`}>
                <AxisBottom
                    xScale={xScale}
                    innerHeight={innerHeight + 10}
                    tickFormat={d => d}
                />
                <AxisLeft
                    yScale={yScale}
                    innerWidth={innerWidth}
                />
                <Marks
                    data={filteredData}
                    xScale={xScale}
                    yScale={yScale}
                    xValue={d => d.DayOrder}  
                    yValue={yValue}
                    circleRadius={2.5}
                />
                <g ref={brushRef} />
                <text
                    className="axis-label"
                    textAnchor="middle"
                    transform={`translate(${innerWidth / 2}, ${innerHeight + 44})`} 
                >
                    Days of the Week
                </text>
                <text
                    className="axis-label"
                    textAnchor="middle"
                    transform={`translate(-30, ${innerHeight / 2}) rotate(-90)`} 
                >
                    {getYAxisLabel(yValueField)}
                </text>
            </g>
        </>
    );
};