import { useThemeColor } from "@/hooks/use-theme-color";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "./themed-text";

type Props = {
    size?: number;
    name: string;
    uri?: string | null;
    onPress?: () => void;
}

function initialsFrom(name: string) {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((word) => word[0]?.toUpperCase())
        .join('')
}

export default function Avatar({ size = 72, name, uri, onPress }: Props) {
    const surface = useThemeColor({}, 'surface')
    const border = useThemeColor({}, 'border')
    const text = useThemeColor({}, 'text')

    return (
        <Pressable
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel="Cambiar foto de perfil"
        >
            {uri ? (
                <Image
                    source={{ uri }}
                    style={{
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                        borderColor: border,
                        borderWidth: 1,
                    }}
                />
            ) : (
                <View
                    style={[
                        styles.fallback,
                        {
                            width: size,
                            height: size,
                            borderRadius: size / 2,
                            backgroundColor: surface,
                            borderColor: border,
                            borderWidth: 1,
                        }
                    ]}
                >
                    <ThemedText style={[styles.initials, { color: text, fontSize: size / 2 }]}>
                        {initialsFrom(name) || "🙂"}
                    </ThemedText>
                </View>
            )}
        </Pressable>
    )
}

const styles = StyleSheet.create({
    fallback: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    initials: {
        fontWeight: 'bold',
    },
})
