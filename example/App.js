import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { SupportAI } from 'react-native-support';

/**
 * Minimal host app: some content, plus <SupportAI /> — the plan-§2 shape.
 *
 * Point apiUrl at your running support-platform (next dev → http://localhost:3000,
 * or your deployment) and paste a key from `pnpm db:seed`. Use the *test* key:
 * it never counts toward quota.
 */
const API_KEY = 'rns_pk_test_PASTE_FROM_SEED';
const API_URL = 'http://localhost:3000';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Acme Notes</Text>
      <Text style={styles.body}>
        This is your app. The button in the corner is the SDK.
      </Text>
      <SupportAI apiKey={API_KEY} apiUrl={API_URL} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 96, paddingHorizontal: 24 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 8 },
  body: { fontSize: 15, color: '#555', lineHeight: 22 },
});
