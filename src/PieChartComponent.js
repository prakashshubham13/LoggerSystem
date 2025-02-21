import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import data from "./data/data";

const PieChartComponent = () => {
  const svgRef = useRef();

  useEffect(() => {
    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const pie = d3.pie().value((d) => d.value);

    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    const equipmentTypeCounts = data.reduce((acc, item) => {
      acc[item.equipment_type_code] = (acc[item.equipment_type_code] || 0) + 1;
      return acc;
    }, {});

    const pieData = Object.entries(equipmentTypeCounts).map(([key, value]) => ({
      key,
      value,
    }));

    const arcs = svg.selectAll("arc").data(pie(pieData)).enter().append("g");

    arcs
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => color(d.data.key))
      .on("mouseover", function (event, d) {
        d3.select(this).attr("opacity", 0.7);
        svg
          .append("text")
          .attr("class", "tooltip")
          .attr("x", 0)
          .attr("y", -radius - 10)
          .attr("text-anchor", "middle")
          .text(`${d.data.key}: ${d.data.value}`);
      })
      .on("mouseout", function () {
        d3.select(this).attr("opacity", 1);
        svg.select(".tooltip").remove();
      });

    arcs
      .append("text")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .text((d) => d.data.key);

    // Add total number of data points
    svg
      .append("text")
      .attr("x", 0)
      .attr("y", radius + 20)
      .attr("text-anchor", "middle")
      .text(`Total: ${data.length}`);
  }, []);

  return <svg ref={svgRef}></svg>;
};

export default PieChartComponent;
