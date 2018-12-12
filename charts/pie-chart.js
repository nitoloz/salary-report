function pieChart() {

    const initialConfiguration = {
        width: 1000,
        height: 600,
        data: [],
        groupByOptionLabel: 'City',
        valueLabel: 'Respondents',
        colorScale: d3.scaleOrdinal(d3.schemeSet3),
        tooltipFormatter: (data) => {
            return `<tspan x="0">${groupByOptionLabel}: ${data.data.key}</tspan>
                    <tspan x="0" dy="1.2em">${valueLabel}: ${data.data.value.value} (${data.data.value.extra.percentageValue}%)</tspan>
                    <tspan x="0" dy="1.2em">Mean salary: ${data.data.value.extra.meanSalary}</tspan>
                    <tspan x="0" dy="1.2em">Median salary: ${data.data.value.extra.medianSalary}</tspan>`;
        },
        placeHolderTooltip: null
    };

    let width = initialConfiguration.width,
        height = initialConfiguration.height,
        data = initialConfiguration.data,
        groupByOptionLabel = initialConfiguration.groupByOptionLabel,
        valueLabel = initialConfiguration.valueLabel,
        colorScale = initialConfiguration.colorScale,
        placeHolderTooltip = initialConfiguration.placeHolderTooltip,
        tooltipFormatter = initialConfiguration.tooltipFormatter;

    function chart(selection) {
        selection.each(function () {
            const svg = selection
                .append('svg')
                .attr('height', height)
                .attr('width', width);

            const pieChartSvg = svg
                .append("g")
                .attr("transform", `translate(${width / 2}, ${height / 2})`);

            const radius = Math.min(width, height) / 2;

            const arc = d3.arc()
                .innerRadius(radius * 0.5)
                .outerRadius(radius * 0.9)
                .cornerRadius(8);

            const pie = d3.pie()
                .value(d => d.value.value)
                .sort(null);

            const path = pieChartSvg.datum(data)
                .selectAll('path')
                .data(pie)
                .enter()
                .append('path')
                .attr('d', arc)
                .attr('fill', (d) => colorScale(d.data.key))
                .style('stroke', 'white');

            path.call(appendTooltip);

            const legend = stackedLegend()
                .colorScale(colorScale)
                .data(data.map(d => d.key));

            svg.append("g")
                .attr("transform", `translate(${width / 2 + radius}, ${50})`)
                .call(legend);

            if (placeHolderTooltip) {
                showTooltip(placeHolderTooltip, 'white');
            }

            updateData = function () {
                const updatedData = pie(data);
                const updatedPath = pieChartSvg.selectAll('path').data(updatedData);

                updatedPath.enter()
                    .append('path')
                    .attr('fill', (d) => colorScale(d.data.key))
                    .attr('d', arc)
                    .call(appendTooltip);

                updatedPath
                    .transition()
                    .ease(d3.easeLinear)
                    .duration(750)
                    .attr('fill', (d) => colorScale(d.data.key))
                    .attrTween('d', enterArcTween);

                updatedPath.exit()
                    .transition()
                    .ease(d3.easeLinear)
                    .duration(100)
                    .attrTween("d", exitArcTween)
                    .remove();

                legend
                    .colorScale(colorScale)
                    .data(data.map(d => d.key));
            };

            function enterArcTween(d) {
                const i = d3.interpolate(d.startAngle + 0.1, d.endAngle);
                return function (t) {
                    d.endAngle = i(t);
                    return arc(d)
                }
            }

            function exitArcTween(d) {
                const i = d3.interpolate(d.startAngle, d.endAngle);
                return function (t) {
                    d.startAngle = i(t);
                    return arc(d)
                }
            }

            function appendTooltip(selection) {
                selection.on("mouseover", function (d) {
                    d3.selectAll('.tooltipCircle').remove();
                    showTooltip(tooltipFormatter(d), colorScale(d.data.key));
                }).on("mouseout", function () {
                    d3.selectAll('.tooltipCircle').remove();
                    if (placeHolderTooltip) {
                        showTooltip(placeHolderTooltip, 'white')
                    }
                });
            }

            function showTooltip(tooltipContent, color) {
                pieChartSvg.append('text')
                    .attr('class', 'tooltipCircle')
                    .attr('dy', -25)
                    .html(() => tooltipContent)
                    .style('font-size', '.9em')
                    .style('text-anchor', 'middle');

                pieChartSvg.append('circle')
                    .attr('class', 'tooltipCircle')
                    .attr('r', radius * 0.45)
                    .style('fill', color)
                    .style('fill-opacity', 0.35);
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

    chart.groupByOptionLabel = function (value) {
        if (!arguments.length) return groupByOptionLabel;
        groupByOptionLabel = value;
        return chart;
    };

    chart.valueLabel = function (value) {
        if (!arguments.length) return valueLabel;
        valueLabel = value;
        return chart;
    };

    chart.colorScale = function (value) {
        if (!arguments.length) return colorScale;
        colorScale = value;
        return chart;
    };

    chart.placeHolderTooltip = function (value) {
        if (!arguments.length) return placeHolderTooltip;
        placeHolderTooltip = value;
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
        //TODO fix domain reinitialization after 1st data replacement
        if (chart.colorScale().domain().length === 0) {
            chart.colorScale().domain(data.map(d => d.key));
        }
        if (typeof updateData === 'function') updateData();
        return chart;
    };

    return chart;
}
