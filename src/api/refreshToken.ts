import axios from "axios";
import { useEffect } from "react";

const account_name = localStorage.getItem('account_name');

const refreshToken = async () => {
    try {
        const refresh_token = localStorage.getItem("refreshToken");
        const response = await axios.post("/auth/refresh", { token: refresh_token });
        const newAccessToken = response.data.accessToken;

        // Сохраняем новый accessToken в localStorage
        localStorage.setItem("accessToken", newAccessToken);

        return newAccessToken;
    } catch (error) {
        console.error("Ошибка обновления токена", error);
        return null;
    }
}

export const axiosInstance = axios.create({
    baseURL: `https://${account_name}`,
})

axiosInstance.interceptors.response.use(
    (responce) => responce,
    async (error) => {
        if(error.responce && error.responce.status === 403) {
            try {
                const newToken = await refreshToken();
                axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`

                const originalRequest = error.config;
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`

                return axios(originalRequest)
            }
            catch (refreshError) {
                return Promise.reject(refreshError)
            }
        }
        return Promise.reject(error)
    }
)