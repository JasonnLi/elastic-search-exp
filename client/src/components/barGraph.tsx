import * as React from "react";
import { ResponsiveBar } from "@nivo/bar";
import { Menu, Dropdown, Button, Spin } from "antd";
import { DownOutlined } from "@ant-design/icons";
import AppApi, { IAgg } from "../services/PlayApi";

export default function MyResponsiveBar(props: any) {
  const initData: IAgg[] = [
    {
    Play: "testing",
    Player: "Jason",
    total_line: 100,
    }
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

  const MyResponsiveBar = ({ data }: any) => ( //how to define the type of data here as the type in Interface
    <ResponsiveBar
      data={data}
      keys={["total_line"]}
      //indexBy="country"
      //keys={["hot dog", "burger", "sandwich", "kebab", "fries", "donut"]}
      indexBy="Player"
      margin={{ top: 50, right: 90, bottom: 70, left: 120 }}
      padding={0.3}
      layout="horizontal"
      colors={{ scheme: "nivo" }}
      defs={[
        {
          id: "dots",
          type: "patternDots",
          background: "inherit",
          color: "#38bcb2",
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: "lines",
          type: "patternLines",
          background: "inherit",
          color: "#eed312",
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      fill={[
        {
          match: {
            id: "fries",
          },
          id: "dots",
        },
        {
          match: {
            id: "sandwich",
          },
          id: "lines",
        },
      ]}
      borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "total_line",
        legendPosition: "middle",
        legendOffset: 32,
      }}
      axisLeft={{
        tickSize: 2,
        tickPadding: 5,
        tickRotation: -45,
        legend: "Players",
        legendPosition: "end",
        legendOffset: -50,
      }}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
      animate={true}
      motionStiffness={45}
      motionDamping={15}
    />
  );

  return (
    <div style={{ height: 350 }}>
      <Dropdown overlay={menu}>
        <Button id="userSelection">
          Button <DownOutlined />
        </Button>
      </Dropdown>
        <MyResponsiveBar data={play} />
    </div>
  );
}
