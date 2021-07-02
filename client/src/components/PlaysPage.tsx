import * as React from "react";
import { Table, Button, message } from "antd";
import { connect } from "react-redux";
import * as PropTypes from "prop-types";
import { userLogout } from "../actions/authActions";
import AppApi from "../services/PlayApi";
import { Link } from "react-router-dom";
import { BarChartOutlined, UserOutlined } from "@ant-design/icons";

function PlaysPage(props: any) {
  const [plays, setPlays] = React.useState(null);

  React.useEffect(() => {
    (async () => {
      loadPlays();
    })();
  }, []);

  const onLogout = () => {
    // e.preventDefault()
    props.userLogout();
  };

  const loadPlays = async () => {
    const response = await AppApi.getPlays();
    setPlays(response);
  };

  const onDelete = async (playId: string) => {
    await AppApi.deletePlay(playId);
  };

  return (
    <div id="home-table" style={{ padding: 24 }}>
      <h2 className="title">Shakepeare Plays</h2>
      <Table
        loading={!plays}
        pagination={{ pageSize: 50 }}
        scroll={{ y: 500 }}
        dataSource={plays}
        rowKey={"id"}
        columns={[
          { dataIndex: "Dataline", title: "Dataline" },
          { dataIndex: "Play", title: "Play" },
          { dataIndex: "PlayerLinenumber", title: "Player Line Number" },
          { dataIndex: "ActSceneLine", title: "Act Scene Line" },
          { dataIndex: "Player", title: "Player" },
          { dataIndex: "PlayerLine", title: "PlayerLine" },
          {
            title: "Edit",
            render: (text, record) => (
              <span>
                <Link to={"/plays/" + record._id}>View</Link>
                <span id="act-divider"> | </span>
                {props.auth.isAuthenticated === false ? (
                  <Link
                    to={"/plays"}
                    onClick={() => {
                      message.error("Sorry, please login first");
                    }}
                  >
                    Delete
                  </Link>
                ) : (
                  <a
                    href={"/plays"}
                    onClick={() => {
                      onDelete(record._id);
                    }}
                  >
                    Delete
                  </a>
                )}
              </span>
            ),
          },
        ]}
      />
      <Link to="plays/createPlay">
        <Button className="common-setting-btn" id="create-btn" type="default">
          Create
        </Button>
      </Link>
      <div className="vis-login-btn-container">
        <Link to="/plays/dashboard">
          <Button
            className="common-setting-btn"
            id="vis-btn"
            type="default"
            icon={<BarChartOutlined />}
          >
            Dashboard
          </Button>
        </Link>

        {props.auth.isAuthenticated === false ? (
          <Link to="/plays/login">
            <Button
              className="common-setting-btn"
              id="login-btn"
              type="primary"
              icon={<UserOutlined />}
            >
              Login
            </Button>
          </Link>
        ) : (
          <a href="/plays">
            <Button
              className="common-setting-btn"
              id="logout-btn"
              type="primary"
              icon={<UserOutlined />}
              onClick={onLogout}
            >
              Logout
            </Button>
          </a>
        )}
      </div>
    </div>
  );
}

PlaysPage.propTypes = {
  userLogout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = (state: { auth: any; errors: any }) => ({
  auth: state.auth,
});
export default connect(mapStateToProps, { userLogout })(PlaysPage);

// Using link will not completely reload the page. However, using <a> with href will make the whole page refresh
// Tested by observing the change of the state status, the state will go back to original if use <a href>
// e.g. in delete button, it use <a> to help refresh page to update content after delete record
