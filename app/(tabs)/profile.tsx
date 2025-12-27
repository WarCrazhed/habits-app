import Avatar from "@/components/Avatar";
import PrimaryButton from "@/components/PrimaryButton";
import Screen from "@/components/Screen";
import { ThemedText } from "@/components/themed-text";
import { useProfile } from "@/context/ProfileContext";
import { useThemeColor } from "@/hooks/use-theme-color";
import { generateAvatarAI } from "@/services/avatar";
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, View } from "react-native";

export default function Profile() {
  const { loading, profile, updateProfile, setAvatar } = useProfile();
  const surface = useThemeColor({}, 'surface')
  const border = useThemeColor({}, 'border')
  const text = useThemeColor({}, 'text')
  const muted = useThemeColor({}, 'muted')

  const [name, setName] = useState(profile.name)
  const [role, setRole] = useState(profile.role)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    setName(profile.name)
    setRole(profile.role)
  }, [profile.name, profile.role])

  async function save() {
    setBusy(true)
    await updateProfile({
      name: name.trim() || "Sin nombre",
      role: role.trim() || "Sin rol"
    })
    setBusy(false)
    Alert.alert('Perfil', 'Datos guardados correctamente')
  }

  async function pickFromGallery() {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    })
    if (!res.canceled) await setAvatar(res.assets[0].uri)
  }

  async function takePhoto() {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (perm.status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitas conceder permiso para usar la cámara')
      return;
    }
    const res = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    })
    if (!res.canceled) await setAvatar(res.assets[0].uri)
  }

  async function makeAi() {
    setBusy(true)
    const url = await generateAvatarAI(name || "Usuario")
    await setAvatar(url)
    setBusy(false)
  }

  if (loading) return (
    <Screen>
      <ThemedText>Cargando perfil...</ThemedText>
    </Screen>
  )

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ alignItems: 'center', gap: 16, marginBottom: 12 }}>
            <Avatar
              name={name}
              uri={profile.avatarUri}
              onPress={pickFromGallery}
            />
          </View>
          <View style={{ gap: 12 }}>
            <ThemedText style={{ fontWeight: "700" }}>Nombre</ThemedText>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Tu nombre"
              placeholderTextColor={muted}
              style={[
                styles.input,
                {
                  backgroundColor: surface,
                  borderColor: border,
                  borderWidth: 1,
                  color: text,
                }
              ]}
              returnKeyType="next"
              onSubmitEditing={save}
            />
            <TextInput
              value={role}
              onChangeText={setRole}
              placeholder="Tu rol"
              placeholderTextColor={muted}
              style={[
                styles.input,
                {
                  backgroundColor: surface,
                  borderColor: border,
                  borderWidth: 1,
                  color: text,
                }
              ]}
              returnKeyType="next"
              onSubmitEditing={save}
            />
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
              <PrimaryButton
                title="Tomar Foto"
                onPress={takePhoto}
              />
              <PrimaryButton
                title="Galeria"
                onPress={pickFromGallery}
              />
            </View>
            <PrimaryButton
              title="Generar con IA"
              onPress={makeAi}
              disabled={busy}
            />
            <PrimaryButton
              title="Guardar"
              onPress={save}
              disabled={busy}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 24,
    gap: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 15,
    color: '#334155',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
});
