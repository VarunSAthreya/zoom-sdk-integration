import Axios, { AxiosInstance } from "axios";

const axios: AxiosInstance = Axios.create({
    baseURL: "http://localhost:8000",
    withCredentials: true,
});

export default axios;
