import { useThemeColor } from "@/hooks/use-theme-color";
import { Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "./themed-text";

type Props = {
    title: string;
    streak: number;
    isCompleted?: boolean;
    priority?: 'low' | 'mid' | 'high';
    onToggle?: () => void;
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

export default function HabitCard({
    title,
    streak,
    isCompleted = false,
    priority = 'low',
    onToggle
}: Props) {
    const surface = useThemeColor({}, 'surface')
    const success = useThemeColor({}, 'success')
    const border = useThemeColor({}, 'border')
    const p = priorityStyles[priority];

    return (
        <Pressable
            onPress={onToggle}
            style={({ pressed }) => [styles.card,
            {
                backgroundColor: surface,
                opacity: pressed ? 0.8 : 1,
                borderColor: isCompleted ? success : border
            },
            isCompleted && styles.cardDone]}
        >
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
        </Pressable>
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