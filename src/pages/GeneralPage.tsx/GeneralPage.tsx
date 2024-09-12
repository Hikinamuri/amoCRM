import axios from "axios";
import { useEffect, useMemo, useState } from "react";

export const GeneralPage = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(false);

    const getAuthorizationToken = () => {
        window.location.href = 'https://www.amocrm.ru/oauth?client_id=38d7c8d2-61f8-4f34-a27f-2bfb59f749c3&state={state}&mode=popup';
    }
    
    const getLeads = async () => {
        const accessToken = localStorage.getItem('accessToken');
        const account_name = localStorage.getItem('account_name');

        if(!accessToken && !account_name) {
            return
        }

        const cachedLeads = localStorage.getItem('leads');

        if (cachedLeads) {
            setLeads(JSON.parse(cachedLeads))
        } else {
            setLoading(true);
            try {
                const response = await axios.get(`https://${account_name}/api/v4/leads`, {
                    headers: { 'Authorization': 'Bearer ' + accessToken }
                })

                console.log(response.data?._embedded?.leads);

                const leadsData = response.data?._embedded?.leads || [];
                setLeads(leadsData);
                localStorage.setItem('leads', JSON.stringify(leadsData));
            }
            finally {
                setLoading(false);
            }
        }
    }

    const memoizedLeads = useMemo(() => leads, [leads]);

    useEffect(() => {
        getLeads();
    }, []);
        
    return (
        <div>
            <button onClick={getAuthorizationToken}>Click me</button>
            
            {loading ? <p>Загрузка...</p> : (
                <ul>
                    {memoizedLeads.map(lead => (
                        <li key={lead.id}>{lead.name}</li>
                    ))}
                </ul>
            )}
        </div>
    )
}