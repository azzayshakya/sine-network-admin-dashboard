import { Layout, Menu, Avatar, Dropdown } from "antd";
import { useState, useEffect } from "react";
import { getQueries, getInterest } from "../utils/api";
import QueryTable from "../components/QueryTable";
import InterestTable from "../components/InterestTable";
import Charts from "../components/Charts";

const { Header, Sider, Content } = Layout;

export default function Dashboard({ user, setUser }) {
  const [tab, setTab] = useState("dashboard");
  const [queries, setQueries] = useState([]);
  const [interest, setInterest] = useState([]);

  useEffect(() => {
    getQueries().then(setQueries);
    getInterest().then(setInterest);
  }, []);

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  const menu = (
    <Menu>
      <Menu.Item onClick={logout}>Logout</Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider>
        <Menu
          theme="dark"
          onClick={(e) => setTab(e.key)}
          items={[
            { key: "dashboard", label: "Dashboard" },
            { key: "queries", label: "Queries" },
            { key: "interest", label: "Interest" },
          ]}
        />
      </Sider>

      <Layout>
        <Header style={{ display: "flex", justifyContent: "flex-end" }}>
          <Dropdown overlay={menu}>
            <Avatar>{user.name?.[0]}</Avatar>
          </Dropdown>
        </Header>

        <Content style={{ padding: 20 }}>
          {tab === "dashboard" && (
            <Charts queries={queries} interest={interest} />
          )}
          {tab === "queries" && <QueryTable data={queries} />}
          {tab === "interest" && <InterestTable data={interest} />}
        </Content>
      </Layout>
    </Layout>
  );
}
