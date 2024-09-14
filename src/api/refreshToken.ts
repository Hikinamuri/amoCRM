/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosAdapter, AxiosRequestConfig, AxiosPromise } from 'axios';

// const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const refreshToken = async () => {
    try {
        const refresh_token = localStorage.getItem("refreshToken");
        const response = await axios.post(`/oauth2/access_token`, 
        {
            client_id: import.meta.env.VITE_CLIENT_ID,
            client_secret: import.meta.env.VITE_CLIENT_SECRET,
            grant_type: "refresh_token",
            refresh_token: refresh_token,
            redirect_uri: import.meta.env.VITE_REDIRECT_URI,
        });
        const newAccessToken = response.data.access_token;
        const newRefreshToken = response.data.refresh_token;

        localStorage.setItem("accessToken", newAccessToken);
        localStorage.setItem("refreshToken", newRefreshToken);        

        return newAccessToken;
    } catch (error) {
        console.error("Ошибка обновления токена", error);
        return null;
    }
}

const delayAdapter = (adapter: AxiosAdapter, delay: number): AxiosAdapter => {
    return (config: AxiosRequestConfig): AxiosPromise<any> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(adapter(config));
            }, delay);
        });
    };
};

export const axiosInstance = axios.create({
    baseURL: '/',
});

axiosInstance.defaults.adapter = delayAdapter(axios.defaults.adapter as AxiosAdapter, 334);

axiosInstance.interceptors.response.use(                                                                         
    (responce) => responce,
    async (error) => {
        if(error.response && error.response.status === 401) {
            try {
                const newToken = await refreshToken();
                axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`

                const originalRequest = error.config;
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`

                return axios(originalRequest);
            }
            catch (refreshError) {
                return Promise.reject(refreshError)
            }
        }
        return Promise.reject(error)
    }
)