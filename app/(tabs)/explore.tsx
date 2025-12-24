import QuickAddChips from '@/components/QuickAddChips';
import Screen from '@/components/Screen';
import { ThemedText } from '@/components/themed-text';
import { useState } from 'react';
import { FlatList, View } from 'react-native';

export default function TabTwoScreen() {
  const [picked, setPicked] = useState<string[]>([]);
  const onPick = (title: string) => setPicked((prev) => (prev.includes(title) ? prev : [...prev, title]));

  return (
    <Screen>
      <View>
        <ThemedText style={{ fontWeight: '700', fontSize: 18 }}>
          Sugerencias rápidas
        </ThemedText>
        <QuickAddChips onPick={onPick} />
        <ThemedText>
          Tus selecciones
        </ThemedText>
        <FlatList
          data={picked}
          keyExtractor={(item) => item}
          renderItem={({ item }) => <ThemedText>- {item}</ThemedText>}
          ListEmptyComponent={<ThemedText>Toca un chip para añadir</ThemedText>}
        />
      </View>
    </Screen>
  );
}
