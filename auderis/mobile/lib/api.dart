import 'dart:convert';
import 'package:http/http.dart' as http;

class Api {
  final String baseUrl;
  String? token;
  Api(this.baseUrl);

  Map<String,String> _headers({bool json = true}) {
    final h = <String,String>{};
    if (json) h["Content-Type"] = "application/json";
    if (token != null) h["Authorization"] = "Bearer $token";
    return h;
  }

  Future<Map<String,dynamic>> postJson(String path, Map<String,dynamic> body) async {
    final res = await http.post(Uri.parse("$baseUrl$path"),
      headers: _headers(),
      body: jsonEncode(body));
    final data = jsonDecode(res.body.isEmpty ? "{}" : res.body);
    if (res.statusCode >= 400) throw Exception(data["error"] ?? "Error");
    return (data as Map<String,dynamic>);
  }

  Future<List<dynamic>> getList(String path) async {
    final res = await http.get(Uri.parse("$baseUrl$path"), headers: _headers(json:false));
    final data = jsonDecode(res.body.isEmpty ? "[]" : res.body);
    if (res.statusCode >= 400) throw Exception((data as Map)["error"] ?? "Error");
    return (data as List);
  }

  Future<Map<String,dynamic>> getJson(String path) async {
    final res = await http.get(Uri.parse("$baseUrl$path"), headers: _headers(json:false));
    final data = jsonDecode(res.body.isEmpty ? "{}" : res.body);
    if (res.statusCode >= 400) throw Exception((data as Map)["error"] ?? "Error");
    return (data as Map<String,dynamic>);
  }
}