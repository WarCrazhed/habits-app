import QuickAddChips from '@/components/QuickAddChips';
import Screen from '@/components/Screen';
import { ThemedText } from '@/components/themed-text';
import { useHabits } from '@/context/HabitsContext';
import { View } from 'react-native';

export default function TabTwoScreen() {
  const { addHabit } = useHabits();
  const onPick = (title: string) => addHabit(title, 'low');

  return (
    <Screen>
      <View>
        <ThemedText style={{ fontWeight: '700', fontSize: 18 }}>
          Sugerencias rápidas
        </ThemedText>
        <ThemedText>
          Desliza los chips y toca para crear el hábito al instante.
        </ThemedText>
        <QuickAddChips onPick={onPick} />
        {/* <ThemedText>
          Tus selecciones
        </ThemedText>
                <FlatList
          data={picked}
          keyExtractor={(item) => item}
          renderItem={({ item }) => <ThemedText>- {item}</ThemedText>}
          ListEmptyComponent={<ThemedText>Toca un chip para añadir</ThemedText>}
        /> */}
      </View>
    </Screen>
  );
}
