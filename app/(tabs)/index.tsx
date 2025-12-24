import HabitCard from "@/components/HabitCard";
import HabitGreeting from "@/components/HabitGreeting";
import PrimaryButton from "@/components/PrimaryButton";
import ProfileHeader from "@/components/ProfileHeader";
import Screen from "@/components/Screen";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useCallback, useMemo, useState } from "react";
import { ScrollView, StyleSheet, TextInput, View } from "react-native";

type Habit = {
  id: number | string;
  title: string;
  streak: number;
  isCompleted: boolean;
  priority: 'low' | 'mid' | 'high';
}

const initialState: Habit[] = [
  { id: 1, title: "Beber Agua", streak: 3, isCompleted: true, priority: 'low' },
  { id: 2, title: "Leer 10 minutos", streak: 1, isCompleted: false, priority: 'mid' },
  { id: 3, title: "Caminar 15 minutos", streak: 7, isCompleted: false, priority: 'high' },
]

export default function HomeScreen() {
  const [items, setItems] = useState<Habit[]>(initialState);
  const [nuevo, setNuevo] = useState<string>('');

  const toggle = useCallback((id: number | string) => {
    setItems((prev) =>
      prev.map((habit: Habit) => {
        if (habit.id !== id) return habit
        const completed = !habit.isCompleted
        return {
          ...habit,
          isCompleted: completed,
          streak: completed ? habit.streak + 1 : Math.max(0, habit.streak - 1)
        }
      })
    )
  }, [])

  const addHabit = useCallback(() => {
    const title = nuevo.trim();
    if (!title) return;
    setItems((prev) => [{
      id: Date.now(),
      title,
      streak: 0,
      isCompleted: false,
      priority: 'low',
    }, ...prev])
    setNuevo("")
  }, [nuevo])

  const border = useThemeColor({}, 'border')
  const surface = useThemeColor({}, 'surface')
  const primary = useThemeColor({}, 'primary')
  const onPrimary = useThemeColor({}, 'onPrimary')
  const text = useThemeColor({}, 'text')
  const muted = useThemeColor({}, 'muted')

  const total = items.length;
  const completed = useMemo(
    () => items.filter((habit) => habit.isCompleted).length,
    [items]
  )

  return (
    <Screen>
      <ProfileHeader name="Mario Zamora" role="dev" />
      <HabitGreeting nombre="Ada" />
      <View style={[styles.row, { alignItems: 'center' }]}>
        <TextInput
          value={nuevo}
          onChangeText={setNuevo}
          placeholder="Agregar hábito"
          onSubmitEditing={addHabit}
          style={[
            styles.input,
            {
              backgroundColor: surface,
              borderColor: border,
              color: text,
            }
          ]}
          placeholderTextColor={muted}
        />
        <PrimaryButton title="Añadir" onPress={addHabit} />
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 32, gap: 16 }} showsVerticalScrollIndicator={false}>
        {items.map((habit) => (
          <HabitCard
            key={habit.id}
            title={habit.title}
            streak={habit.streak}
            isCompleted={habit.isCompleted}
            priority={habit.priority}
            onToggle={() => toggle(habit.id)}
          />
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  addBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  }
})