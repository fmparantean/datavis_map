import { useEffect, useState } from 'react';
import { csv } from 'd3';

export const useData = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        // csv('/dataku.csv') // Load from public directory
        csv(process.env.PUBLIC_URL + '/dataku.csv')
            .then(rawData => {
                const processedData = rawData.map(row => {
                    const date = new Date(row.Timestamp);
                    const dayOrder = date.getUTCDay();
                    const gender = row.Gender === "1.0" ? "Male" : "Female"; 
                    return {
                        Timestamp: date,
                        DayOrder: dayOrder,
                        Participant: row.Participant,
                        coords: row['Location Coordinates']
                            .split(',')
                            .map(coord => +coord.trim())
                            .reverse(),
                        Gender: gender,
                        ModeButton_xs: row.ModeButton_xs,
                        HR_mad_filtered: +row.HR_mad_filtered || 0,
                        HRV: +row.HRV || 0,
                        stress_xs: +row.stress_xs || 0,
                        satisfaction_journey_xs: +row.satisfaction_journey_xs || 0,
                    };
                });

                setData(processedData);
            })
            .catch(error => {
                console.error("Error loading data:", error);
            });
    }, []);

    return data;
};