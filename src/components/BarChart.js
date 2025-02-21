import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const BarChart = ({ data }) => {
  console.log(data);

  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = 500; // Reduced width
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };

    svg.attr("width", width).attr("height", height);

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.x))
      .range([margin.left, width - margin.right])
      .padding(0.2); // Increased padding to reduce bar width

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.y)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(
        d3
          .axisLeft(y)
          .ticks(d3.max(data, (d) => d.y))
          .tickFormat(d3.format("d"))
      );

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background", "#161b22")
      .style("color", "#c9d1d9")
      .style("padding", "5px")
      .style("border", "1px solid #30363d")
      .style("border-radius", "5px")
      .style("pointer-events", "none")
      .style("opacity", 0);

    const colors = d3.scaleOrdinal(d3.schemeCategory10);

    svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.x))
      .attr("y", (d) => y(d.y))
      .attr("width", x.bandwidth())
      .attr("height", (d) => y(0) - y(d.y))
      .attr("fill", (d, i) => colors(i)) // Assign random color
      .on("mouseover", (event, d) => {
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip
          .html(`Count: ${d.y}`)
          .style("left", event.pageX + 5 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", () => {
        tooltip.transition().duration(500).style("opacity", 0);
      });
  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default BarChart;
