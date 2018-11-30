let linePlotSvg = d3.select("#line-chart-area")
    .append('svg')
    .attr('height', height)
    .attr('width', width);

d3.csv('data/salaries-responses.csv')
    .then((data) => {
        data = data.filter(d => parseInt(d[CURRENT_SALARY]) > 0 && parseInt(d[TOTAL_EXPERIENCE]) > 0);

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
                    key: genderGroup.key,
                    values: genderGroup.values.sort(function (x, y) {
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
            })
            .y(function (d) {
                return yScale(d.value);
            })
            .curve(d3.curveMonotoneX) // apply smoothing to the line


        let xAxis = d3.axisBottom(xScale)
            .tickFormat((d) => {
                return "EUR " + d / 1000 + "K";
            })
            .tickSize(-height + margin.top + margin.bottom)
            .tickSizeOuter(0);

// 3. Call the x axis in a group tag
        linePlotSvg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (height - margin.top) + ")")
            .call(xAxis); // Create an axis component with d3.axisBottom

        let yAxis = d3.axisLeft(yScale)
            .ticks(10)
            .tickSize(-width + margin.left + margin.right)
            .tickSizeOuter(0);

        linePlotSvg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + margin.left + ",0)")
            .call(yAxis); // Create an axis component with d3.axisLeft

        let tooltip = d3.tip()
            .attr("class", "d3-tip")
            .offset([-8, 0])
            .html(function (d) {
                return `Average salary: ${d.key}<br>
                    Number of people: ${d.value}`
            });

        linePlotSvg.call(tooltip);

        let colorScale = d3.scaleOrdinal()
            .domain(["M", "F"])
            .range(["#80b1d3", "#fb8072"]);

// 9. Append the path, bind the data, and call the line generator
        groupedData.forEach((genderGroup, index) => {
            linePlotSvg.append("path")
                .datum(genderGroup.values) // 10. Binds data to the line
                .attr("stroke-width", 3)
                .attr("fill", "none")
                .attr("opacity", "0.5")
                .attr("stroke", function () {
                    return colorScale(genderGroup.key);
                })
                .attr("d", line); // 11. Calls the line generator
        });

// 12. Appends a circle for each datapoint
        groupedData.forEach((genderGroup, index) => {
            linePlotSvg.selectAll(".dot" + index)
                .data(genderGroup.values)
                .enter()
                .append("circle")
                .attr("class", "dot" + index) // Assign a class for styling
                .attr("cx", function (d, i) {
                    return xScale(parseInt(d.key))
                })
                .attr("cy", function (d) {
                    return yScale(d.value)
                })
                .attr("r", 5)
                .attr("fill", function () {
                    return colorScale(genderGroup.key);
                })
                .on("mouseover", function (d) {
                    d3.select(this)
                        .transition()
                        .duration(100)
                        .attr('r', 10)
                        .attr('stroke-width', 3);
                    tooltip.show(d);

                })
                .on("mouseout", function () {
                    d3.select(this)
                        .transition()
                        .duration(100)
                        .attr('r', 5)
                        .attr('stroke-width', 1);
                    tooltip.hide();

                });
        })
    });


