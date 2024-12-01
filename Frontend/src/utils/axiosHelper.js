import axios from 'axios';

export const api = axios.create(
    {
        baseURL : "https://snippethub-backend.vercel.app/api",
        // baseURL : "http://localhost:8000/api",
        headers : {
            "Content-Type" : "application/json",
        }
        ,withCredentials : true
    }
)