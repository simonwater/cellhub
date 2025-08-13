import {
  Layout,
  Menu,
  Button,
  Card,
  Alert,
  Input,
  Table,
  Space,
} from "@superset-ui/core/components";
import { Icons } from "@superset-ui/core/components/Icons";

const { Header, Content, Sider } = Layout;

const ExampleApp = () => {
  const columns = [
    { title: "Name", dataIndex: "name" },
    { title: "Age", dataIndex: "age" },
    { title: "Address", dataIndex: "address" },
  ];

  const data = [
    { key: 1, name: "John Brown", age: 32, address: "New York" },
    { key: 2, name: "Jim Green", age: 42, address: "London" },
    { key: 3, name: "Joe Black", age: 28, address: "Sydney" },
    { key: 4, name: "Simon Water", age: 28, address: "Byby" },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ color: "white", fontSize: 18 }}>My App</Header>
      <Layout>
        <Sider width={200}>
          <Menu
            mode="inline"
            defaultSelectedKeys={["1"]}
            style={{ height: "100%" }}
            items={[
              { key: "1", icon: <Icons.UserOutlined />, label: "Users" },
              { key: "2", icon: <Icons.BookOutlined />, label: "Devices" },
              {
                key: "3",
                icon: <Icons.CheckCircleFilled />,
                label: "Alerts",
              },
            ]}
          />
        </Sider>
        <Layout style={{ padding: "24px" }}>
          <Content>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <Alert
                message="Welcome"
                description="You are logged in."
                type="info"
              />
              <Card title="Quick Actions">
                <Space>
                  <Button type="primary">Create</Button>
                  <Button>Settings</Button>
                  <Input placeholder="Search..." />
                </Space>
              </Card>
              <Card title="User Table">
                <Table data={data} columns={columns} pagination={false} />
              </Card>
            </Space>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default ExampleApp;
