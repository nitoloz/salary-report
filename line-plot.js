let linePlotSvg = d3.select("#line-chart-area")
    .append('svg')
    .attr('height', height)
    .attr('width', width);

d3.csv('data/salaries-responses.csv')
    .then((data) => {
        let groupedData = processLineChartData(data, CURRENT_SALARY, SEX);


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

        const gXAxis = linePlotSvg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (height - margin.top) + ")")
            .call(xAxis); // Create an axis component with d3.axisBottom

        gXAxis.append('text')
            .attr('class', 'label')
            .attr('y', -25)
            .attr('x', width - margin.right)
            .attr('dy', '.71em')
            .style('text-anchor', 'end')
            .style('font-size', '12')
            .style('fill', 'black')
            .text('Average salary (EUR)');

        let yAxis = d3.axisLeft(yScale)
            .ticks(10)
            .tickSize(-width + margin.left + margin.right)
            .tickSizeOuter(0);

        const gYAxis = linePlotSvg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + margin.left + ",0)")
            .call(yAxis);


        gYAxis.append('text')
            .attr('class', 'label')
            .attr('transform', 'rotate(-90)')
            .attr('x', -50)
            .attr('y', 5)
            .attr('dy', '.71em')
            .style('font-size', '12')
            .style('fill', 'black')
            .style('text-anchor', 'end')
            .text('Number of respondents');

        let tooltip = d3.tip()
            .attr("class", "d3-tip")
            .offset([-8, 0])
            .html(function (d) {
                return `Average salary: ${d.key}<br>
                    Number of respondents: ${d.value}`
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


