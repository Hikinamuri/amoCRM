import axios from "axios";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const CallbackPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const exchangeAuthCodeForToken = async (authorizationCode: string, account_name: string) => {
        try {
            const response = await axios.post(`https://${account_name}/oauth2/access_token`, {
                client_id: import.meta.env.VITE_CLIENT_ID,
                client_secret: import.meta.env.VITE_CLIENT_SECRET,
                grant_type: "authorization_code",
                code: authorizationCode,
                redirect_uri: import.meta.env.VITE_REDIRECT_URI,
            });
    
            if (response) {
                try {
                    localStorage.setItem("accessToken", response.data.access_token);
                    localStorage.setItem("refreshToken", response.data.refresh_token);
                    navigate('/home')
                }
                catch {
                    console.log("Ошибка установки токена")
                }
            }
        } catch (error) {
            console.error("Ошибка при получении access token:", error);
        }
    };
    

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const authorizationCode = params.get("code");
        const account_name = params.get('referer')

        if (authorizationCode && account_name) {
            localStorage.setItem("account_name", account_name);
            exchangeAuthCodeForToken(authorizationCode, account_name)
        }
    }, [location, navigate]);

    return null
};