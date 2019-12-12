function pieChartD3() {

    const initialConfiguration = {
        width: 1000,
        height: 600,
        data: [],
        groupByOptionLabel: 'City',
        groupByOption: DataProperties.CITY,
        valueLabel: 'Respondents',
        colorScale: d3.scaleOrdinal(d3.schemeSet3),
        id: '',
        tooltipFormatter: (data) => {
            return `<tspan x="0">${groupByOptionLabel}: ${data.data.key}</tspan>
                    <tspan x="0" dy="1.2em">${valueLabel}: ${data.data.value.value} (${data.data.value.extra.percentageValue}%)</tspan>
                    <tspan x="0" dy="1.2em">Mean salary: ${data.data.value.extra.meanSalary}</tspan>
                    <tspan x="0" dy="2em">1st quartile: ${data.data.value.extra.quartiles[0]}</tspan>
                    <tspan x="0" dy="1.2em">Median salary: ${data.data.value.extra.quartiles[1]}</tspan>
                    <tspan x="0" dy="1.2em">3rd quartile: ${data.data.value.extra.quartiles[2]}</tspan>
                    <tspan x="0" dy="1.2em">Median raise: ${data.data.value.extra.medianRaise}</tspan>`;
        },
        placeHolderTooltip: null
    };

    let width = initialConfiguration.width,
        height = initialConfiguration.height,
        data = initialConfiguration.data,
        groupByOptionLabel = initialConfiguration.groupByOptionLabel,
        groupByOption = initialConfiguration.groupByOption,
        valueLabel = initialConfiguration.valueLabel,
        colorScale = initialConfiguration.colorScale,
        placeHolderTooltip = initialConfiguration.placeHolderTooltip,
        topMargin = 110,
        tooltipFormatter = initialConfiguration.tooltipFormatter,
        id = initialConfiguration.id;

    let updateData = null;
    let previousLabelYCoordinate, previousLabelXCoordinate, labelsOverlapped;

    function chart(selection) {
        selection.each(function () {
            const svg = selection
                .append('svg')
                .attr('height', height + topMargin)
                .attr('width', width)
                .attr("id", `${id}_svg`);

            const pieChartSvg = svg
                .append("g")
                .attr("transform", `translate(${width / 2}, ${height / 2 + topMargin})`);

            const radius = Math.min(width, height) / 2;

            const arc = d3.arc()
                .innerRadius(radius * 0.5)
                .outerRadius(radius * 0.8)
                .cornerRadius(8);

            const outerArc = d3.arc()
                .outerRadius(radius * 0.8)
                .innerRadius(radius * 0.9);

            const pie = d3.pie()
                .value(d => d.value.value)
                .sort(null);

            const path = pieChartSvg
                .selectAll('path')
                .data(pie(data))
                .enter()
                .append('path')
                .attr('d', arc)
                .attr('class', 'pie-section')
                .attr('fill', (d) => colorScale(d.data.key))
                .style('stroke', 'white');

            path.call(appendTooltip);

            if (placeHolderTooltip) {
                showTooltip(placeHolderTooltip, 'white');
            }

            pieChartSvg
                .selectAll('.label')
                .data(pie(data))
                .enter()
                .append('text')
                .attr('class', 'label')
                .attr('dy', '.35em')
                .html(function (d) {
                    return `${d.data.key}: <tspan>${d.data.value.extra.percentageValue}%</tspan>`;
                })
                .attr('transform', function (d) {
                    let pos = outerArc.centroid(d);
                    pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
                    return 'translate(' + pos + ')';
                })
                .style('text-anchor', function (d) {
                    return (midAngle(d)) < Math.PI ? 'start' : 'end';
                });

            pieChartSvg
                .selectAll('polyline')
                .data(pie(data))
                .enter()
                .append('polyline')
                .attr('fill', 'none')
                .attr('stroke-width', 1)
                .attr('stroke', 'black')
                .attr('points', function (d) {
                    let pos = outerArc.centroid(d);
                    pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
                    return [arc.centroid(d), [outerArc.centroid(d)[0], pos[1]], pos]
                });
            Utils.appendSaveButtons(d3.select(`#${id}`), selection, 'pie_chart');

            updateData = function () {
                const updatedData = pie(data);
                const updatedPath = pieChartSvg.selectAll('path').data(updatedData);
                const updatedLabel = pieChartSvg.selectAll('.label').data(updatedData);
                const updatedPolylines = pieChartSvg.selectAll('polyline').data(updatedData);

                updatedPath.enter()
                    .append('path')
                    .attr('fill', (d) => colorScale(d.data.key))
                    .attr('d', arc)
                    .attr('class', 'pie-section')
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


                updatedLabel.enter()
                    .append('text')
                    .attr('class', 'label')
                    .attr('dy', '.35em')
                    .attr('transform', function (d) {
                        let pos = outerArc.centroid(d);
                        pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
                        return 'translate(' + pos + ')';
                    })
                    .html(function (d) {
                        return `${d.data.key}: <tspan>${d.data.value.extra.percentageValue}%</tspan>`;
                    })
                    .style('text-anchor', function (d) {
                        return (midAngle(d)) < Math.PI ? 'start' : 'end';
                    });

                updatedLabel
                    .transition()
                    // .ease(d3.easeLinear)
                    // .duration(750)
                    .attr('transform', function (d) {
                        let pos = outerArc.centroid(d);
                        pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
                        return 'translate(' + pos + ')';
                    })
                    .style('text-anchor', function (d) {
                        return (midAngle(d)) < Math.PI ? 'start' : 'end';
                    })
                    .style('opacity', 0)
                    .on("end", function () {
                        d3.select(this)
                            .html(function (d) {
                                return `${d.data.key}: <tspan>${d.data.value.extra.percentageValue}%</tspan>`;
                            })
                            .style('opacity', 1);
                    });

                updatedLabel.exit()
                // .transition()
                // .ease(d3.easeLinear)
                // .duration(100)
                    .remove();

                updatedPolylines.enter()
                    .append('polyline')
                    .attr('fill', 'none')
                    .attr('stroke-width', 1)
                    .attr('stroke', 'black')
                    .attr('points', function (d) {
                        let pos = outerArc.centroid(d);
                        pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
                        return [arc.centroid(d), [outerArc.centroid(d)[0], pos[1]], pos]
                    });

                updatedPolylines
                    .transition()
                    .attr('points', function (d) {
                        let pos = outerArc.centroid(d);
                        pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
                        return [arc.centroid(d), [outerArc.centroid(d)[0], pos[1]], pos]
                    });

                updatedPolylines.exit()
                // .transition()
                // .ease(d3.easeLinear)
                // .duration(100)
                    .remove();

                previousLabelXCoordinate = null;
                previousLabelYCoordinate = null;
                labelsOverlapped = false;
                pieChartSvg.selectAll('.label').attr('transform', function (d) {
                    let pos = outerArc.centroid(d);
                    pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
                    if (labelsOverlapped || previousLabelYCoordinate !== null
                        && Math.abs(previousLabelYCoordinate - pos[1]) < 17
                        && Math.abs(previousLabelXCoordinate - pos[0]) < 100) {
                        pos[1] = Math.min(pos[1], previousLabelYCoordinate - 17);
                        labelsOverlapped = true;
                    }
                    previousLabelXCoordinate = pos[0];
                    previousLabelYCoordinate = pos[1];
                    return 'translate(' + pos + ')';
                });

                previousLabelXCoordinate = null;
                previousLabelYCoordinate = null;
                labelsOverlapped = false;
                pieChartSvg.selectAll('polyline').attr('points', function (d) {
                    let pos = outerArc.centroid(d);
                    pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
                    if (labelsOverlapped || previousLabelYCoordinate !== null
                        && Math.abs(previousLabelYCoordinate - pos[1]) < 17
                        && Math.abs(previousLabelXCoordinate - pos[0]) < 100) {
                        pos[1] = Math.min(pos[1], previousLabelYCoordinate - 17);
                        labelsOverlapped = true;
                    }
                    previousLabelXCoordinate = pos[0];
                    previousLabelYCoordinate = pos[1];
                    return [arc.centroid(d), [outerArc.centroid(d)[0], pos[1]], pos]
                });

                d3.selectAll('.tooltipCircle').remove();
                if (placeHolderTooltip) {
                    showTooltip(placeHolderTooltip, 'white');
                }
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
                selection
                    .on("mouseover", (d) => {
                        d3.selectAll('.tooltipCircle').remove();
                        showTooltip(tooltipFormatter(d), colorScale(d.data.key));
                    })
                    .on("mouseout", () => {
                        d3.selectAll('.tooltipCircle').remove();
                        if (placeHolderTooltip) {
                            showTooltip(placeHolderTooltip, 'white')
                        }
                    })
                // .on("click", (d) => {
                //     showFilteredCharts(d.data.key, groupByOption)
                // });
            }

            function showTooltip(tooltipContent, color) {
                pieChartSvg.append('text')
                    .attr('class', 'tooltipCircle')
                    .attr('dy', -55)
                    .html(() => tooltipContent)
                    .style('font-size', '.9em')
                    .style('text-anchor', 'middle');

                pieChartSvg.append('circle')
                    .attr('class', 'tooltipCircle')
                    .attr('r', radius * 0.45)
                    .style('fill', color)
                    .style('fill-opacity', 0.35);
            }

            function midAngle(d) {
                return d.startAngle + (d.endAngle - d.startAngle) / 2;
            }

        })
    }

    chart.id = function (value) {
        if (!arguments.length) return id;
        id = value;
        return chart;
    };

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

    chart.groupByOption = function (value) {
        if (!arguments.length) return groupByOption;
        groupByOption = value;
        return chart;
    };

    chart.tooltipFormatter = function (value) {
        if (!arguments.length) {
            return tooltipFormatter
        } else {
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
