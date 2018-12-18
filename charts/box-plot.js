function boxPlot() {
    function chart(selection) {
        selection.each(function () {

            let barWidth = 30;

// Generate five 100 count, normal distributions with random means
            let groupCounts = {};
            let globalCounts = [];
            let meanGenerator = d3.randomUniform(10);
            for (i = 0; i <= 5; i++) {
                let randomMean = meanGenerator();
                let generator = d3.randomNormal(randomMean);
                let key = i.toString();
                groupCounts[key] = [];

                for (j = 0; j < 100; j++) {
                    let entry = generator();
                    groupCounts[key].push(entry);
                    globalCounts.push(entry);
                }
            }

// Sort group counts so quantile methods work
            for (let key in groupCounts) {
                let groupCount = groupCounts[key];
                groupCounts[key] = groupCount.sort(sortNumber);
            }

// Setup a color scale for filling each box
            let colorScale = d3.scaleOrdinal(d3.schemeCategory10)
                .domain(Object.keys(groupCounts));

// Prepare the data for the box plots
            let boxPlotData = [];
            for (let [key, groupCount] of Object.entries(groupCounts)) {
                let localMin = d3.min(groupCount);
                let localMax = d3.max(groupCount);

                let obj = {};
                obj["key"] = key;
                obj["counts"] = groupCount;
                obj["quartile"] = boxQuartiles(groupCount);
                obj["whiskers"] = [localMin, localMax];
                obj["color"] = colorScale(key);
                boxPlotData.push(obj);
            }

// Compute an ordinal xScale for the keys in boxPlotData
            let xScale = d3.scalePoint()
                .domain(Object.keys(groupCounts))
                .rangeRound([0, width])
                .padding([0.5]);

// Compute a global y scale based on the global counts
            let min = d3.min(globalCounts);
            let max = d3.max(globalCounts);
            let yScale = d3.scaleLinear()
                .domain([min, max])
                .range([height, 0]);

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
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

    return chart;
}









