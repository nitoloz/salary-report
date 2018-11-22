// const margin = {top: 50, right: 50, bottom: 50, left: 100};
// const height = 600;
// const width = 1000;

let linePlotSvg = d3.select("#line-chart-area")
    .append('svg')
    .attr('height', height)
    .attr('width', width);

d3.csv('data/salaries-responses.csv')
    .then((data) => {
        data = data.filter(d => parseInt(d[CURRENT_SALARY]) > 0 && parseInt(d[TOTAL_EXPERIENCE]) > 0);
        // let salaries = data.map(d => parseInt(d[CURRENT_SALARY]));
        // let experience = data.map(d => parseInt(d[TOTAL_EXPERIENCE]));

        let groupedData = d3.nest()
            .key((d) => {
                return d[SEX];
            })
            .key((d) => {
                return Math.round(d[CURRENT_SALARY] / 5000) * 5000;
            })
            .rollup((d) => {
                return d.length;
            })
            .entries(data)
            .map(genderGroup => {
                return {
                    key: genderGroup.key, values: genderGroup.values.sort(function (x, y) {
                        return d3.ascending(parseInt(x.key), parseInt(y.key));
                    })
                };
            });

// 5. X scale will use the index of our data
        let xScale = d3.scaleLinear()
        // .domain([parseInt(groupedData[0].key), parseInt(groupedData[groupedData.length - 1].key)]) // input
            .domain([30000, 150000]) // input
            .range([margin.left, width - margin.right]); // output

// 6. Y scale will use the randomly generate number
        let yScale = d3.scaleLinear()
            .domain([0, 60]) // input
            .range([height - margin.top, margin.bottom]); // output

// 7. d3's line generator
        let line = d3.line()
            .x(function (d) {
                return xScale(d.key);
            }) // set the x values for the line generator
            .y(function (d) {
                return yScale(d.value);
            }) // set the y values for the line generator
            .curve(d3.curveMonotoneX) // apply smoothing to the line


// 3. Call the x axis in a group tag
        linePlotSvg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (height - margin.top) + ")")
            .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

// 4. Call the y axis in a group tag
        linePlotSvg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + margin.left + ",0)")
            .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

// 9. Append the path, bind the data, and call the line generator
        groupedData.forEach((genderGroup, index) => {
            linePlotSvg.append("path")
                .datum(genderGroup.values) // 10. Binds data to the line
                .attr("class", "line") // Assign a class for styling
                .attr("d", line); // 11. Calls the line generator
        });

// 12. Appends a circle for each datapoint
        groupedData.forEach((genderGroup, index) => {
            linePlotSvg.selectAll(".dot" + index)
                .data(genderGroup.values)
                .enter()
                .append("circle") // Uses the enter().append() method
                .attr("class", "dot" + index) // Assign a class for styling
                .attr("cx", function (d, i) {
                    return xScale(parseInt(d.key))
                })
                .attr("cy", function (d) {
                    return yScale(d.value)
                })
                .attr("r", 5)
                .on("mouseover", function (a, b, c) {
                    d3.select(this)
                        .transition()
                        .duration(100)
                        .attr('r', 10)
                        .attr('stroke-width', 3)
                })
                .on("mouseout", function () {
                    d3.select(this)
                        .transition()
                        .duration(100)
                        .attr('r', 5)
                        .attr('stroke-width', 1)
                })
                .append('title')
                .text(function (d) {
                    return 'Average salary: ' + d.key +
                        '\nNumber of people: ' + d.value
                })
        })
    });


