import React from 'react';

const Filters = ({ 
    participant, 
    setParticipant, 
    gender, 
    setGender, 
    modeButton, 
    setModeButton,
    yValueField,
    setYValueField,
    uniqueParticipants,
    hexbinSize,
    setHexbinSize
}) => {
    return (
        <div className="filters"> 
            <h3>Filters</h3>
            <div>
                <label>
                    Participant:
                    <select className="select-dropdown" value={participant} onChange={e => setParticipant(e.target.value)}>
                        <option value="All">All</option>
                        {uniqueParticipants.map((p) => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>
                </label>
            </div>
            <div>
                <label>
                    Gender:
                    <select className="select-dropdown" value={gender} onChange={e => setGender(e.target.value)}>
                        <option value="Both">All</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </label>
            </div>
            <div>
                <label>
                    Mode Button:
                    <select className="select-dropdown" value={modeButton} onChange={e => setModeButton(e.target.value)}>
                        <option value="Both">All</option>
                        <option value="ButtonBus">Bus</option>
                        <option value="ButtonTrain">Train</option>
                        <option value="ButtonTram">Tram</option>     
                    </select>
                </label>
            </div>
            <div>
                <label>
                    Y-Value:
                    <select className="select-dropdown" value={yValueField} onChange={e => setYValueField(e.target.value)}>
                        <option value="HRV">HRV</option>
                        <option value="HR_mad_filtered">HR_mad</option>
                        <option value="stress_xs">Stress</option>
                        <option value="satisfaction_journey_xs">Satisfaction</option>
                    </select>
                </label>
            </div>
            <div>
                <label>
                    Hexbin Size:
                    <select className="select-dropdown" value={hexbinSize} onChange={e => setHexbinSize(Number(e.target.value))}>
                        <option value={5}>5</option>
                        <option value={6}>6</option>
                        <option value={7}>7</option>
                        <option value={8}>8</option>
                        <option value={9}>9</option>
                        <option value={10}>10</option>
                    </select>
                </label>
            </div>
        </div>
    );
};

export default Filters;
