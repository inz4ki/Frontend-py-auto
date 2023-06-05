import axios from "axios";



export const http = axios.create({
    baseURL: 'https://apibot.stv.com.br/api/',  
});