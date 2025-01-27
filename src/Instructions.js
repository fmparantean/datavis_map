import React from 'react'; 

const Instructions = () => {
    return (
        <div className="instructions">
            <h3>How to Operate</h3>
            <ul>
                <li>If you see that these texts are covering the map, please ZOOM OUT (ctrl/command -) your browser.</li>
                <li>The displayed data on the hexbin map is based on the highlighted area marked on the histogram.</li>
                <li>Move the "brush" extension (blue square) on the histogram to display and change the data in the hexbin map. You can adjust the brush function by sliding it left or right, and resizing it by clicking and dragging on the edge, in or out.</li>
                <li>On the Filters, you can choose your preferred data to display on the histogram and hexbin map. Adjust your hexagonal size in “Hexbin size filter".</li>
                <li>Point your mouse at a specific hexagonal shape on the map to find out its mean value and how many data points are contained within.</li>
            </ul>
        </div>
    );
};

export default Instructions;