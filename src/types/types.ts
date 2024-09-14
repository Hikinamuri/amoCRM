export interface Lead {
    id: string;
    name: string;
    price: number;
    responsible_user_id: number;
    group_id: number;
    created_at: number;
    closestTask: string;
    tasks: Task[];
}

export interface LeadsProps {
    children: React.ReactNode;
}

export interface Task {
    id: string;
    status_id?: number;
    complete_till: number;
    entity_id: string;
    is_completed: boolean;
    text: string;
}