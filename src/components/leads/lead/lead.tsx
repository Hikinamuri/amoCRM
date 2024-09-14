import { Lead } from "../../../types/types";
import Loader from "../../loader/loader";

interface LeadCardProps {
    lead: Lead;
    detailedData: { [key: string]: Lead };
    openCardId: string | null;
    loadingCardId: string | null;
    toggleCard: (leadId: string) => void;
}

export const LeadCard = ({ lead, detailedData, openCardId, loadingCardId, toggleCard, }: LeadCardProps) => {
    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('ru-RU');
    };
    
    const getStatusColor = (dueDate: Date) => {
        const now = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(now.getDate() + 1);
    
        if (dueDate.toDateString() === now.toDateString()) return 'green';
        if (dueDate < now) return 'red'
        else {
            return 'yellow'
        }
    };

    return (
        <>
            <tr onClick={() => toggleCard(lead.id)} style={{ cursor: 'pointer' }}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{lead.name}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{lead.id}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{lead.price}</td>
            </tr>
            {openCardId === lead.id && (
                <tr>
                    <td colSpan={3} style={{ border: '1px solid #ddd', padding: '8px' }}>
                        {loadingCardId === lead.id ? (
                            <Loader />
                        ) : (
                            detailedData[lead.id] && (
                                <div>
                                    <p>{detailedData[lead.id].name}</p>
                                    <p>{detailedData[lead.id].id}</p>
                                    {detailedData[lead.id].tasks ? (
                                        <p>
                                            Статус задачи: 
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle
                                                    cx="8"
                                                    cy="8"
                                                    r="8"
                                                    fill={getStatusColor(new Date(detailedData[lead.id].tasks[0].complete_till * 1000))}
                                                />
                                            </svg>
                                            {formatDate(detailedData[lead.id].tasks[0].complete_till)}
                                        </p>
                                    ) : (
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle
                                                cx="8"
                                                cy="8"
                                                r="8"
                                                fill='red'
                                            />
                                        </svg>
                                    )}
                                </div>
                            )
                        )}
                    </td>
                </tr>
            )}
        </>
    );
};
