import HabitCard from "@/components/HabitCard";
import HabitGreeting from "@/components/HabitGreeting";
import PrimaryButton from "@/components/PrimaryButton";
import ProfileHeader from "@/components/ProfileHeader";
import Screen from "@/components/Screen";
import { ThemedText } from "@/components/themed-text";
import { useCelebration } from "@/context/CelebrationProvider";
import { useHabits } from "@/context/HabitsContext";
import { useThemeColor } from "@/hooks/use-theme-color";
import { getMotivation } from "@/services/motivation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useMemo, useState } from "react";
import { Alert, FlatList, ListRenderItemInfo, Pressable, StyleSheet, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Habit = {
  id: number | string;
  title: string;
  streak: number;
  isCompleted: boolean;
  priority: 'low' | 'mid' | 'high';
}

type HabitItem = ReturnType<typeof useHabits>["habits"][number]

const initialState: Habit[] = [
  { id: 1, title: "Beber Agua", streak: 3, isCompleted: true, priority: 'low' },
  { id: 2, title: "Leer 10 minutos", streak: 1, isCompleted: false, priority: 'mid' },
  { id: 3, title: "Caminar 15 minutos", streak: 7, isCompleted: false, priority: 'high' },
]

export default function HomeScreen() {
  const [items, setItems] = useState<Habit[]>(initialState);
  const [nuevo, setNuevo] = useState<string>('');

  const { loading, habits, addHabit, toggleHabit } = useHabits();
  const { celebrate } = useCelebration()

  const border = useThemeColor({}, 'border')
  const surface = useThemeColor({}, 'surface')
  const text = useThemeColor({}, 'text')
  const muted = useThemeColor({}, 'muted')

  const insets = useSafeAreaInsets();

  const onAdd = useCallback(() => {
    const title = nuevo.trim();
    if (!title) return;
    addHabit(title);
    setNuevo("");
  }, [nuevo, addHabit]);

  const total = items.length;
  const completed = useMemo(
    () => items.filter((habit) => habit.isCompleted).length,
    [items]
  )

  async function onToggleWithCelebration(item: HabitItem) {
    const wasToday = item.lastDoneAt ? isSameDay(item.lastDoneAt, new Date()) : false;
    toggleHabit(item.id)
    if (!wasToday) {
      const msg = await getMotivation(item.title)
      celebrate(msg)
    };
  }

  const keyExtractor = useCallback((item: Habit) => item.id.toString(), []);
  const renderItem = useCallback(({ item }: ListRenderItemInfo<HabitItem>) => {
    const isToday = item.lastDoneAt ? new Date(item.lastDoneAt).toDateString() === new Date().toDateString() : false;
    return (
      <HabitCard
        key={item.id}
        title={item.title}
        streak={item.streak}
        isCompleted={isToday}
        priority={item.priority}
        onToggle={() => onToggleWithCelebration(item)}
      />
    )
  }, [onToggleWithCelebration]);

  const ItemSeparator = useCallback(() => <View style={{ height: 12 }} />, []);
  const Empty = () => (
    <View style={{ paddingVertical: 32, alignItems: 'center', gap: 8 }}>
      <ThemedText>Aún no tienes hábitos. Crea el primero</ThemedText>
    </View>
  );

  if (loading) return (
    <Screen>
      <ThemedText>Cargando hábitos...</ThemedText>
    </Screen>
  )

  const isSameDay = (a: string | number | Date, b: string | number | Date) => {
    new Date(a).toDateString() === new Date(b).toDateString()
  }

  return (
    <Screen>
      <ProfileHeader name="Mario Zamora" role="dev" />
      <HabitGreeting nombre="Ada" />
      <View style={[styles.row, { alignItems: 'center' }]}>
        <Pressable
          onPress={async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert('Éxito', 'Hábitos borrados');
            } catch (error) {
              Alert.alert('Error', 'No se pudo borrar los hábitos');
              console.warn(error);
            }
          }}
        />
        <TextInput
          value={nuevo}
          onChangeText={setNuevo}
          placeholder="Agregar hábito"
          onSubmitEditing={onAdd}
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
        <PrimaryButton title="Añadir" onPress={onAdd} />
      </View>
      <FlatList
        data={habits}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
        ListEmptyComponent={Empty}
        contentContainerStyle={{
          paddingVertical: 16,
          paddingBottom: insets.bottom + 16
        }}
        initialNumToRender={8}
        windowSize={10}
        showsVerticalScrollIndicator={false}
      />
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