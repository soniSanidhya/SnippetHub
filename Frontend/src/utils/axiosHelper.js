import axios from 'axios';

export const api = axios.create(
    {
        baseURL : "https://snippethub-backend.vercel.app/api",
        headers : {
            "Content-Type" : "application/json",
        }
        ,withCredentials : true
    }
)