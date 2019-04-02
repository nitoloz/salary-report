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
    let updateData = null;

    function chart(selection) {
        selection.each(function () {
            const barChartSvg = selection.append('svg')
                .attr('height', height)
                .attr('width', width);

            let xDomainValues = getXDomainValues(data);
            let yDomainValues = getYDomainValues(data);

            const groupsScale = d3.scaleBand()
                .rangeRound([margin.left, width - margin.right])
                .paddingInner(0.1)
                .domain(xDomainValues);

            const innerGroupScale = d3.scaleBand()
                .padding(0.05)
                .domain([...new Set(data.map(v => v.groupKey))])
                .rangeRound([0, groupsScale.bandwidth()]);

            const yScale = d3.scaleLinear()
                .domain([d3.min(yDomainValues), d3.max(yDomainValues)])
                .range([height - margin.top, margin.bottom]);

            const xAxis = d3.axisBottom(groupsScale)
                .tickFormat(d => `${d / 1000}K`)
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

            Utils.appendXAxisTitle(gXAxis, width - margin.right, -25, xAxisLabel);
            Utils.appendYAxisTitle(gYAxis, -50, 5, yAxisLabel);
            Utils.appendTitle(barChartSvg, width / 2, margin.top / 2, `${yAxisLabel} vs ${xAxisLabel}`);

            const tooltip = d3.tip()
                .attr("class", "d3-tip")
                .offset([-8, 0])
                .html(tooltipFormatter);

            barChartSvg.call(tooltip);

            barChartSvg.append("g")
                .attr('class', 'rect-group')
                .selectAll("rect")
                .data(data)
                .enter().append("rect")
                .attr("x", d => innerGroupScale(d.groupKey) + groupsScale(d.key))
                .attr("y", d => yScale(d.value))
                .attr("width", innerGroupScale.bandwidth())
                .attr("height", d => height - yScale(d.value) - margin.bottom)
                .attr("fill", d => colorScale(d.groupKey))
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

            const barChartLegend = stackedLegend()
                .colorScale(colorScale)
                // .columns(2)
                .data(colorScale.domain());

            barChartSvg.append("g")
                .attr("transform", `translate(${width - 150}, 5)`)
                .call(barChartLegend);

            updateData = function () {
                groupsScale.domain(getXDomainValues(data));
                xAxis.scale(groupsScale);

                innerGroupScale
                    .domain([...new Set(data.map(v => v.groupKey))])
                    .rangeRound([0, groupsScale.bandwidth()]);

                yDomainValues = getYDomainValues(data);
                yScale.domain([d3.min(yDomainValues), d3.max(yDomainValues)]);

                yAxis.scale(yScale);

                const t = d3.transition()
                    .duration(750);

                barChartSvg.select('.x')
                    .transition(t)
                    .call(xAxis);

                barChartSvg.select('.y')
                    .transition(t)
                    .call(yAxis);

                const updatedBars = barChartSvg.selectAll('rect').data(data);

                updatedBars
                    .enter().append("rect")
                    .attr("x", d => innerGroupScale(d.groupKey) + groupsScale(d.key))
                    .attr("y", d => yScale(d.value))
                    .attr("width", innerGroupScale.bandwidth())
                    .attr("height", d => height - yScale(d.value) - margin.bottom)
                    .attr("fill", d => colorScale(d.groupKey))
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

                updatedBars
                    .transition()
                    .ease(d3.easeLinear)
                    .duration(750)
                    .attr("x", d => innerGroupScale(d.groupKey) + groupsScale(d.key))
                    .attr("y", d => yScale(d.value))
                    .attr("width", innerGroupScale.bandwidth())
                    .attr("height", d => height - yScale(d.value) - margin.bottom)
                    .attr("fill", d => colorScale(d.groupKey));

                updatedBars.exit()
                    .transition()
                    .ease(d3.easeLinear)
                    .duration(100)
                    .remove();

                // svg.select('.title').text(`${yAxisLabel} vs ${xAxisLabel}`);
                barChartSvg.select('.x.axis.label').text(xAxisLabel);
                barChartSvg.select('.y.axis.label').text(yAxisLabel);
            };

            function getXDomainValues(data) {
                return [...new Set(data.map(v => parseInt(v.key)))].sort((a, b) => a - b);
            }

            function getYDomainValues(data) {
                return data.map(v => parseInt(v.value));
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
        data = value.map(group => group.values).flat();
        if (typeof updateData === 'function') updateData();
        return chart;
    };

    return chart;
}