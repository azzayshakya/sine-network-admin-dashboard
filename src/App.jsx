import { useAuth } from "./context/authContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { Spin } from "antd";

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ height: "100vh", display: "grid", placeItems: "center" }}>
        <Spin size="large" />
      </div>
    );
  }

  return user ? <Dashboard /> : <Login />;
}
