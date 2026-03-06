import 'package:flutter/material.dart';
import 'api.dart';
import 'auth.dart';
import 'screens/login.dart';
import 'screens/audits.dart';

void main() => runApp(const App());

class App extends StatefulWidget {
  const App({super.key});
  @override State<App> createState() => _AppState();
}

class _AppState extends State<App> {
  final api = Api("http://10.0.2.2:4000"); // Android emulator -> localhost
  final store = AuthStore();
  bool ready = false;

  @override
  void initState() {
    super.initState();
    _boot();
  }

  Future<void> _boot() async {
    final t = await store.loadToken();
    api.token = t;
    setState(() => ready = true);
  }

  @override
  Widget build(BuildContext context) {
    if (!ready) return const MaterialApp(home: Scaffold(body: Center(child: CircularProgressIndicator())));
    return MaterialApp(
      title: "AUDERIS",
      theme: ThemeData(useMaterial3: true),
      home: api.token == null ? LoginScreen(api: api, store: store) : AuditsScreen(api: api, store: store),
    );
  }
}