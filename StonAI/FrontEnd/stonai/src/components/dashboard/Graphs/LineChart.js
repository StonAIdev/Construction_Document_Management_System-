import React, { PureComponent } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Heading1 from "../../../Reusable Components/Headings/Heading1";
import "../Dashboard.css";
const data = [
  {
    name: "1 Days",
    ShopDrawing: 5,
    Material: 0,
  },
  {
    name: "2 Days",
    ShopDrawing: 5,
    Material: 5,
  },
  {
    name: "3 Days",
    ShopDrawing: 3,
    Material: 1,
  },
  {
    name: "4 Days",
    ShopDrawing: 0,
    Material: 3,
  },
  {
    name: "5 Days",
    ShopDrawing: 7,
    Material: 3,
  },
  {
    name: "6 Days",
    ShopDrawing: 2,
    Material: 2,
  },
  {
    name: "7 Days",
    ShopDrawing: 5,
    Material: 4,
  },
];

export default class Example extends PureComponent {
  static demoUrl = "https://codesandbox.io/s/stacked-area-chart-ix341";

  render() {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          width={730}
          height={250}
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="ShopDrawing"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorUv)"
          />
          <Area
            type="monotone"
            dataKey="Material"
            stroke="#82ca9d"
            fillOpacity={1}
            fill="url(#colorPv)"
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  }
}
