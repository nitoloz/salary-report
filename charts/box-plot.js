function boxPlot() {

    let initialConfiguration = {
        width: 1000,
        height: 600,
        data: [],
        xAxisProperty: TOTAL_EXPERIENCE,
        yAxisProperty: CURRENT_SALARY,
        // trellisingProperty: SEX,
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
        xAxisLabel = initialConfiguration.xAxisLabel,
        yAxisLabel = initialConfiguration.yAxisLabel,
        xAxisProperty = initialConfiguration.xAxisProperty,
        yAxisProperty = initialConfiguration.yAxisProperty;
    // trellisingProperty = initialConfiguration.trellisingProperty;
    // colorScale = initialConfiguration.colorScale,
    // tooltipFormatter = initialConfiguration.tooltipFormatter;

    function chart(selection) {
        selection.each(function () {
            const xDomainValues = data.map(group => group.key).flat().sort((a, b) => parseInt(a) - parseInt(b));
            const yDomainValues = data.map(group => group.values.map(v => parseInt(v[yAxisProperty]))).flat().sort((a, b) => a - b);

            let barWidth = 30;


// Prepare the data for the box plots
            const boxPlotData = data.map((boxObject) => {
                const boxValues = boxObject.values.map(entry => parseInt(entry[yAxisProperty]));
                return {
                    key: boxObject.key,
                    counts: boxValues,
                    quartile: boxQuartiles(boxValues),
                    whiskers: [d3.min(boxValues), d3.max(boxValues)]
                };
            });

            let colorScale = d3.scaleLinear()
                .domain(boxPlotData.map(box => box.quartile[1]))
                .range(['blue', 'red']);
            boxPlotData.forEach(box => box.color = colorScale(box.quartile[1]));

            let xScale = d3.scalePoint()
                .domain(xDomainValues)
                .rangeRound([margin.left, width - margin.right])
                .padding([0.5]);

            let yScale = d3.scaleLinear()
                .domain([
                    d3.min(yDomainValues),
                    d3.max(yDomainValues)
                ])
                .range([height - margin.bottom, margin.top]);

            let svg = selection.append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g");

// append a group for the box plot elements
            let g = svg.append("g");

// Draw the box plot vertical lines
            let verticalLines = g.selectAll(".verticalLines")
                .data(boxPlotData)
                .enter()
                .append("line")
                .attr("x1", (datum) => xScale(datum.key))
                .attr("y1", (datum) => yScale(datum.whiskers[0]))
                .attr("x2", (datum) => xScale(datum.key))
                .attr("y2", (datum) => yScale(datum.whiskers[1]))
                .attr("stroke", "#000")
                .attr("stroke-width", 1)
                .attr("fill", "none");

// Draw the boxes of the box plot, filled and on top of vertical lines
            let rects = g.selectAll("rect")
                .data(boxPlotData)
                .enter()
                .append("rect")
                .attr("width", barWidth)
                .attr("height", (datum) => yScale(datum.quartile[0]) - yScale(datum.quartile[2]))
                .attr("x", (datum) => xScale(datum.key) - (barWidth / 2))
                .attr("y", (datum) => yScale(datum.quartile[2]))
                .attr("fill", (datum) => datum.color)
                .attr("stroke", "#000")
                .attr("stroke-width", 1);

// Now render all the horizontal lines at once - the whiskers and the median
            let horizontalLineConfigs = [
                // Top whisker
                {
                    x1: (datum) => xScale(datum.key) - barWidth / 2,
                    y1: (datum) => yScale(datum.whiskers[0]),
                    x2: (datum) => xScale(datum.key) + barWidth / 2,
                    y2: (datum) => yScale(datum.whiskers[0])
                },
                // Median line
                {
                    x1: (datum) => xScale(datum.key) - barWidth / 2,
                    y1: (datum) => yScale(datum.quartile[1]),
                    x2: (datum) => xScale(datum.key) + barWidth / 2,
                    y2: (datum) => yScale(datum.quartile[1])
                },
                // Bottom whisker
                {
                    x1: (datum) => xScale(datum.key) - barWidth / 2,
                    y1: (datum) => yScale(datum.whiskers[1]),
                    x2: (datum) => xScale(datum.key) + barWidth / 2,
                    y2: (datum) => yScale(datum.whiskers[1])
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
//x-axis
            svg.append("g")
                .attr("transform", `translate(0,${height - margin.top})`)
                .call(d3.axisBottom(xScale));

// Add the Y Axis
            svg.append("g")
                .attr("transform", `translate(${margin.left},0)`)
                .call(d3.axisLeft(yScale));

            function boxQuartiles(d) {
                return [
                    d3.quantile(d, .25),
                    d3.quantile(d, .5),
                    d3.quantile(d, .75)
                ];
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









