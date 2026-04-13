import { useState } from "react";
import { loginUser } from "../utils/api";
import { Input, Button, Card, message } from "antd";
import { useAuth } from "../context/authContext";

export default function Login() {
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      if (!form.password || (!form.email && !form.phone)) {
        return message.error("Email/Phone and password required");
      }

      setLoading(true);

      const res = await loginUser(form);

      login(res); // 🔥 central login

      message.success("Login successful");
    } catch (err) {
      message.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card title="Admin Login" style={{ width: 350 }}>
        <Input
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <Input
          placeholder="Phone"
          style={{ marginTop: 10 }}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <Input.Password
          placeholder="Password"
          style={{ marginTop: 10 }}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <Button
          type="primary"
          block
          loading={loading}
          style={{ marginTop: 20 }}
          onClick={handleLogin}
        >
          Login
        </Button>
      </Card>
    </div>
  );
}
