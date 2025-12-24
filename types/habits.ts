export type Priority = 'low' | 'mid' | 'high';

export type Habit = {
    id: number | string;
    title: string;
    priority: Priority;
    createdAt: string;
    lastDoneAt: string | null;
    streak: number;
}
