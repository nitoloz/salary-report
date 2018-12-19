function boxPlot() {

    let initialConfiguration = {
        width: 1000,
        height: 600,
        data: [],
        xAxisProperty: TOTAL_EXPERIENCE,
        yAxisProperty: CURRENT_SALARY,
        trellisingProperty: SEX,
        xAxisLabel: 'Total experience (Years)',
        yAxisLabel: 'Salary (EUR)',
        // colorScale: d3.scaleOrdinal(d3.schemeSet3),
        // tooltipFormatter: (d) => {
        //     return `<!--Position: ${d[POSITION]}<br>-->
        <!--Total Experience: ${d[TOTAL_EXPERIENCE]}<br>-->
        // Salary 12.2017: ${d[CURRENT_SALARY]}<br>
        // Salary 12.2016: ${d[PREVIOUS_SALARY]}<br>
        // First EU Salary: ${d[FIRST_EUROPE_SALARY]}<br>
        // Company Size: ${d[COMPANY_SIZE]}<br>
        // Age: ${d[AGE] || 'no data'}`;
        // }
    };

    let width = initialConfiguration.width,
        height = initialConfiguration.height,
        data = initialConfiguration.data,
        // xAxisLabel = initialConfiguration.xAxisLabel,
        // yAxisLabel = initialConfiguration.yAxisLabel,
        xAxisProperty = initialConfiguration.xAxisProperty,
        yAxisProperty = initialConfiguration.yAxisProperty,
        trellisingProperty = initialConfiguration.trellisingProperty;
    // colorScale = initialConfiguration.colorScale,
    // tooltipFormatter = initialConfiguration.tooltipFormatter;

    function chart(selection) {
        selection.each(function () {
            const xDomainValues = data.map(group => group.key).flat().sort((a, b) => parseInt(a) - parseInt(b));
            const yDomainValues = data.map(group => group.values.map(v => parseInt(v[yAxisProperty]))).flat().sort((a, b) => a - b);

            let barWidth = 30;


// Prepare the data for the box plots
            let boxPlotData = [];
            // for (let [boxKey, boxEntries] of Object.entries(data)) {
            data.forEach((boxObject) => {
                const boxValues = boxObject.values.map(entry => parseInt(entry[yAxisProperty]));
                let localMin = d3.min(boxValues);
                let localMax = d3.max(boxValues);
                let obj = {};
                obj["key"] = boxObject.key;
                obj["counts"] = boxValues;
                obj["quartile"] = boxQuartiles(boxValues);
                obj["whiskers"] = [localMin, localMax];
                // obj["color"] = colorScale(boxObject.key);
                boxPlotData.push(obj);
            });

// Setup a color scale for filling each box
            let colorScale = d3.scaleLinear().domain(boxPlotData.map(box => box.quartile[1])).range(['blue', 'red']);
            boxPlotData.forEach(box => box.color = colorScale(box.quartile[1]));

// Compute an ordinal xScale for the keys in boxPlotData
            let xScale = d3.scalePoint()
                .domain(xDomainValues)
                .rangeRound([0, width])
                .padding([0.5]);

// Compute a global y scale based on the global counts
            let yScale = d3.scaleLinear()
                .domain([d3.min(yDomainValues), d3.max(yDomainValues)])
                .range([height, 0]);

            let svg = selection.append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

// append a group for the box plot elements
            let g = svg.append("g");

// Draw the box plot vertical lines
            let verticalLines = g.selectAll(".verticalLines")
                .data(boxPlotData)
                .enter()
                .append("line")
                .attr("x1", function (datum) {
                    return xScale(datum.key);
                })
                .attr("y1", function (datum) {
                    return yScale(datum.whiskers[0]);
                })
                .attr("x2", function (datum) {
                    return xScale(datum.key);
                })
                .attr("y2", function (datum) {
                    return yScale(datum.whiskers[1]);
                })
                .attr("stroke", "#000")
                .attr("stroke-width", 1)
                .attr("fill", "none");

// Draw the boxes of the box plot, filled and on top of vertical lines
            let rects = g.selectAll("rect")
                .data(boxPlotData)
                .enter()
                .append("rect")
                .attr("width", barWidth)
                .attr("height", function (datum) {
                    let quartiles = datum.quartile;
                    let height = yScale(quartiles[0]) - yScale(quartiles[2]);
                    return height;
                })
                .attr("x", function (datum) {
                    return xScale(datum.key) - (barWidth / 2);
                })
                .attr("y", function (datum) {
                    return yScale(datum.quartile[2]);
                })
                .attr("fill", function (datum) {
                    return datum.color;
                })
                .attr("stroke", "#000")
                .attr("stroke-width", 1);

// Now render all the horizontal lines at once - the whiskers and the median
            let horizontalLineConfigs = [
                // Top whisker
                {
                    x1: function (datum) {
                        return xScale(datum.key) - barWidth / 2
                    },
                    y1: function (datum) {
                        return yScale(datum.whiskers[0])
                    },
                    x2: function (datum) {
                        return xScale(datum.key) + barWidth / 2
                    },
                    y2: function (datum) {
                        return yScale(datum.whiskers[0])
                    }
                },
                // Median line
                {
                    x1: function (datum) {
                        return xScale(datum.key) - barWidth / 2
                    },
                    y1: function (datum) {
                        return yScale(datum.quartile[1])
                    },
                    x2: function (datum) {
                        return xScale(datum.key) + barWidth / 2
                    },
                    y2: function (datum) {
                        return yScale(datum.quartile[1])
                    }
                },
                // Bottom whisker
                {
                    x1: function (datum) {
                        return xScale(datum.key) - barWidth / 2
                    },
                    y1: function (datum) {
                        return yScale(datum.whiskers[1])
                    },
                    x2: function (datum) {
                        return xScale(datum.key) + barWidth / 2
                    },
                    y2: function (datum) {
                        return yScale(datum.whiskers[1])
                    }
                }
            ];

            for (let i = 0; i < horizontalLineConfigs.length; i++) {
                let lineConfig = horizontalLineConfigs[i];

                // Draw the whiskers at the min for this series
                let horizontalLine = g.selectAll(".whiskers")
                    .data(boxPlotData)
                    .enter()
                    .append("line")
                    .attr("x1", lineConfig.x1)
                    .attr("y1", lineConfig.y1)
                    .attr("x2", lineConfig.x2)
                    .attr("y2", lineConfig.y2)
                    .attr("stroke", "#000")
                    .attr("stroke-width", 1)
                    .attr("fill", "none");
            }

// Move the left axis over 25 pixels, and the top axis over 35 pixels
//let axisY = svg.append("g").attr("transform", "translate(25,0)");
//let axisX = svg.append("g").attr("transform", "translate(35,0)");

//x-axis
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(xScale));

// Add the Y Axis
            svg.append("g")
                .call(d3.axisLeft(yScale));

            function boxQuartiles(d) {
                return [
                    d3.quantile(d, .25),
                    d3.quantile(d, .5),
                    d3.quantile(d, .75)
                ];
            }

// Perform a numeric sort on an array
            function sortNumber(a, b) {
                return a - b;
            }
        })
    }

    chart.width = function (value) {
        if (!arguments.length) return width;
        width = value;
        return chart;
    };

    chart.height = function (value) {
        if (!arguments.length) return height;
        height = value;
        return chart;
    };

    chart.data = function (value) {
        if (!arguments.length) return data;
        data = value;
        return chart;
    };

    return chart;
}









