// src/config.ts

const API_PORT = 5001;
export const BASE_URL = `${window.location.protocol}//${window.location.hostname}:${API_PORT}`;


//soll angeblich bei Problemen mit coockies helfen da diese ansonsten 127.0.0.1<>localhost erkennen
// export const BASE_URL = "http://localhost:5001";
// MacM4 läst nur den Start auf 127... zu 