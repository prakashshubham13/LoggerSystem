import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const CircularBarChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const innerRadius = 100;
    const outerRadius = Math.min(width, height) / 2 - margin.left;

    svg.attr("width", width).attr("height", height);

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.x))
      .range([0, 2 * Math.PI])
      .align(0);

    const y = d3
      .scaleRadial()
      .domain([0, d3.max(data, (d) => d.y)])
      .range([innerRadius, outerRadius]);

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

    g.append("g")
      .selectAll("path")
      .data(data)
      .enter()
      .append("path")
      .attr("fill", (d, i) => d3.schemeCategory10[i % 10])
      .attr(
        "d",
        d3
          .arc()
          .innerRadius(innerRadius)
          .outerRadius((d) => y(d.y))
          .startAngle((d) => x(d.x))
          .endAngle((d) => x(d.x) + x.bandwidth())
          .padAngle(0.01)
          .padRadius(innerRadius)
      )
      .on("mouseover", (event, d) => {
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip
          .html(`Value: ${d.x}<br>Count: ${d.y}`)
          .style("left", event.pageX + 5 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", () => {
        tooltip.transition().duration(500).style("opacity", 0);
      });

    g.append("g")
      .selectAll("g")
      .data(data)
      .enter()
      .append("g")
      .attr("text-anchor", (d) =>
        (x(d.x) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI
          ? "end"
          : "start"
      )
      .attr("transform", (d) => {
        return (
          "rotate(" +
          (((x(d.x) + x.bandwidth() / 2) * 180) / Math.PI - 90) +
          ")" +
          "translate(" +
          (y(d.y) + 10) +
          ",0)"
        );
      })
      .append("text")
      .text((d) => d.x)
      .attr("transform", (d) => {
        return (x(d.x) + x.bandwidth() / 2 + Math.PI) % (2 * 2 * Math.PI) <
          Math.PI
          ? "rotate(180)translate(-16)"
          : "rotate(0)";
      })
      .style("font-size", "11px")
      .style("fill", "#c9d1d9") // Ensure text is readable
      .attr("alignment-baseline", "middle");
  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default CircularBarChart;
