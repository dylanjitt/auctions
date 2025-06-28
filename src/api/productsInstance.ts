import axios from 'axios';
const API_URL = import.meta.env.VITE_API_PRODUCTS_URL;
console.log("API_URL2:", API_URL);
const jsonServerProductInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default jsonServerProductInstance;