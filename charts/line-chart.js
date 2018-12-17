function lineChart() {

    let initialConfiguration = {
        width: 1000,
        height: 600,
        data: [],
        xAxisLabel: 'Average salary (EUR)',
        yAxisLabel: 'Number of respondents',
        colorScale: d3.scaleOrdinal(d3.schemeSet3),
        tooltipFormatter: (data) => {
            return `${xAxisLabel}: ${data.key}<br>
            ${yAxisLabel}: ${data.value}`;
        }
    };

    let width = initialConfiguration.width,
        height = initialConfiguration.height,
        data = initialConfiguration.data,
        xAxisLabel = initialConfiguration.xAxisLabel,
        yAxisLabel = initialConfiguration.yAxisLabel,
        colorScale = initialConfiguration.colorScale,
        tooltipFormatter = initialConfiguration.tooltipFormatter;

    function chart(selection) {
        selection.each(function () {
            const lineChartSvg = selection.append('svg')
                .attr('height', height)
                .attr('width', width);

            const xDomainValues = data.map(group => group.values.map(v => parseInt(v.key))).flat();
            const yDomainValues = data.map(group => group.values.map(v => parseInt(v.value))).flat();

            const xScale = d3.scaleLinear()
                .domain([d3.min(xDomainValues), d3.max(xDomainValues)]) // input
                .range([margin.left, width - margin.right]); // output

            const yScale = d3.scaleLinear()
                .domain([d3.min(yDomainValues), d3.max(yDomainValues)]) // input
                .range([height - margin.top, margin.bottom]); // output

            const line = d3.line()
                .x(d => xScale(d.key))
                .y(d => yScale(d.value))
                .curve(d3.curveMonotoneX);

            const xAxis = d3.axisBottom(xScale)
                .tickFormat((d) => {
                    return `EUR ${d / 1000} K`;
                })
                .tickSize(-height + margin.top + margin.bottom)
                .tickSizeOuter(0);

            const gXAxis = lineChartSvg.append("g")
                .attr("class", "x axis")
                .attr("transform", `translate(0,${(height - margin.top)})`)
                .call(xAxis);

            Utils.appendXAxis(gXAxis, width - margin.right, -25, xAxisLabel);

            const yAxis = d3.axisLeft(yScale)
                .ticks(10)
                .tickSize(-width + margin.left + margin.right)
                .tickSizeOuter(0);

            const gYAxis = lineChartSvg.append("g")
                .attr("class", "y axis")
                .attr("transform", `translate(${margin.left},0)`)
                .call(yAxis);

            Utils.appendYAxis(gYAxis, -50, 5, yAxisLabel);

            const tooltip = d3.tip()
                .attr("class", "d3-tip")
                .offset([-8, 0])
                .html(tooltipFormatter);

            lineChartSvg.call(tooltip);

            data.forEach((genderGroup) => {
                lineChartSvg.append("path")
                    .datum(genderGroup.values) // 10. Binds data to the line
                    .attr("stroke-width", 3)
                    .attr("fill", "none")
                    .attr("opacity", "0.5")
                    .attr("stroke", function () {
                        return colorScale(genderGroup.key);
                    })
                    .attr("d", line); // 11. Calls the line generator
            });

            data.forEach((genderGroup, index) => {
                lineChartSvg.selectAll(".dot" + index)
                    .data(genderGroup.values)
                    .enter()
                    .append("circle")
                    .attr("class", "dot" + index) // Assign a class for styling
                    .attr("cx", function (d) {
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
            });

            Utils.appendTitle(lineChartSvg, width / 2, margin.top / 2, `${yAxisLabel} vs ${xAxisLabel}`);

            const legend = stackedLegend()
                .colorScale(colorScale)
                .data(colorScale.domain());

            lineChartSvg.append("g")
                .attr("transform", `translate(${width - 120}, 0)`)
                .call(legend);
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

    chart.colorScale = function (value) {
        if (!arguments.length) return colorScale;
        colorScale = value;
        return chart;
    };

    chart.tooltipFormatter = function (value) {
        if (!arguments.length) {
            return tooltipFormatter
        }
        else {
            if (value == null) {
                tooltipFormatter = initialConfiguration.tooltipFormatter;
            } else {
                tooltipFormatter = value;
            }
            return chart;
        }
    };

    chart.data = function (value) {
        if (!arguments.length) return data;
        data = value;
        return chart;
    };

    return chart;
}