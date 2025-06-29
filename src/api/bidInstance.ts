import axios from "axios";
const API_URL = import.meta.env.VITE_BID_URL;
console.log("API_URL3:", API_URL);
const bidInstance = axios.create({
  baseURL: API_URL, // <-- Aquí va el HOST del otro backend
  headers: {
    "Content-Type": "application/json"
  }
});

export default bidInstance;