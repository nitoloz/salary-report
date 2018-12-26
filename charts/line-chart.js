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
                .domain([d3.min(xDomainValues), d3.max(xDomainValues)])
                .range([margin.left, width - margin.right]);

            const yScale = d3.scaleLinear()
                .domain([d3.min(yDomainValues), d3.max(yDomainValues)])
                .range([height - margin.top, margin.bottom]);

            const line = d3.line()
                .x(d => xScale(d.key))
                .y(d => yScale(d.value))
                .curve(d3.curveMonotoneX);

            const xAxis = d3.axisBottom(xScale)
                .tickFormat(d => `EUR ${d / 1000} K`)
                .tickSize(-height + margin.top + margin.bottom)
                .tickSizeOuter(0);

            const gXAxis = lineChartSvg.append("g")
                .attr("class", "x axis")
                .attr("transform", `translate(0,${(height - margin.top)})`)
                .call(xAxis);

            const yAxis = d3.axisLeft(yScale)
                .tickFormat(d => `${d}%`)
                .ticks(10)
                .tickSize(-width + margin.left + margin.right)
                .tickSizeOuter(0);

            const gYAxis = lineChartSvg.append("g")
                .attr("class", "y axis")
                .attr("transform", `translate(${margin.left},0)`)
                .call(yAxis);

            Utils.appendXAxis(gXAxis, width - margin.right, -25, xAxisLabel);
            Utils.appendYAxis(gYAxis, -50, 5, yAxisLabel);
            Utils.appendTitle(lineChartSvg, width / 2, margin.top / 2, `${yAxisLabel} vs ${xAxisLabel}`);

            const tooltip = d3.tip()
                .attr("class", "d3-tip")
                .offset([-8, 0])
                .html(tooltipFormatter);

            lineChartSvg.call(tooltip);

            data.forEach((genderGroup) => {
                lineChartSvg.append("path")
                    .datum(genderGroup.values)
                    .attr("stroke-width", 3)
                    .attr("fill", "none")
                    .attr("opacity", "0.5")
                    .attr("stroke", () => colorScale(genderGroup.key))
                    .attr("d", line);
            });

            data.forEach((genderGroup, index) => {
                lineChartSvg.selectAll(".dot" + index)
                    .data(genderGroup.values)
                    .enter()
                    .append("circle")
                    .attr("class", "dot" + index)
                    .attr("cx", d => xScale(parseInt(d.key)))
                    .attr("cy", d => yScale(d.value))
                    .attr("r", 5)
                    .attr("fill", () => colorScale(genderGroup.key))
                    .on("mouseover", (d) => {
                        d3.select(this)
                            .transition()
                            .duration(100)
                            .attr('r', 10)
                            .attr('stroke-width', 3);
                        tooltip.show(d);

                    })
                    .on("mouseout", () => {
                        d3.select(this)
                            .transition()
                            .duration(100)
                            .attr('r', 5)
                            .attr('stroke-width', 1);
                        tooltip.hide();
                    });
            });

            const lineChartLegend = stackedLegend()
                .colorScale(colorScale)
                // .columns(2)
                .data(colorScale.domain());

            lineChartSvg.append("g")
                .attr("transform", `translate(${width - 150}, 5)`)
                .call(lineChartLegend);
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