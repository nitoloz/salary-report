function boxPlot() {

    let initialConfiguration = {
        width: 1000,
        height: 600,
        data: [],
        xAxisProperty: TOTAL_EXPERIENCE,
        yAxisProperty: CURRENT_SALARY,
        xAxisLabel: 'Total experience (Years)',
        yAxisLabel: 'Salary (EUR)',
        // colorScale: d3.scaleOrdinal(d3.schemeSet3),
        tooltipFormatter: (d) => {
            return `${xAxisLabel}: ${d.key}<br>
            Lower whisker: ${d.whiskers[0]}<br>
            1st quartile: ${d.quartile[0]}<br>
            Median: ${d.quartile[1]}<br>
            3rd quartile: ${d.quartile[2]}<br>
            Upper whisker: ${d.whiskers[1]}<br>
            Number of respondents: ${d.rawValues.length}`;
        }
    };

    let width = initialConfiguration.width,
        height = initialConfiguration.height,
        data = initialConfiguration.data,
        xAxisLabel = initialConfiguration.xAxisLabel,
        yAxisLabel = initialConfiguration.yAxisLabel,
        xAxisProperty = initialConfiguration.xAxisProperty,
        yAxisProperty = initialConfiguration.yAxisProperty,
        // colorScale = initialConfiguration.colorScale,
        tooltipFormatter = initialConfiguration.tooltipFormatter;

    function chart(selection) {
        selection.each(function () {
            const xDomainValues = data.map(group => group.key).flat().sort((a, b) => parseInt(a) - parseInt(b));
            const yDomainValues = data.map(group => group.values.map(v => parseInt(v[yAxisProperty]))).flat().sort((a, b) => a - b);


            const boxPlotData = data.map((boxObject) => {
                const boxValues = boxObject.values.map(entry => parseInt(entry[yAxisProperty]));
                return {
                    key: boxObject.key,
                    quartile: boxQuartiles(boxValues),
                    whiskers: [d3.min(boxValues), d3.max(boxValues)],
                    rawValues: boxObject.values
                };
            });

            const colorScale = d3.scaleLinear()
                .domain(boxPlotData.map(box => box.quartile[1]))
                .range(['blue', 'red']);

            boxPlotData.forEach(box => box.color = colorScale(box.quartile[1]));

            const xScale = d3.scaleBand()
                .domain(xDomainValues)
                .range([margin.left, width - margin.right])
                .paddingInner(0.1)
                .paddingOuter(0.1);

            const barWidth = xScale.bandwidth();

            const yScale = d3.scaleLinear()
                .domain([
                    d3.min(yDomainValues),
                    d3.max(yDomainValues)
                ])
                .range([height - margin.bottom, margin.top]);

            const svg = selection.append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g");

            const tooltip = d3.tip()
                .attr("class", "d3-tip")
                .offset([-8, 0])
                .html(tooltipFormatter);

            svg.call(tooltip);

            const boxElementsGroup = svg.append("g");

            boxElementsGroup.selectAll("rect")
                .data(boxPlotData)
                .enter()
                .append("rect")
                .attr("width", barWidth)
                .attr("height", (datum) => yScale(datum.quartile[0]) - yScale(datum.quartile[2]))
                .attr("x", (datum) => xScale(datum.key))
                .attr("y", (datum) => yScale(datum.quartile[2]))
                .attr("fill", (datum) => datum.color)
                .attr("stroke", "#000")
                .attr("stroke-width", 1)
                .on('mouseover', d => tooltip.show(d))
                .on('mouseout', () => tooltip.hide());

            const horizontalLineConfigs = [
                //Line between lower whisker and box
                {
                    x1: (datum) => xScale(datum.key) + barWidth / 2,
                    y1: (datum) => yScale(datum.whiskers[0]),
                    x2: (datum) => xScale(datum.key) + barWidth / 2,
                    y2: (datum) => yScale(datum.quartile[0])
                },
                //Line between upper whisker and box
                {
                    x1: (datum) => xScale(datum.key) + barWidth / 2,
                    y1: (datum) => yScale(datum.quartile[2]),
                    x2: (datum) => xScale(datum.key) + barWidth / 2,
                    y2: (datum) => yScale(datum.whiskers[1])
                },
                // Top whisker
                {
                    x1: (datum) => xScale(datum.key),
                    y1: (datum) => yScale(datum.whiskers[0]),
                    x2: (datum) => xScale(datum.key) + barWidth,
                    y2: (datum) => yScale(datum.whiskers[0])
                },
                // Median line
                {
                    x1: (datum) => xScale(datum.key),
                    y1: (datum) => yScale(datum.quartile[1]),
                    x2: (datum) => xScale(datum.key) + barWidth,
                    y2: (datum) => yScale(datum.quartile[1])
                },
                // Bottom whisker
                {
                    x1: (datum) => xScale(datum.key),
                    y1: (datum) => yScale(datum.whiskers[1]),
                    x2: (datum) => xScale(datum.key) + barWidth,
                    y2: (datum) => yScale(datum.whiskers[1])
                }
            ];

            horizontalLineConfigs.forEach(lineConfig => {
                // Draw the whiskers at the min for this series
                boxElementsGroup.selectAll(".whiskers")
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
            });

            const xAxis = d3.axisBottom(xScale)
                .tickSize(-height + margin.top + margin.bottom)
                .tickSizeOuter(0);

            const gXAxis = svg.append("g")
                .attr("class", "x axis")
                .attr("transform", `translate(0,${(height - margin.top)})`)
                .call(xAxis);

            Utils.appendXAxis(gXAxis, width - margin.right, -12, xAxisLabel);

            const yAxis = d3.axisLeft(yScale)
                .tickFormat((d) => {
                    return `EUR ${d / 1000} K`;
                })
                .tickSize(-width + margin.left + margin.right)
                .tickSizeOuter(0);

            const gYAxis = svg.append("g")
                .attr("class", "y axis")
                .attr("transform", `translate(${margin.left},0)`)
                .call(yAxis);

            Utils.appendYAxis(gYAxis, -50, 5, yAxisLabel);

            Utils.appendTitle(svg, width / 2, margin.top / 2, `${yAxisLabel} vs ${xAxisLabel}`);

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

    chart.xAxisLabel = function (value) {
        if (!arguments.length) return xAxisLabel;
        xAxisLabel = value;
        return chart;
    };

    chart.yAxisLabel = function (value) {
        if (!arguments.length) return yAxisLabel;
        yAxisLabel = value;
        return chart;
    };

    chart.data = function (value) {
        if (!arguments.length) return data;
        data = value;
        return chart;
    };

    return chart;
}









