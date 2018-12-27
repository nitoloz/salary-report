function groupedBarChart() {

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
            const barChartSvg = selection.append('svg')
                .attr('height', height)
                .attr('width', width);

            const xDomainValues = [...new Set(data.map(group => group.values.map(v => parseInt(v.key))).flat())]
            const yDomainValues = data.map(group => group.values.map(v => parseInt(v.value))).flat();

            const groupsScale = d3.scaleBand()
                .rangeRound([margin.left, width - margin.right])
                .paddingInner(0.1)
                .domain(xDomainValues);

            const innerGroupScale = d3.scaleBand()
                .padding(0.05)
                .domain(data.map(group => group.key))
                .rangeRound([0, groupsScale.bandwidth()]);

            const yScale = d3.scaleLinear()
                .domain([d3.min(yDomainValues), d3.max(yDomainValues)])
                .range([height - margin.top, margin.bottom]);

            const xAxis = d3.axisBottom(groupsScale)
                .tickFormat(d => `${d / 1000} K`)
                .tickSizeOuter(0);

            const gXAxis = barChartSvg.append("g")
                .attr("class", "x axis")
                .attr("transform", `translate(0,${(height - margin.top)})`)
                .call(xAxis);

            const yAxis = d3.axisLeft(yScale)
                .tickFormat(d => `${d}%`)
                .ticks(10)
                .tickSize(-width + margin.left + margin.right)
                .tickSizeOuter(0);

            const gYAxis = barChartSvg.append("g")
                .attr("class", "y axis")
                .attr("transform", `translate(${margin.left},0)`)
                .call(yAxis);

            Utils.appendXAxis(gXAxis, width - margin.right, -25, xAxisLabel);
            Utils.appendYAxis(gYAxis, -50, 5, yAxisLabel);
            Utils.appendTitle(barChartSvg, width / 2, margin.top / 2, `${yAxisLabel} vs ${xAxisLabel}`);

            barChartSvg.append("g")
                .selectAll("g")
                .data(data)
                .enter()
                .selectAll("rect")
                .data(function (d) {
                    return d.values;
                })
                .enter().append("rect")
                .attr("x", function (d) {
                    return innerGroupScale(d.groupKey) + groupsScale(d.key);
                })
                .attr("y", function (d) {
                    return yScale(d.value);
                })
                .attr("width", innerGroupScale.bandwidth())
                .attr("height", function (d) {
                    return height - yScale(d.value) - margin.bottom;
                })
                .attr("fill", function (d) {
                    return colorScale(d.groupKey);
                });

            const lineChartLegend = stackedLegend()
                .colorScale(colorScale)
                // .columns(2)
                .data(colorScale.domain());

            barChartSvg.append("g")
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