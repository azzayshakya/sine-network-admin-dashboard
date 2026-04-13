import { Table } from "antd";

export default function QueryTable({ data }) {
  const columns = [
    { title: "Name", dataIndex: "fullName" },
    { title: "Email", dataIndex: "email" },
    { title: "Phone", dataIndex: "phone" },
    { title: "Message", dataIndex: "message" },
  ];

  return <Table columns={columns} dataSource={data} rowKey="_id" />;
}
