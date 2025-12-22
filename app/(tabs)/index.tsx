import HabitCard from "@/components/HabitCard";
import HabitGreeting from "@/components/HabitGreeting";
import ProfileHeader from "@/components/ProfileHeader";
import Screen from "@/components/Screen";
import { View } from "react-native";

export default function HomeScreen() {
  const habits = [
    { id: 1, title: "Beber Agua", streak: 3, isCompleted: true },
    { id: 2, title: "Leer 10 minutos", streak: 1, isCompleted: false },
    { id: 3, title: "Caminar 15 minutos", streak: 7, isCompleted: false },
  ];

  return (
    <Screen>
      <ProfileHeader name="Mario Zamora" role="dev" />
      <HabitGreeting nombre="Ada" />
      <View style={{ gap: 12 }}>
        {habits.map((habit) => (
          <HabitCard key={habit.id} title={habit.title} streak={habit.streak} isCompleted={habit.isCompleted} />
        ))}
      </View>
    </Screen>
  );
}
