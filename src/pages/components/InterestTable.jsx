import { Table } from "antd";

export default function InterestTable({ data }) {
  const safeData = Array.isArray(data) ? data : [];

  const columns = [
    { title: "Email", dataIndex: "email" },
    {
      title: "Interest",
      dataIndex: "interest",
      render: (v) => (v ? "Yes" : "No"),
    },
  ];

  return <Table columns={columns} dataSource={safeData} rowKey="_id" />;
}
