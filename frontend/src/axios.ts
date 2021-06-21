import Axios, { AxiosInstance } from "axios";

const axios: AxiosInstance = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
    withCredentials: true,
});

export default axios;
