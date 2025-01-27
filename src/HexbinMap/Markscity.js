import { geoMercator } from 'd3-geo';


  const Width = 900;
  const Height = 900;

  const projection = geoMercator()
      .center([10.537004, 52.210297])
      .scale(125000)
      .translate([Width / 2, Height / 2]);

const locations = [
  { name: "DLR", coords: [10.5613, 52.3152] },
  { name: "Braunschweig Rathaus", coords: [10.5263, 52.2643] },
  { name: "Braunschweig Hbf", coords: [10.5396, 52.2520] },
  { name: "Wolfenbüttel Bahnhof", coords: [10.5320, 52.1592] },
  { name: "Wolfenbüttel Schloßplatz", coords: [10.5316, 52.1627] },
];

export const Markscity = () => (
  <g className="markscity">
    {locations.map((location, index) => {
      const [x, y] = projection(location.coords);
      return (
        <g key={index}> 
          <circle 
            cx={x} 
            cy={y} 
            r={4}
            fill="black" 
          />
          <text
            className="braunschweig"
            textAnchor="left" 
            x={x + 6} 
            y={y + 9 }
          >
            {location.name}
          </text>
        </g>
      );
    })}
  </g>
);