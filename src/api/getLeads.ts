import { axiosInstance } from "./refreshToken"

export const getLeads = async (accessToken: string, account_name: string) => {
    try {
        const response = await axiosInstance.get(`${account_name}/api/v4/leads`, {
            headers: { 'Authorization': 'Bearer ' + accessToken }
        })

        if (response && response.status == 200) {
            localStorage.setItem('leads', JSON.stringify(response.data?._embedded?.leads || []));
        }
        return response.data._embedded?.leads
    }
    catch (err) {
        console.log(err)
    }
}