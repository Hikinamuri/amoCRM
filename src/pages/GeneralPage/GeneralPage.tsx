import { useEffect } from "react";
import { Leads } from "../../components/leads/leads";

const GeneralPage = () => {
    const authUser = localStorage.getItem("accessToken")

    const getAuthorizationToken = () => {
        window.location.href = `https://www.amocrm.ru/oauth?client_id=${import.meta.env.VITE_CLIENT_ID}&state={state}&mode=popup`;
    }

    useEffect(() => {
        if (!authUser) {
            getAuthorizationToken()
        }
    }, [])
        
    return (
        <div>
            <Leads />
        </div>
    )
}

export default GeneralPage