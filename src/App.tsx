import * as d3 from "d3";
import React from "react";

function App() {
  const ref = React.useRef();

  const canvasWidht = 1900;
  const canasHeight = 800;

  React.useEffect(() => {
    // set the dimensions and margins of the graph
    const margin = { top: 30, right: 30, bottom: 70, left: 60 };
    const width = canvasWidht - margin.left - margin.right;
    const height = canasHeight - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    //Read the data
    d3.csv(
      "https://raw.githubusercontent.com/Brix101/pulse-data/master/data.csv",
      // When reading the csv, I must format variables:
      (d) => {
        console.log(d);
        return {
          date: d3.timeParse("%Y-%m-%d")(d.date),
          value: d.value,
        };
      },
    ).then(
      // Now I can use this dataset:
      function (data) {
        // Add X axis --> it is a date format
        const x = d3
          .scaleTime()
          .domain(d3.extent(data, (d) => d.date))
          .range([0, width]);

        svg
          .append("g")
          .attr("transform", `translate(0,${height})`)
          .call(d3.axisBottom(x));

        // Add Y axis
        const y = d3
          .scaleLinear()
          .domain([0, d3.max(data, (d) => +d.value)])
          .range([height, 0]);
        svg.append("g").call(d3.axisLeft(y));

        // Add the area
        svg
          .append("path")
          .datum(data)
          .attr("fill", "#cce5df")
          .attr("stroke", "#69b3a2")
          .attr("stroke-width", 1.5)
          .attr(
            "d",
            d3
              .area()
              .x((d) => x(d.date))
              .y0(y(0))
              .y1((d) => y(d.value)),
          );
      },
    );
  }, []);

  return (
    <svg width={canvasWidht} height={canasHeight} id="barchart" ref={ref} />
  );
}

export default App;
