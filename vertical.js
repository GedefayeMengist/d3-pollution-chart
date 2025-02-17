// TODO recreate the bar chart of the pollution.csv file that you should have completed in 'main.js'

// HINT if you can't see any changes make sure you have updated the link in your index.html file

// TODO Display the labels on the left hand side of the svg and the bars on the right hand side.
// TODO The labels should be aligned so that the END of the text is aligned with the start of the bar (see reference image in the readme).
// HINT Look into text-anchor

// TODO don't forget to add, commit, and push all your files to your github repo
let w = 100;
let h = 50;
const margin = { top: 20, right: 200, bottom: 20, left: 430 }; // Adjusted left margin

const svg = d3.select("#chart").append("svg")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
    .style("background-color", "lightgray");

const chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip");

d3.csv('data/pollution.csv').then(data => {
    data.forEach(d => {
        d["Both sexes"] = +d["Both sexes"] || 0;
    });

    w = d3.max(data, d => d["Both sexes"]) * 10;
    h = data.length * 20; // Adjust 20 for spacing - IMPORTANT

    svg.attr("width", w + margin.left + margin.right)
        .attr("height", h + margin.top + margin.bottom);

    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d["Both sexes"])])
        .range([0, w - margin.left - margin.right]);

    const yScale = d3.scaleLinear()
        .domain([0, data.length])
        .range([h - margin.top - margin.bottom, 0]);

    const colorScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d["Both sexes"])])
        .range([255, 0]);

    const top20Percent = d3.quantile(data.map(d => d["Both sexes"]).sort(d3.ascending), 0.8);

    chartGroup.selectAll("rect")
        .data(data)
        .enter().append("rect")
        .attr("width", d => xScale(d["Both sexes"]))
        .attr("height", (h - margin.top - margin.bottom) / data.length - 1)
        .attr("x", 0)
        .attr("y", (d, i) => yScale(i))
        .attr("fill", d => d["Both sexes"] >= top20Percent ? "red" : `rgb(${colorScale(d["Both sexes"])},${colorScale(d["Both sexes"])},${colorScale(d["Both sexes"])})`)
        .on("mouseover", (event, d) => {
            tooltip.transition()
                .duration(200)
                .style("opacity", 1);
            tooltip.html(`${d.Country} - ${d.Cause} (${d["Both sexes"]})`)
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", () => {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

        chartGroup.selectAll("text")
    .data(data)
    .enter().append("text")
    .text(d => `${d.Country} - ${d.Cause}`)
    .attr("x", -5) // Offset to the left of the bar start
    .attr("y", (d, i) => yScale(i) + (h - margin.top - margin.bottom) / data.length / 2)
    .style("font-size", "10px")
    .attr("text-anchor", "end")
    .attr("class", "bar-label");
    

});