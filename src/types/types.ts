export interface Lead {
    id: string;
    name: string;
    price: number;
    status_id?: number;
    created_at: number;
}

export interface LeadsProps {
    children: React.ReactNode;
}