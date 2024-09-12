import axios from "axios";
import { useContext } from "react";

export const GeneralPage = () => {

    const getAuthorizationToken = () => {
        window.location.href = 'https://www.amocrm.ru/oauth?client_id=38d7c8d2-61f8-4f34-a27f-2bfb59f749c3&state={state}&mode=popup';
    }
    
        
    return (
        <div>
            <button onClick={getAuthorizationToken}>Click me</button>
        </div>
    )
}