import { StyleSheet } from "react-native";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";

export default function HabitGreeting({ nombre = "Hola" }) {
  const fecha = new Date();
  const hora = fecha.getHours();
  const saludo = hora < 12 ? "Buenos dias" : hora < 18 ? "Buenas tardes" : "Buenas noches";

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>
        {saludo}
        {nombre ? `, ${nombre}` : ""}
      </ThemedText>
      <ThemedText style={[styles.subtitle]}>
        Hoy es {fecha.toLocaleDateString()} - {fecha.toLocaleTimeString()}
      </ThemedText>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 15,
  },
});