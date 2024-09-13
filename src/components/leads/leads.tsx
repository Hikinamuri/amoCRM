import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Lead, LeadsProps } from "../..//types/types";

export const Leads = ({ children }: LeadsProps) => {
    const accessToken = localStorage.getItem('accessToken');
    const account_name = localStorage.getItem('account_name');
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(false);
    const [openCardId, setOpenCardId] = useState<string | null>(null); 
    const [loadingCardId, setLoadingCardId] =  useState<string | null>(null)
    const [detailedData, setDetailedData] = useState<{ [key: string]: Lead }>({});

    const fetchDealDetails = async (leadId: string) => {
        setLoadingCardId(leadId);
        try {
            const response = await axios.get(`https://${account_name}/api/v4/leads/${leadId}`, {
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            });
            setDetailedData((prev) => ({
                ...prev,
                [leadId]: response.data,
            }));
            setLoadingCardId(null);
        } catch (error) {
            console.error("Ошибка при загрузке данных:", error);
            setLoadingCardId(null);
        }
    };

    const toggleCard = (leadId: string) => {
        if (openCardId === leadId) {
            setOpenCardId(null);
        } else {
            setOpenCardId(leadId);
            if (!detailedData[leadId]) {
                fetchDealDetails(leadId);
            }
        }
    };

    
    const getLeads = async () => {
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
            {children}
            {loading ? <p>Загрузка...</p> : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', color: 'white' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Название сделки</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Сумма сделки</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {memoizedLeads.map((lead, index) => (
                            <div key={index}>
                                <tr onClick={() => toggleCard(lead.id)} style={{ cursor: 'pointer' }}>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{lead.name}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{lead.id}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{lead.price}</td>
                                </tr>
                                {openCardId === lead.id && (
                                    <tr>
                                        <td colSpan={3} style={{ border: '1px solid #ddd', padding: '8px' }}>
                                            {loadingCardId === lead.id ? (
                                                <p>Загрузка...</p>
                                            ) : (
                                                detailedData[lead.id] && (
                                                    <div>
                                                        <p>{detailedData[lead.id].name}</p>
                                                        <p>{detailedData[lead.id].id}</p>
                                                        <p>{new Date(detailedData[lead.id].created_at * 1000).toLocaleDateString()}</p>
                                                        <p>{detailedData[lead.id].price}</p>
                                                    </div>
                                                )
                                            )}
                                        </td>
                                    </tr>
                                )}
                            </div>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}