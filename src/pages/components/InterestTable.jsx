import { Table, Tag, Tooltip } from "antd";

export default function InterestTable({ data, loading }) {
  const safeData = Array.isArray(data) ? data : [];

  const renderValue = (value) => {
    if (value === null || value === undefined || value === "") {
      return <span style={{ color: "#999" }}>N/A</span>;
    }
    return value;
  };

  const formatDate = (date) => {
    if (!date) return renderValue(date);

    try {
      const d = new Date(date);

      return (
        <Tooltip title={d.toISOString()}>
          {d.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Tooltip>
      );
    } catch {
      return renderValue(date);
    }
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "createdAt",
      sorter: (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0),
      render: (value) => formatDate(value),
    },
    {
      title: "Interest",
      dataIndex: "interest",
      filters: [
        { text: "Yes", value: true },
        { text: "No", value: false },
      ],
      onFilter: (value, record) => record.interest === value,
      render: (value) =>
        value === true ? (
          <Tag color="green">Yes</Tag>
        ) : value === false ? (
          <Tag color="red">No</Tag>
        ) : (
          renderValue(value)
        ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={safeData}
      loading={loading}
      rowKey={(record) => record._id || Math.random()}
      pagination={{ pageSize: 5 }}
      locale={{
        emptyText: loading ? "Loading..." : "No interest data found",
      }}
    />
  );
}
