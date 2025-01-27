export const Marks = ({
    data,
    xScale,
    yScale,
    xValue,
    yValue,
    circleRadius
}) => {
    if (!data || data.length === 0) {
        console.warn("No data available for rendering!");
        return null;
    }
    
    return (
        <g className="marksline">
            {data.map((d, index) => (
                <circle
                    key={index}
                    cx={xScale(["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][xValue(d)])} // Modified to use xValue for DayOrder
                    cy={yScale(yValue(d))}
                    r={circleRadius}
                    fill="red"
                    stroke="black"
                />
            ))}
        </g>
    );
};