import { useThemeColor } from "@/hooks/use-theme-color";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";

type Props = {
    title: string;
    streak: number;
    isCompleted?: boolean;
    priority?: 'low' | 'mid' | 'high';
}

const priorityStyles = {
    low: {
        backgroundColor: '#ecfccb',
        color: '#3f6212',
    },
    mid: {
        backgroundColor: '#fef9c3',
        color: '#92400e',
    },
    high: {
        backgroundColor: '#ffe4e6',
        color: '#9f1239',
    },
} as const;

export default function HabitCard({ title, streak, isCompleted = false, priority = 'low' }: Props) {
    const card = useThemeColor({}, 'surface')
    const border = useThemeColor({}, 'border')
    const p = priorityStyles[priority];
    return (
        <ThemedView style={[styles.card, { backgroundColor: card, borderColor: border }, isCompleted && styles.cardDone]}>
            <View style={styles.row}>
                <ThemedText style={styles.title}>{title}</ThemedText>
                <ThemedText style={[styles.badge, { backgroundColor: p.backgroundColor, color: p.color }]}>
                    {priority}
                </ThemedText>
            </View>
            <View style={styles.row}>
                {isCompleted && <ThemedText style={styles.badge}>✔ Hoy</ThemedText>}
                <ThemedText style={styles.streak}>🔥 {streak} dias</ThemedText>
            </View>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 12,
        padding: 16,
        gap: 6,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#31475dff',
    },
    cardDone: {
        borderColor: '#22c55e',
        borderWidth: 1,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        flexShrink: 1,
    },
    badge: {
        fontSize: 12,
    },
    streak: {
        fontSize: 12,
    }
})