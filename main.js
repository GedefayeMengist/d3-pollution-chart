// TODO load the pollution.csv dataset (stored in the 'data' folder of this repo)
// HINT be careful with the path to your dataset

// TODO append an svg to the body of the index.html page using d3 syntax
// TODO ensure your svg displays a bar for each record in the csv.
// TODO the height of each bar should be equal to the 'Both sexes' field for each record
// NOTE you SHOULD make use of a scale as we did in the tutorial to do this
// HINT to access a multi-word field you may have to use d['name of field']
// TODO ensure your svg is big enough and there is no overlapping or visual artefacts
// NOTE the finished chart will not fit on one screen and it is expected that you will have to scroll to see all the data

// TODO Colour the bars so they range from white (low value) to dark green (high value)
// TODO Highlight the top 20% of possible values

// TODO ensure the background (of either the svg, or the whole webpage) is off-white
// HINT if you add a css file don't forget to link it

// TODO Ensure that each bar is labelled with the country name AND disease

// TODO in the vertical.js file recreate this bar chart but in a vertical orientation




// Some very basic starter code has been provided below, feel free to start from scratch if you prefer

// Variables for the height and width of the svg
let w = 100;
let h = 50;
const margin = { top: 20, right: 20, bottom: 20, left: 60 };

// This code will almost add the svg to the body but you will have to update inside the parentheses accordingly
let svg = d3.select("#chart").append("svg")
    .style("background-color", "lightgray");

let chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip");

// This will load your specified data file in an asynchronous manner
d3.csv('data/pollution.csv').then(data => {
    data.forEach(d => {
        d["Both sexes"] = +d["Both sexes"] || 0;
    });

    // Update width and height based on data
    w = data.length * 20; 
    h = d3.max(data, d => d["Both sexes"]) * 10; 

    // Set the SVG width and height after calculating w and h
    svg.attr("width", w + margin.left + margin.right)
        .attr("height", h + margin.top + margin.bottom);

    const xScale = d3.scaleLinear()
        .domain([0, data.length])
        .range([0, w - margin.left - margin.right]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d["Both sexes"])])
        .range([h - margin.top - margin.bottom, 0]);

    const colorScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d["Both sexes"])])
        .range([255, 0]);

    const top20Percent = d3.quantile(data.map(d => d["Both sexes"]).sort(d3.ascending), 0.8);

    chartGroup.selectAll("rect")
        .data(data)
        .enter().append("rect")
        .attr("width", (w - margin.left - margin.right) / data.length - 1)
        .attr("height", d => yScale(d["Both sexes"]))
        .attr("x", (d, i) => xScale(i))
        .attr("y", d => h - margin.top - margin.bottom - yScale(d["Both sexes"]))
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
        .attr("x", (d, i) => xScale(i) + (w - margin.left - margin.right) / data.length / 2)
        .attr("y", h - margin.top - margin.bottom + 15)
        .attr("transform", "rotate(90)")
        .style("font-size", "6px")
        .attr("text-anchor", "middle");
        chartGroup.selectAll("text").remove(); // Remove the axis labels - KEY ADDITION



});