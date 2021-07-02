import * as React from "react";
import { Form, Input, Button, Spin, message } from "antd";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import * as PropTypes from "prop-types";
import { IPlay } from "src/services/PlayApi";
import AppApi from "../services/PlayApi";

function CreatePlayPage(props: any) {
  const [play, setPlay] = React.useState<IPlay>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    setPlay({
      Dataline: 0,
      Play: "testing",
      PlayerLinenumber: 0,
      ActSceneLine: "testing",
      Player: "Jason",
      PlayerLine: "testing",
    });
  }, []);

  const onCreate = async (values: IPlay) => {
    setIsLoading(true);
    await AppApi.createPlays(values);
    setPlay(values);
    setIsLoading(false);
    message.success("Successfully created");
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Create New Play</h2>
      <Spin spinning={!play || isLoading}>
        {play && (
          // the form element in antd can directly save input data when you change input, and the submission will include all the changes
          <Form
            onFinish={
              props.auth.isAuthenticated === false
                ? message.error("Sorry, please login first")
                : onCreate
            }
          >
            <Form.Item
              label="Dataline"
              name="Dataline"
              rules={[{ required: true, message: "Dataline is required!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Play"
              name="Play"
              rules={[{ required: true, message: "Play is required!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Player Line Number" name="PlayerLinenumber">
              <Input />
            </Form.Item>
            <Form.Item label="Act Scene Line" name="ActSceneLine">
              <Input />
            </Form.Item>
            <Form.Item label="Player" name="Player">
              <Input />
            </Form.Item>
            <Form.Item label="PlayerLine" name="PlayerLine">
              <Input />
            </Form.Item>
            <Form.Item>
              <Button
                className="common-setting-btn"
                type="primary"
                htmlType="submit"
              >
                Create
              </Button>
            </Form.Item>
          </Form>
        )}
      </Spin>
      <Link to="/plays">
        <Button className="common-setting-btn" type="default">
          Back
        </Button>
      </Link>
    </div>
  );
}

CreatePlayPage.propTypes = {
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = (state: { auth: any; errors: any }) => ({
  auth: state.auth,
});
export default connect(mapStateToProps)(CreatePlayPage);
