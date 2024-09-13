import axios from "axios";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const CallbackPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const exchangeAuthCodeForToken = async (authorizationCode: string, account_name: string) => {
        try {
            const response = await axios.post(`https://${account_name}/oauth2/access_token`, {
                client_id: "38d7c8d2-61f8-4f34-a27f-2bfb59f749c3",
                client_secret: "ifPhOPAkcINzSz0vbFx8Op9n12H52uaDecT2nsIVHZPKjnHd0XhhZzVZxTOtiWA7",
                grant_type: "authorization_code",
                code: authorizationCode,
                redirect_uri: "http://localhost:5173/callback",
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