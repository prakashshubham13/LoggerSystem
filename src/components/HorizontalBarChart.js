import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const HorizontalBarChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = 800;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 40, left: 10 }; 

    svg.attr("width", width).attr("height", height);

    const x = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.y)])
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleBand()
      .domain(data.map((d) => d.x))
      .range([margin.top, height - margin.bottom])
      .padding(0.1);

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(d3.max(data, (d) => d.y))
          .tickFormat(d3.format("d"))
      )
      .selectAll("text")
      .style("fill", "#c9d1d9"); // Ensure x-axis text is readable

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).tickSize(0).tickFormat("")) // Hide y-axis labels
      .selectAll("text")
      .style("fill", "#c9d1d9"); // Ensure y-axis text is readable

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
      .attr("x", margin.left)
      .attr("y", (d) => y(d.x))
      .attr("width", (d) => x(d.y) - margin.left)
      .attr("height", y.bandwidth())
      .attr("fill", (d, i) => colors(i)) // Assign random color
      .on("mouseover", (event, d) => {
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip
          .html(`Route: ${d.x}<br>Count: ${d.y}`) // Show y-axis value
          .style("left", event.pageX + 5 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", () => {
        tooltip.transition().duration(500).style("opacity", 0);
      });


  }, [data]);

  return (
    <div style={{ overflowY: "auto", maxHeight: "300px" }}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default HorizontalBarChart;
