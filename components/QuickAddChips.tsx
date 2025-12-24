import { useThemeColor } from "@/hooks/use-theme-color"
import { Pressable, ScrollView, StyleSheet } from "react-native"
import { ThemedText } from "./themed-text"

const sugeridos = [
    "Beber agua",
    "Leer 10 minutos",
    "Caminar 15 minutos",
    "Respirar 1 minuto",
    "Estiramientos",
]

export default function QuickAddChips({ onPick }: { onPick: (title: string) => void }) {
    const surface = useThemeColor({}, 'surface')
    const border = useThemeColor({}, 'border')
    const text = useThemeColor({}, 'text')

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 4, gap: 8 }}
        >
            {sugeridos.map((title) => (
                <Pressable
                    key={title}
                    onPress={() => onPick(title)}
                    style={({ pressed }) => [
                        styles.chip,
                        {
                            backgroundColor: surface,
                            borderColor: border,
                            opacity: pressed ? 0.8 : 1,
                        }
                    ]}
                >
                    <ThemedText style={{ color: text }}>{title}</ThemedText>
                </Pressable>
            ))}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    chip: {
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
    }
})
