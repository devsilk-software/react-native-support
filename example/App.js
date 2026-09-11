import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { SupportAI } from 'react-native-support';

/**
 * Minimal host app: some content, plus <SupportAI />
 *
 * Point apiUrl at your running support-platform (next dev → http://localhost:3000,
 * or your deployment) and paste a key from `pnpm db:seed`. Use the *test* key:
 * it never counts toward quota.
 */
const API_KEY = 'rns_pk_test_REDACTED';
// The Android emulator's "localhost" is the emulator itself; the host machine
// is reachable at 10.0.2.2. iOS simulators share the host's loopback.
const API_URL = Platform.select({
  android: 'http://10.0.2.2:3000',
  default: 'http://localhost:3000',
});

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Acme Notes</Text>
      <Text style={styles.body}>
        This is your app. The button in the corner is the SDK.
      </Text>
      <SupportAI
        apiKey={API_KEY}
        apiUrl={API_URL}
        // Every visual value is a theme token — override any group partially:
        theme={{ colors: { primary: "#0E7C86", userBubble: "#0E7C86" } }}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 96, paddingHorizontal: 24 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 8 },
  body: { fontSize: 15, color: '#555', lineHeight: 22 },
});
