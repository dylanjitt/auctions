import axios from "axios";

const bidInstance = axios.create({
  baseURL: "http://localhost:3003/api", // <-- Aquí va el HOST del otro backend
  headers: {
    "Content-Type": "application/json"
  }
});

export default bidInstance;