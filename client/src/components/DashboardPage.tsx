import * as React from "react";
import { Link } from "react-router-dom";
import { Layout, Menu, Button } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  BarChartOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import { userLogout } from "../actions/authActions";
import MyResponsiveBar from "./barGraph";
import MyRechartsBar from "./barGraphRecharts";
// import MyResponsiveChoropleth from "./VisualisationPage/mapGraph";
import MyResponsiveBump from "./VisualisationPage/BumpChartGraph";
// import { mapData } from "./VisualisationPage/mapData";
import { rankData } from "./VisualisationPage/rankData";

function Dashboard(props: any) {
  const { Header, Sider, Content } = Layout;
  const [collapsed, setCollapsed] = React.useState(false);
  const { user } = props.auth;

  const onLogout = () => {
    // e.preventDefault()
    props.userLogout();
  };
  const toggle = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo" />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
          <Menu.Item
            style={{ fontSize: "15px" }}
            key="1"
            icon={<BarChartOutlined style={{ fontSize: "18px" }} />}
          >
            Dashboard
          </Menu.Item>
          <Menu.Item
            style={{ fontSize: "15px" }}
            key="2"
            icon={<UserOutlined style={{ fontSize: "18px" }} />}
          >
            Users
          </Menu.Item>
          <Menu.Item
            style={{ fontSize: "15px" }}
            key="3"
            icon={<ArrowLeftOutlined style={{ fontSize: "18px" }} />}
          >
            <Link to="/plays"> Back </Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }}>
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              style: { fontSize: "20px" },
              onClick: toggle,
            }
          )}
          <div className="vis-logout-btn-container">
            <a href="/plays/login">
              <Button
                className="common-setting-btn"
                id="logout-btn"
                type="default"
                onClick={onLogout}
              >
                Logout
              </Button>
            </a>
            <p className="welcome-text" style={{ fontSize: "20px" }}>
              Welcome! {user.name}
            </p>
          </div>
        </Header>
        <div>
          <div
            className="site-layout-background"
            id="bar-nivo-vis"
            style={{
              margin: "15px 15px",
              padding: 20,
            }}
          >
            <MyResponsiveBar />
          </div>
          <div
            className="site-layout-background"
            id="bar-recharts-vis"
            style={{
              margin: "15px 15px",
              padding: 20,
            }}
          >
            <MyRechartsBar />
          </div>
        </div>
        <div
          className="site-layout-background"
          id="map-vis"
          style={{
            margin: "15px 15px",
            padding: 20,
          }}
        >
          <MyResponsiveBump data={rankData} />
        </div>
      </Layout>
    </Layout>
  );
}

Dashboard.propTypes = {
  userLogout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = (state: { auth: any }) => ({
  auth: state.auth,
});
export default connect(mapStateToProps, { userLogout })(Dashboard);
