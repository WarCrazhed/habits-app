import ExplorerCard from '@/components/ExplorerCard';
import Screen from '@/components/Screen';
import { ThemedText } from '@/components/themed-text';
import { useHabits } from '@/context/HabitsContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { suggestFor, Suggestion } from '@/services/suggest';
import { useEffect, useState } from 'react';
import { Alert, FlatList, View } from 'react-native';

export default function TabTwoScreen() {
  const { addHabit } = useHabits();
  const text = useThemeColor({}, "text");
  const muted = useThemeColor({}, "muted");

  const [energ, setEnerg] = useState<Suggestion[] | null>(null);
  const [focus, setFocus] = useState<Suggestion[] | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [a, b] = await Promise.all([
          suggestFor("energy"),
          suggestFor("focus")
        ]);

        if (!mounted) return;
        setEnerg(a);
        setFocus(b);
        console.log(a, b);

      } catch (error) {
        console.warn("No se pudieron cargar sugerencias", error)
      }
    })()

    return () => {
      mounted = false;
    }
  }, []);

  const onPick = (suggestion: Suggestion) => {
    addHabit(
      suggestion.title,
      suggestion.priority,
    );
    Alert.alert("Añadido", `Se creó el hábito "${suggestion.title}"`);
  }

  const renderItem = ({ item }: { item: Suggestion }) => (
    <ExplorerCard
      emoji={item.emoji}
      title={item.title}
      subtitle={item.subtitle}
      onPress={() => onPick(item)}
    />
  );

  const keyExtractor = (item: Suggestion) => item.id;
  const Section = ({ title, data }: { title: string, data: Suggestion[] | null }) => (
    <View style={{ gap: 8 }}>
      <ThemedText style={{ fontWeight: '700', fontSize: 18 }}>
        {title}
      </ThemedText>
      {data ? (
        <FlatList
          data={data}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingRight: 8 }}
        />
      ) : (
        <View style={{ flexDirection: "row", gap: 8 }}>
          <ExplorerCard title="Cargando..." subtitle='...' />
          <ExplorerCard title="Cargando..." subtitle='...' />
          <ExplorerCard title="Cargando..." subtitle='...' />
        </View>
      )}
    </View>
  )

  return (
    <Screen>
      <View>
        <ThemedText style={{ fontWeight: '700', fontSize: 18 }}>
          Sugerencias rápidas
        </ThemedText>
        <ThemedText>
          Desliza los chips y toca para crear el hábito al instante.
        </ThemedText>
        <Section title="Energía" data={energ} />
        <Section title="Enfoque" data={focus} />
      </View>
    </Screen>
  );
}
