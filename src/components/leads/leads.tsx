import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Lead, LeadsProps, Task } from "../..//types/types";
import { getLeads } from "../../api/getLeads";

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
            const leadData = await axios.get(`https://${account_name}/api/v4/leads/${leadId}`, {
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            });
            
            setDetailedData((prev) => ({
                ...prev,
                [leadId]: leadData.data,
            }));
            getTasks()
            setLoadingCardId(null);
        } catch (error) {
            console.error("Ошибка при загрузке данных:", error);
            setLoadingCardId(null);
        }
    };

    const getTasks = async () => {
        if(!accessToken || !account_name) return

        let tasksArray;

        const cachedTasks = localStorage.getItem('tasks');

        if (cachedTasks) {
            tasksArray = JSON.parse(cachedTasks);
        } else {
            const tasks = await axios.get(`https://${account_name}/api/v4/tasks`, {
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            });
    
            if (!tasks) return

            tasksArray = tasks.data._embedded.tasks;
            localStorage.setItem('tasks',  JSON.stringify(tasksArray))
        }

        console.log(tasksArray)

        tasksArray.forEach((task: Task) => {
            const leadId = task.entity_id;
            const taskId = task.id;
            const taskData = {...task}

            if (taskId && leadId) {
                setDetailedData((prev) => {
                    return {
                        ...prev,
                        [leadId]: {
                            ...prev[leadId],
                            tasks: [taskData],
                        },
                    }
                });
            }
        });
    }

    const toggleCard = (leadId: string) => {
        if (openCardId === leadId) {
            setOpenCardId(null);
        } else {
            setOpenCardId(leadId);
            if (!detailedData[leadId]?.id) {
                fetchDealDetails(leadId);
            }
        }
    };

    
    const getLeadsData = async () => {
        if(!accessToken || !account_name) {
            return
        }

        const cachedLeads = localStorage.getItem('leads');
        
        if (cachedLeads) {
            setLeads(JSON.parse(cachedLeads))
        } else {
            setLoading(true);
            try {
                const leadsData = await getLeads(accessToken, account_name)
                setLeads(leadsData);
            }
            finally {
                setLoading(false);
            }
        }
    }

    const memoizedLeads = useMemo(() => leads, [leads]);


    useEffect(() => {
        getLeadsData();
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
                                                        {detailedData[lead.id].tasks ? (
                                                            <p>{new Date(detailedData[lead.id]?.tasks[0].complete_till * 1000).toLocaleDateString()}</p>
                                                        ) : null}
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