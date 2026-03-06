import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Clients from "./pages/Clients";
import Audits from "./pages/Audits";
import Layout from "./components/Layout";
import { getToken } from "./api/client";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = getToken();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/clients" replace />} />
        <Route path="clients" element={<Clients />} />
        <Route path="audits" element={<Audits />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;