import { Table } from "antd";

export default function QueryTable({ data }) {
  const safeData = Array.isArray(data) ? data : [];

  const columns = [
    { title: "Name", dataIndex: "fullName" },
    { title: "Email", dataIndex: "email" },
    { title: "Phone", dataIndex: "phone" },
    { title: "Message", dataIndex: "message" },
  ];

  return <Table columns={columns} dataSource={safeData} rowKey="_id" />;
}
