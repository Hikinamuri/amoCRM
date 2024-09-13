export interface Lead {
    id: string;
    name: string;
    price: number;
    status_id?: number;
    created_at: number;
    testTask: string;
    tasks: Task[];
}

export interface LeadsProps {
    children: React.ReactNode;
}

export interface Task {
    id: string;
    name: string;
    price: number;
    status_id?: number;
    created_at: number;
    entity_id: string;
}