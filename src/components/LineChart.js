import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const LineChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = 400;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };

    svg.attr("width", width).attr("height", height);

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.date))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.count)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(
        d3.axisBottom(x).tickFormat((d) => d3.timeFormat("%d-%b")(new Date(d))) // Show only date and month
      )
      .selectAll("text")
      .style("fill", "#c9d1d9"); // Ensure x-axis text is readable

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(
        d3
          .axisLeft(y)
          .ticks(d3.max(data, (d) => d.count))
          .tickFormat(d3.format("d"))
      ) // Show whole numbers
      .selectAll("text")
      .style("fill", "#c9d1d9"); // Ensure y-axis text is readable

    const line = d3
      .line()
      .x((d) => x(d.date) + x.bandwidth() / 2) // Adjust x position to center of band
      .y((d) => y(d.count))
      .curve(d3.curveMonotoneX);

    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#58a6ff")
      .attr("stroke-width", 2)
      .attr("d", line);

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

    svg
      .selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => x(d.date) + x.bandwidth() / 2) // Adjust x position to center of band
      .attr("cy", (d) => y(d.count))
      .attr("r", 5)
      .attr("fill", "#58a6ff")
      .on("mouseover", (event, d) => {
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip
          .html(
            `Date: ${d3.timeFormat("%d-%b")(new Date(d.date))}<br>Count: ${
              d.count
            }`
          )
          .style("left", event.pageX + 5 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", () => {
        tooltip.transition().duration(500).style("opacity", 0);
      });
  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default LineChart;
