import axios from "axios";

const baseUrlAxios = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}`
})

export default baseUrlAxios;