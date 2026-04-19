import { Table, Tag } from "antd";

export default function QueryTable({ data, loading }) {
  const safeData = Array.isArray(data) ? data : [];

  const renderValue = (value) => {
    if (value === null || value === undefined || value === "") {
      return <span style={{ color: "#999" }}>N/A</span>;
    }
    return value;
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "fullName",
      render: (value) => renderValue(value),
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (value) =>
        value ? <a href={`mailto:${value}`}>{value}</a> : renderValue(value),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      render: (value) =>
        value ? <Tag color="blue">{value}</Tag> : renderValue(value),
    },
    {
      title: "Message",
      dataIndex: "message",
      ellipsis: true,
      render: (value) => renderValue(value),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={safeData}
      rowKey={(record) => record._id || Math.random()}
      loading={loading}
      pagination={{ pageSize: 5 }}
      locale={{
        emptyText: loading ? "Loading..." : "No queries found",
      }}
    />
  );
}
