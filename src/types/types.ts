export interface Lead {
    id: string;
    name: string;
    price: number;
    status_id?: number;
    created_at: number;
    testTask: string;
    closestTask: string;
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
    complete_till: number;
    entity_id: string;
    is_completed: boolean;
}