import * as React from "react";
import { Link, withRouter } from "react-router-dom";
import isEmpty = require("is-empty");
import {
  Layout,
  Form,
  Menu,
  Input,
  Tooltip,
  Cascader,
  Select,
  Row,
  Col,
  Checkbox,
  Button,
} from "antd";
import { QuestionCircleOutlined, HomeOutlined } from "@ant-design/icons";
import { IUser } from "src/services/UserApi";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../actions/authActions";
import { color } from "d3";

function RegisterPage(props: any) {
  const { Header } = Layout;
  const { Option } = Select;
  const [isError, setIsError] = React.useState(false);

  const residences = [
    {
      value: "Victoria",
      label: "Victoria",
      children: [
        {
          value: "Melbourne",
          label: "Melbourne",
          children: [
            {
              value: "Caulfield",
              label: "Caulfield",
            },
            {
              value: "Burwood",
              label: "Burwood",
            },
          ],
        },
        {
          value: "Geelong",
          label: "Geelong",
          children: [
            {
              value: "SampleSuburb",
              label: "SampleSuburb",
            },
          ],
        },
      ],
    },
    {
      value: "New South Wales",
      label: "New South Wales",
      children: [
        {
          value: "Sydney",
          label: "Sydney",
          children: [
            {
              value: "SampleSuburb",
              label: "SampleSuburb",
            },
          ],
        },
      ],
    },
  ];

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 8,
      },
    },
  };

  React.useEffect(() => {
    if (!isEmpty(props.errors)) {
      setIsError(true);
    } else {
      setIsError(false);
    }
  }, [props.errors]);

  const onFinish = (values: IUser) => {
    props.registerUser(values, props.history);
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 70 }}>
        <Option value="61">+61</Option>
        <Option value="86">+86</Option>
      </Select>
    </Form.Item>
  );

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
      <Layout
        className="site-layout"
        style={{ padding: "0 5px", margin: "80px 80px", height: "100vh" }}
      >
        <div className="register-div" style={{ padding: 24 }}>
          <Form
            {...formItemLayout}
            className="register-form"
            id="register"
            onFinish={onFinish}
            initialValues={{
              residence: ["Victoria", "Melbourne", "Caufield"],
              prefix: "61",
            }}
            scrollToFirstError
          >
            <Form.Item
              name="email"
              label="E-mail"
              rules={[
                {
                  type: "email",
                  message: "Please input a valid E-mail!",
                },
                {
                  required: true,
                  message: "Please input your E-mail!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
              hasFeedback
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="confirm"
              label="Confirm Password"
              dependencies={["password"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      "The two passwords that you entered do not match!"
                    );
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="firstName"
              label="First Name"
              rules={[
                {
                  required: true,
                  message: "Please input your First Name!",
                  whitespace: true,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="lastName"
              label="Last Name"
              rules={[
                {
                  required: true,
                  message: "Please input your First Name!",
                  whitespace: true,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="address"
              label="Address"
              rules={[
                {
                  type: "array",
                },
              ]}
            >
              <Cascader options={residences} />
            </Form.Item>

            <Form.Item name="phone" label="Phone">
              <Input addonBefore={prefixSelector} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label={
                <span>
                  Captcha&nbsp;
                  <Tooltip title="Not yet completed">
                    <QuestionCircleOutlined />
                  </Tooltip>
                </span>
              }
              extra="We must make sure that your are a human."
            >
              <Row gutter={8}>
                <Col span={12}>
                  <Form.Item name="captcha" noStyle>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Button>Get captcha</Button>
                </Col>
              </Row>
            </Form.Item>

            <Form.Item
              name="agreement"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject("Should accept agreement"),
                },
              ]}
              {...tailFormItemLayout}
            >
              <Checkbox>
                I have read the <a href="">agreement</a>
              </Checkbox>
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
              <Button className="register-btn" type="primary" htmlType="submit">
                Register
              </Button>
              {isError === true ? (
                <p className="register-err-info" style={{ fontSize: "13px" }}>
                  Sorry, this email is already registered
                </p>
              ) : (
                <span></span>
              )}
            </Form.Item>
          </Form>
        </div>
      </Layout>
    </Layout>
  );
}

RegisterPage.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};
const mapStateToProps = (state: { auth: any; errors: any }) => ({
  auth: state.auth,
  errors: state.errors,
});
export default connect(mapStateToProps, { registerUser })(
  withRouter(RegisterPage)
);

/*
Used withRouter from react-router-dom, wrapping our component in our export withRouter() can
help us redirect history route by adding a parameter to this.props.history
*/
