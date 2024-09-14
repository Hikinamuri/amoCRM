import { axiosInstance } from "./refreshToken"

class LeadsAPI {
    public static getLeads = async (accessToken: string) => {
        try {
            const response = await axiosInstance.get(`/api/v4/leads`, {
                headers: { 'Authorization': 'Bearer ' + accessToken }
            })
    
            if (response && response.status == 200 && response.data._embedded?.leads.length > 0) {
                localStorage.setItem('leads', JSON.stringify(response.data?._embedded?.leads || []));
            }
            return response.data._embedded?.leads
        }
        catch (err) {
            console.log(err)
        }
    }
    public static getLead = async (accessToken: string, leadId: string) => {
        try {
            const response = await axiosInstance.get(`/api/v4/leads/${leadId}`, {
                headers: { 'Authorization': 'Bearer ' + accessToken }
            })

            return response
        }
        catch (err) {
            console.log(err)
        }
    }
}

export default LeadsAPI;