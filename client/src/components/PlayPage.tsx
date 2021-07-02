import * as React from "react";
import { Form, Input, Button, Spin, message } from "antd";
import { useParams, Link } from "react-router-dom";
import { connect } from "react-redux";
import * as PropTypes from "prop-types";
import { IPlay } from "src/services/PlayApi";
import AppApi from "../services/PlayApi";
import { OmitProps } from "antd/lib/transfer/ListBody";

function PlayPage(props: any) {
  interface RouteParams {
    userId: string;
  }
  // to access dynamic route paramater
  const params = useParams<RouteParams>();
  // userID is the dynamic route paramas
  const playId = params.userId;
  const [play, setPlay] = React.useState<IPlay>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    loadPlay(playId);
    console.log(playId);
  }, []);

  const loadPlay = async (id: string) => {
    const foundPlay = await AppApi.getPlayById(id);
    setPlay(foundPlay);
  };

  const onFinish = async (values: IPlay) => {
    setIsLoading(true);
    await AppApi.updatePlay(playId, values);
    setIsLoading(false);
    message.success("Successfully updated");
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Edit Play</h2>
      <Spin spinning={!play || isLoading}>
        {play && (
          <Form
            onFinish={
              props.auth.isAuthenticated === false
                ? message.error("Sorry, please login first")
                : onFinish
            }
            initialValues={play}
          >
            <Form.Item
              label="Dataline"
              // The name in the form should matcht the data index name
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
              <Button className="common-btn" type="primary" htmlType="submit">
                Update
              </Button>
            </Form.Item>
          </Form>
        )}
      </Spin>
      <Link to="/plays">
        <Button className="common-btn" type="default">
          Back
        </Button>
      </Link>
    </div>
  );
}

PlayPage.propTypes = {
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = (state: { auth: any; errors: any }) => ({
  auth: state.auth,
});
export default connect(mapStateToProps)(PlayPage);
