import { Habit, Priority } from "@/types/habits";
import { isSameDay, isYesterday, toISO } from "@/utils/date";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from "react";

type State = {
    loading: boolean;
    habits: Habit[];
}

type HabitsContextType = {
    habits: Habit[];
    loading: boolean;
    addHabit: (title: string, priority?: Priority) => void;
    toggleHabit: (id: number | string) => void;
};

type Action =
    | { type: 'HYDRATE'; payload: Habit[]; }
    | { type: 'ADD'; title: string; priority: Priority | undefined; }
    | { type: 'TOGGLE'; id: number | string; today: Date; }

const STORAGE_KEY = 'habits:v1';

const initialState: State = {
    loading: true,
    habits: [],
}

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'HYDRATE':
            return { loading: false, habits: action.payload }
        case 'ADD': {
            const now = new Date();
            const newHabit: Habit = {
                id: Date.now(),
                title: action.title,
                priority: action.priority ?? 'low',
                createdAt: toISO(now),
                lastDoneAt: null,
                streak: 0,
            }
            return { ...state, habits: [newHabit, ...state.habits] }
        }

        case 'TOGGLE': {
            const { id, today } = action;
            const todayISO = toISO(today);
            const update = state.habits.map((habit) => {
                if (habit.id !== id) return habit;
                const last = habit.lastDoneAt ? new Date(habit.lastDoneAt) : null;
                const todayCompleted = last ? isSameDay(last, today) : false;

                if (todayCompleted) {
                    return {
                        ...habit,
                        streak: Math.max(0, habit.streak - 1),
                        lastDoneAt: null,
                    }
                }

                let newStreak = 1;

                if (last && isYesterday(today, last)) {
                    newStreak = habit.streak + 1;
                } else {
                    newStreak = 1;
                }

                return {
                    ...habit,
                    streak: newStreak,
                    lastDoneAt: todayISO,
                }
            })
            return { ...state, habits: update }
        }
        default:
            return state;
    }
}


const HabitsContext = createContext<HabitsContextType | null>(null);

export function HabitsProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        (async () => {
            try {
                const raw = await AsyncStorage.getItem(STORAGE_KEY);
                if (raw) {
                    dispatch({ type: 'HYDRATE', payload: JSON.parse(raw) });
                } else {
                    dispatch({ type: 'HYDRATE', payload: [] });
                }
            } catch (error) {
                console.warn('No se pudo cargar los hábitos');
                dispatch({ type: 'HYDRATE', payload: [] });
            }
        })()
    }, [])

    const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (state.loading) return;
        if (saveTimer.current) clearTimeout(saveTimer.current);

        saveTimer.current = setTimeout(async () => {
            try {
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state.habits));
            } catch (error) {
                console.warn('No se pudo guardar los hábitos');
            }
        }, 250);

        return () => {
            if (saveTimer.current) clearTimeout(saveTimer.current);
        }
    }, [state.habits, state.loading])

    const addHabit = useCallback((title: string, priority?: Priority) => {
        const clean = title.trim();
        if (!clean) return;
        dispatch({ type: 'ADD', title: clean, priority });
    }, [])

    const toggleHabit = useCallback((id: number | string) => {
        dispatch({ type: 'TOGGLE', id, today: new Date() });
    }, [])

    const value = useMemo(() => ({
        loading: state.loading,
        habits: state.habits,
        addHabit,
        toggleHabit,
    }), [state.loading, state.habits, addHabit, toggleHabit])

    return (
        <HabitsContext.Provider value={value}>
            {children}
        </HabitsContext.Provider>
    )
}

export function useHabits() {
    const ctx = useContext(HabitsContext);
    if (!ctx) throw new Error('useHabits debe usarse dentro de un HabitsProvider');
    return ctx;
}