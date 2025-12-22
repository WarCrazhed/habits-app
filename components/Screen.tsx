import { StyleSheet } from "react-native";
import { ThemedView } from "./themed-view";

type Props = {
    children: React.ReactNode;
}

export default function Screen({ children }: Props) {
    return (
        <ThemedView style={styles.screen}>
            {children}
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 20,
        gap: 16,
        paddingTop: 40,
    },
})
