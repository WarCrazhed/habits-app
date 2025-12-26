import { useThemeColor } from "@/hooks/use-theme-color";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { ThemedText } from "./themed-text";

type Props = {
    emoji?: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
}

export default function ExplorerCard({ emoji = "✨", title, subtitle, onPress }: Props) {
    const surface = useThemeColor({}, "surface");
    const border = useThemeColor({}, "border");
    const text = useThemeColor({}, "text");
    const muted = useThemeColor({}, "muted");

    return (
        <Pressable
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={title}
            style={({ pressed }) => [
                styles.base,
                Platform.OS === "ios" ? styles.ios : styles.android,
                {
                    borderColor: border,
                    backgroundColor: surface,
                    transform: [{ scale: pressed ? 0.98 : 1 }]
                },
            ]}
        >
            <View style={styles.emojiBox}>
                <Text style={styles.emoji}>{emoji}</Text>
            </View>
            <View style={styles.textBox}>
                <ThemedText style={styles.title}>{title}</ThemedText>
                <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    base: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12 },
    ios: {
        shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }
    },
    android: { elevation: 3 },
    common: { backgroundColor: '#fff' },
    emojiBox: { marginRight: 12 },
    emoji: { fontSize: 24 },
    textBox: { flex: 1 },
    title: { fontSize: 16, fontWeight: '600' },
    subtitle: { fontSize: 13, color: '#666' },
})