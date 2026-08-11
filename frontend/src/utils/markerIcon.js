import L from "leaflet";

export const createColoredIcon = (color) =>
  L.divIcon({
    className: "custom-marker", 
    html: `
      <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
        <path fill="${color}" stroke="#000" stroke-width="1"
          d="M12.5 0C5.6 0 0 5.6 0 12.5c0 9.4 12.5 28.5 12.5 28.5S25 21.9 25 12.5C25 5.6 19.4 0 12.5 0z"/>
        <circle cx="12.5" cy="12.5" r="5" fill="#fff"/>
      </svg>
    `,
    iconSize: [25, 41],
    iconAnchor: [12, 41],   
    popupAnchor: [0, -41],
  });