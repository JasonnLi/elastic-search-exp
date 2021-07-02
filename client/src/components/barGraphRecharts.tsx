import * as React from "react";
import { Menu, Dropdown, Button, Spin } from "antd";
import { DownOutlined } from "@ant-design/icons";
import AppApi, { IAgg } from "../services/PlayApi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function MyRechartsBar(props: any) {
  const initData: IAgg[] = [
    {
      Play: "testing",
      Player: "Jason",
      total_line: 100,
    },
  ];

  const [play, setPlay] = React.useState(initData);
  const [filter, setFilter] = React.useState("Henry IV");

  React.useEffect(() => {
    loadBarData();
  }, [filter]);

  const menu = (
    <Menu>
      <Menu.Item
        key="1"
        onClick={() => {
          handleFilter("Henry IV");
        }}
      >
        Henry IV
      </Menu.Item>
      <Menu.Item
        key="2"
        onClick={() => {
          handleFilter("Henry VI Part 1");
        }}
      >
        Henry VI Part 1
      </Menu.Item>
      <Menu.Item
        key="3"
        onClick={() => {
          handleFilter("Henry VI Part 2");
        }}
      >
        Henry VI Part 2
      </Menu.Item>
      <Menu.Item
        key="4"
        onClick={() => {
          handleFilter("Henry VI Part 3");
        }}
      >
        Henry VI Part 3
      </Menu.Item>
    </Menu>
  );

  const loadBarData = async () => {
    const body = {
      Play: filter,
    };
    const response = await AppApi.getAggNumLinesPerPlayer(body);
    console.log(response);
    setPlay(response.data);
  };

  function handleFilter(userSelection: string) {
    setFilter(userSelection);
  }

  const MyRechartsBar = (
    { data }: any //how to define the type of data here as the type in Interface
  ) => (
    <ResponsiveContainer width={"100%"} height={300}>
      <BarChart
        data={data}
        margin={{
          top: 50,
          right: 50,
          left: 10,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Player" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="total_line" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );

  return (
    <div style={{ height: 350 }}>
      <Dropdown overlay={menu}>
        <Button id="userSelection">
          Button <DownOutlined />
        </Button>
      </Dropdown>
      <MyRechartsBar data={play} />
    </div>
  );
}
