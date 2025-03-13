export type Status = 'todo' | 'inProgress' | 'done';

export type Task = {
    title: string;
    description: string;
    status: Status
}