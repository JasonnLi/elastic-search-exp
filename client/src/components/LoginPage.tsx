import * as React from "react";
import { Link, withRouter } from "react-router-dom";
import { Layout, Menu, Form, Input, Button, Checkbox, Spin } from "antd";
import { UserOutlined, LockOutlined, HomeOutlined } from "@ant-design/icons";
import * as PropTypes from "prop-types";
import UserApi, { IUser } from "../services/UserApi";
import { connect } from "react-redux";
import { userLogin } from "../actions/authActions";
import isEmpty = require("is-empty");

function LoginPage(props: any) {
  const { Header } = Layout;
  const [isError, setIsError] = React.useState(false);

  React.useEffect(() => {
    if (props.auth.isAuthenticated) {
      props.history.push("/plays/dashboard"); // push user to dashboard when they login
    }
  }, []);

  React.useEffect(() => {
    if (!isEmpty(props.errors)) {
      setIsError(true);
    } else {
      setIsError(false);
    }
  }, [props.errors]);

  const onFinish = async (values: IUser) => {
    props.userLogin(values, props.history);
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Header
        style={{
          position: "fixed",
          zIndex: 1,
          width: "100%",
        }}
      >
        <a href="/plays">
          <HomeOutlined /> Home
        </a>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}></Menu>
      </Header>
      <div className="login-form-div" style={{ padding: 24 }}>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please input your Username!" }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="sample123@gmail.com"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          {isError === true ? (
            <p className="register-err-info" style={{ fontSize: "13px" }}>
              Incorrect email or password, please try again
            </p>
          ) : (
            <span></span>
          )}
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <a className="login-form-forgot" href="">
              Forgot password
            </a>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Log in
            </Button>
            Or <Link to="/plays/register">register now!</Link>
          </Form.Item>
        </Form>
      </div>
    </Layout>
  );
}

// define types of properties from redux using prop-types package
LoginPage.propTypes = {
  userLogin: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};
// mapStateToProps allow us to get state from redux and map it to props which we can use inside the component
const mapStateToProps = (state: { auth: any; errors: any }) => ({
  auth: state.auth,
  errors: state.errors
});
export default connect(mapStateToProps, { userLogin })(withRouter(LoginPage));
// it is easy to redirect within a component. However, using withinRouter we can perfrom
// redirect within an action by passing history props
