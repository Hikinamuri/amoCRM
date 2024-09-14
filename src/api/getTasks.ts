import { axiosInstance } from "./refreshToken"

export const getTasks = async (accessToken: string) => {
    try {
        const response = await axiosInstance.get(`/api/v4/tasks`, {
            headers: { 'Authorization': 'Bearer ' + accessToken }
        })

        if (response && response.status == 200) {
            localStorage.setItem('tasks', JSON.stringify(response.data?._embedded?.tasks || []));
        }
        return response.data._embedded?.tasks
    }
    catch (err) {
        console.log(err)
    }
}