import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import BarChart from "./components/BarChart";
import CircularBarChart from "./components/CircularBarChart";
import HorizontalBarChart from "./components/HorizontalBarChart";
import LineChart from "./components/LineChart";
import PieChart from "./components/PieChart";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Card from "./components/Card";
import DataList from "./components/DataList";
import FloatingGPTBot from "./components/FloatingGPTBot";
import { dummyData } from "./data/data";
import * as d3 from "d3";

const VisualizationScreen = ({
  lineChartData,
  submittedAmountData,
  zeroSubmittedAmountData,
  commodityData,
  equipmentData,
  routeData,
  accessorialData,
  bidFailureReasonData,
}) => (
  <div className="App">
    <Header />
    <div className="bodyContainer">
      <div className="row row-1">
        <Card>
          <h3>
            Total Loads Processed:{" "}
            <span className="count-value">
              {lineChartData?.reduce((acc, curr) => acc + curr.count, 0)}
            </span>
          </h3>
          <LineChart data={lineChartData} />
        </Card>
        <Card>
          <h3>
            Total Successful Bid Loads:{" "}
            <span className="count-value">
              {submittedAmountData?.reduce((acc, curr) => acc + curr.count, 0)}
            </span>
          </h3>
          <LineChart data={submittedAmountData} />
        </Card>
        <Card>
          <h3>
            Total Bid Failed Loads:{" "}
            <span className="count-value">
              {zeroSubmittedAmountData?.reduce(
                (acc, curr) => acc + curr.count,
                0
              )}
            </span>
          </h3>
          <LineChart data={zeroSubmittedAmountData} />
        </Card>
      </div>
      <div className="row row-2">
        <Card>
          <h3>Commodities</h3>
          <CircularBarChart data={commodityData} />
        </Card>
        <Card>
          <h3>Equipments</h3>
          <BarChart data={equipmentData} />
        </Card>
      </div>
      <div className="row row-3">
        <Card>
          <h3>Lanes</h3>
          <HorizontalBarChart data={routeData} />
        </Card>
        <Card>
          <h3>Accessorials</h3>
          <PieChart data={accessorialData} />
        </Card>
      </div>
      <Card>
        <h3>Bid Failure Reasons</h3>
        <CircularBarChart data={bidFailureReasonData} />
      </Card>
    </div>
    <FloatingGPTBot />
  </div>
);

function App() {
  const [equipmentData, setEquipmentData] = useState([]);
  const [routeData, setRouteData] = useState([]);
  const [commodityData, setCommodityData] = useState([]);
  const [lineChartData, setLineChartData] = useState([]);
  const [submittedAmountData, setSubmittedAmountData] = useState([]);
  const [zeroSubmittedAmountData, setZeroSubmittedAmountData] = useState([]);
  const [accessorialData, setAccessorialData] = useState([]);
  const [bidFailureReasonData, setBidFailureReasonData] = useState([]);

  useEffect(() => {
    console.log("-----------------------------");

    console.log("data", dummyData);

    const aggregatedData = dummyData.reduce((acc, curr) => {
      const { equipment_type_code } = curr;
      if (!acc[equipment_type_code]) {
        acc[equipment_type_code] = { x: equipment_type_code, y: 0 };
      }
      acc[equipment_type_code].y += 1;
      return acc;
    }, {});
    setEquipmentData(Object.values(aggregatedData));

    const aggregatedRouteData = dummyData.reduce((acc, curr) => {
      console.log("curr", curr);

      const route = `${curr.origin_city_name}__${curr.origin_state_code}__${curr.origin_postal_code}__${curr.origin_country_code}__${curr.destination_city_name}__${curr.destination_state_code}__${curr.destination_postal_code}__${curr.destination_country_code}`;
      if (!acc[route]) {
        acc[route] = { x: route, y: 0 };
      }
      acc[route].y += 1;
      return acc;
    }, {});
    setRouteData(Object.values(aggregatedRouteData));

    const aggregatedCommodityData = dummyData.reduce((acc, curr) => {
      const { commodity } = curr;
      if (!acc[commodity]) {
        acc[commodity] = { x: commodity, y: 0 };
      }
      acc[commodity].y += 1;
      return acc;
    }, {});
    setCommodityData(Object.values(aggregatedCommodityData));

    const past7DaysData = dummyData.filter((d) => {
      const date = new Date(d.creation_timestamp);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    });

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return d3.timeFormat("%Y-%m-%d")(date.setHours(0, 0, 0, 0));
    }).reverse();

    const aggregatedLineChartData = last7Days.map((date) => {
      const count = past7DaysData.filter(
        (d) =>
          d3.timeFormat("%Y-%m-%d")(new Date(d.creation_timestamp)) === date
      ).length;
      return { date, count };
    });

    setLineChartData(aggregatedLineChartData);

    const submittedAmountData = last7Days.map((date) => {
      const count = past7DaysData.filter(
        (d) =>
          d3.timeFormat("%Y-%m-%d")(new Date(d.creation_timestamp)) === date &&
          d.submitted_amount > 0
      ).length;
      return { date, count };
    });

    setSubmittedAmountData(submittedAmountData);

    const zeroSubmittedAmountData = last7Days.map((date) => {
      const count = past7DaysData.filter(
        (d) =>
          d3.timeFormat("%Y-%m-%d")(new Date(d.creation_timestamp)) === date &&
          d.submitted_amount === 0
      ).length;
      return { date, count };
    });

    setZeroSubmittedAmountData(zeroSubmittedAmountData);

    const aggregatedAccessorialData = dummyData.reduce((acc, curr) => {
      const { accessorials } = curr;
      if (!acc[accessorials]) {
        acc[accessorials] = { label: accessorials, value: 0 };
      }
      acc[accessorials].value += 1;
      return acc;
    }, {});
    setAccessorialData(Object.values(aggregatedAccessorialData));

    const aggregatedBidFailureReasonData = past7DaysData.reduce((acc, curr) => {
      const { bid_failure_reason } = curr;
      if (bid_failure_reason) {
        // Filter out blank bid_failure_reason
        if (!acc[bid_failure_reason]) {
          acc[bid_failure_reason] = { x: bid_failure_reason, y: 0 };
        }
        acc[bid_failure_reason].y += 1;
      }
      return acc;
    }, {});
    setBidFailureReasonData(Object.values(aggregatedBidFailureReasonData));
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/visualization"
          element={
            <VisualizationScreen
              lineChartData={lineChartData}
              submittedAmountData={submittedAmountData}
              zeroSubmittedAmountData={zeroSubmittedAmountData}
              commodityData={commodityData}
              equipmentData={equipmentData}
              routeData={routeData}
              accessorialData={accessorialData}
              bidFailureReasonData={bidFailureReasonData}
            />
          }
        />
        <Route path="/data-list" element={<DataList data={dummyData} />} />
      </Routes>
    </Router>
  );
}

export default App;
