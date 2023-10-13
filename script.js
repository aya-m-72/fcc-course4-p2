const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"

const svg = d3.select("svg")
const w = 1000
const h = 600
const padding = 50

let xScale
let yScale
let xAxis
let yAxis

const drawCanvas = () => {
  svg
    .attr("width", w)
    .attr("height", h)
    .style("background-color", "white")
    .style("border-radius", "0 0 20px 20px")
}

const rest = (dataset) => {
  //scales
  xScale = d3
    .scaleLinear()
    .domain([
      d3.min(dataset, (d) => d.Year) - 1,
      d3.max(dataset, (d) => d.Year) + 1,
    ])
    .range([padding, w - padding])
  yScale = d3
    .scaleTime()
    .domain([
      d3.min(dataset, (d) => new Date(d.Seconds * 1000)),
      d3.max(dataset, (d) => new Date(d.Seconds * 1000)),
    ])
    .range([padding, h - padding])

  xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"))
  yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"))

  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0,${h - padding})`)
    .call(xAxis)
  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding},0)`)
    .call(yAxis)

  svg
    .selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", (d) => xScale(d.Year))
    .attr("cy", (d) => yScale(d.Seconds * 1000))
    .attr("r", 8)
    .attr("fill", (d) => {
      if (d.Doping) {
        return "blue"
      }
      return "orange"
    })
    .attr("data-xvalue", (d) => d.Year)
    .attr("data-yvalue", (d) => new Date(d.Seconds * 1000))
    .on("mouseover", (d) => {
      d3.select("#tooltip")
        .attr("data-year", d.Year)
        .transition()
        .style("visibility", "visible")
      document.getElementById("tooltip").innerHTML = `${d.Name}<br/>Year: ${
        d.Year
      }, Time: ${d.Time}${d.Doping ? `<br/><br/>${d.Doping}` : ""}`
    })
    .on("mouseout", (d) => {
      d3.select("#tooltip").transition().style("visibility", "hidden")
    })

  svg.append("g").attr("id", "legend")
  d3.select("#legend").append("g").attr("id", "legend-label1")
  d3.select("#legend").append("g").attr("id", "legend-label2")

  d3.select("#legend-label1")
    .append("rect")
    .attr("width", 20)
    .attr("height", 20)
    .attr("x", w - padding - 190)
    .attr("y", padding)
    .attr("fill", "blue")
  d3.select("#legend-label2")
    .append("rect")
    .attr("width", 20)
    .attr("height", 20)
    .attr("x", w - padding - 190)
    .attr("y", padding + 30)
    .attr("fill", "orange")

  d3.select("#legend-label1")
    .append("text")
    .attr("x", w - padding - 160)
    .attr("y", padding + 12)
    .text("Riders with doping allegations")
  d3.select("#legend-label2")
    .append("text")
    .attr("x", w - padding - 160)
    .attr("y", padding + 42)
    .text("No doping allegations")
}

fetch(url)
  .then((resp) => resp.json())
  .then((rawData) => {
    drawCanvas()
    rest(rawData)
  })
  .catch((err) => console.log(err))
