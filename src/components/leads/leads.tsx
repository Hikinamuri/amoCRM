import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Lead, Task } from "../..//types/types";
import LeadsAPI from "../../api/LeadsAPI";
import { getTasks } from "../../api/getTasks";
import { LeadCard } from "./lead/lead";
import Loader from "../loader/loader";

export const Leads = () => {
    const accessToken = localStorage.getItem('accessToken');
    const account_name = localStorage.getItem('account_name');

    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(false);
    const [openCardId, setOpenCardId] = useState<string | null>(null); 
    const [loadingCardId, setLoadingCardId] =  useState<string | null>(null)
    const [detailedData, setDetailedData] = useState<{ [key: string]: Lead }>({});

    const fetchDealDetails = async (leadId: string) => {
        setLoadingCardId(leadId);

        if(!accessToken || !account_name) return

        try {
            const leadData = await LeadsAPI.getLead(accessToken, account_name, leadId)
            
            setDetailedData((prev) => ({
                ...prev,
                [leadId]: leadData?.data,
            }));
            getTasksData()
            setLoadingCardId(null);
        } catch (error) {
            console.error("Ошибка при загрузке данных:", error);
            setLoadingCardId(null);
        }
    };

    const getTasksData = async () => {
        if(!accessToken || !account_name) return

        let tasksArray;

        const cachedTasks = localStorage.getItem('tasks');

        if (cachedTasks) {
            tasksArray = JSON.parse(cachedTasks);
        } else {
            const tasks = await getTasks(accessToken, account_name)
    
            if (!tasks) return

            tasksArray = tasks;
            localStorage.setItem('tasks',  JSON.stringify(tasksArray))
        }

        const sortedTasks = tasksArray.sort((a: Task, b: Task) => a.complete_till - b.complete_till);

        sortedTasks.forEach((task: Task) => {
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
                const leadsData = await LeadsAPI.getLeads(accessToken, account_name)
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
            {loading ? <Loader /> : (
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
                            <LeadCard
                                key={index}
                                lead={lead}
                                detailedData={detailedData}
                                openCardId={openCardId}
                                loadingCardId={loadingCardId}
                                toggleCard={toggleCard}
                            />
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}