function boxPlot() {

    let initialConfiguration = {
        width: 1000,
        height: 600,
        data: [],
        xAxisLabel: 'Total experience (Years)',
        yAxisLabel: 'Salary (EUR)',
        tooltipFormatter: (d) => {
            return `${xAxisLabel}: ${d.key}<br>
            Number of respondents: ${d.rawValues.length}<br>
            Male: ${d.maleCount}%, Female: ${d.femaleCount}%<br><br>
            95th percentile: ${d.whiskers[1]}<br>
            3rd quartile: ${d.quartile[2]}<br>
            Median: ${d.quartile[1]}<br>
            1st quartile: ${d.quartile[0]}<br>
            5th percentile: ${d.whiskers[0]}`;
        }
    };

    let width = initialConfiguration.width,
        height = initialConfiguration.height,
        data = initialConfiguration.data,
        xAxisLabel = initialConfiguration.xAxisLabel,
        yAxisLabel = initialConfiguration.yAxisLabel,
        tooltipFormatter = initialConfiguration.tooltipFormatter;
    let updateData = null;


    function chart(selection) {
        selection.each(function () {
            let xDomainValues = getXDomainValues(data);
            let yDomainValues = getYDomainValues(data);

            const xScale = d3.scaleBand()
                .domain(xDomainValues)
                .range([margin.left, width - margin.right])
                .paddingInner(0.1)
                .paddingOuter(0.1);

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
                .data(data)
                .enter()
                .append("rect")
                .attr("width", xScale.bandwidth())
                .attr("height", (datum) => yScale(datum.quartile[0]) - yScale(datum.quartile[2]))
                .attr("x", (datum) => xScale(datum.key))
                .attr("y", (datum) => yScale(datum.quartile[2]))
                .attr("fill", 'lightgrey')
                .attr("stroke", "#000")
                .attr("stroke-width", 1)
                .on('mouseover', d => tooltip.show(d))
                .on('mouseout', () => tooltip.hide());

            // Draw the whiskers at the min for this series
            boxElementsGroup.selectAll(".whiskers")
                .data(boxWhiskersCoordinates(data))
                .enter()
                .append("line")
                .attr("class", "whiskers")
                .attr("x1", d => d.x1)
                .attr("y1", d => d.y1)
                .attr("x2", d => d.x2)
                .attr("y2", d => d.y2)
                .attr("stroke", "#000")
                .attr("stroke-width", 1)
                .attr("fill", "none");

            const xAxis = d3.axisBottom(xScale)
                .tickSize(-height + margin.top + margin.bottom)
                .tickSizeOuter(0);

            const gXAxis = svg.append("g")
                .attr("class", "x axis")
                .attr("transform", `translate(0,${(height - margin.top)})`)
                .call(xAxis);

            const yAxis = d3.axisLeft(yScale)
                .tickFormat(d => `EUR ${d / 1000}K`)
                .tickSize(-width + margin.left + margin.right)
                .tickSizeOuter(0);

            const gYAxis = svg.append("g")
                .attr("class", "y axis")
                .attr("transform", `translate(${margin.left},0)`)
                .call(yAxis);

            Utils.appendXAxisTitle(gXAxis, width - margin.right, -12, xAxisLabel);
            Utils.appendYAxisTitle(gYAxis, -50, 5, yAxisLabel);
            Utils.appendTitle(svg, width / 2, margin.top / 2, `${yAxisLabel} vs ${xAxisLabel}`);


            function getXDomainValues(data) {
                return data.map(group => group.key);
            }

            function getYDomainValues(data) {
                return data.map(group => group.whiskers).flat().sort((a, b) => a - b);
            }

            function getHorizontalLineConfigs() {
                return [
                    //Line between lower whisker and box
                    {
                        x1: (datum) => xScale(datum.key) + xScale.bandwidth() / 2,
                        y1: (datum) => yScale(datum.whiskers[0]),
                        x2: (datum) => xScale(datum.key) + xScale.bandwidth() / 2,
                        y2: (datum) => yScale(datum.quartile[0])
                    },
                    //Line between upper whisker and box
                    {
                        x1: (datum) => xScale(datum.key) + xScale.bandwidth() / 2,
                        y1: (datum) => yScale(datum.quartile[2]),
                        x2: (datum) => xScale(datum.key) + xScale.bandwidth() / 2,
                        y2: (datum) => yScale(datum.whiskers[1])
                    },
                    // Top whisker
                    {
                        x1: (datum) => xScale(datum.key),
                        y1: (datum) => yScale(datum.whiskers[0]),
                        x2: (datum) => xScale(datum.key) + xScale.bandwidth(),
                        y2: (datum) => yScale(datum.whiskers[0])
                    },
                    // Median line
                    {
                        x1: (datum) => xScale(datum.key),
                        y1: (datum) => yScale(datum.quartile[1]),
                        x2: (datum) => xScale(datum.key) + xScale.bandwidth(),
                        y2: (datum) => yScale(datum.quartile[1])
                    },
                    // Bottom whisker
                    {
                        x1: (datum) => xScale(datum.key),
                        y1: (datum) => yScale(datum.whiskers[1]),
                        x2: (datum) => xScale(datum.key) + xScale.bandwidth(),
                        y2: (datum) => yScale(datum.whiskers[1])
                    }
                ];
            }

            function boxWhiskersCoordinates(boxPlotData) {
                return boxPlotData.map(box => {
                    return getHorizontalLineConfigs().map(lineConfig => {
                        return {
                            x1: lineConfig.x1(box),
                            y1: lineConfig.y1(box),
                            x2: lineConfig.x2(box),
                            y2: lineConfig.y2(box)
                        };
                    })
                }).flat();
            }

            updateData = function () {
                xScale.domain(getXDomainValues(data));
                xAxis.scale(xScale);

                yDomainValues = getYDomainValues(data);
                yScale.domain([
                    d3.min(yDomainValues),
                    d3.max(yDomainValues)
                ]);
                yAxis.scale(yScale);

                const updatedBoxes = boxElementsGroup.selectAll('rect').data(data);
                const updatedLines = boxElementsGroup.selectAll('.whiskers').data(boxWhiskersCoordinates(data));

                const t = d3.transition()
                    .duration(750);

                svg.select('.x')
                    .transition(t)
                    .call(xAxis);

                svg.select('.y')
                    .transition(t)
                    .call(yAxis);

                updatedBoxes.enter()
                    .append("rect")
                    .attr("width", xScale.bandwidth())
                    .attr("height", (datum) => yScale(datum.quartile[0]) - yScale(datum.quartile[2]))
                    .attr("x", (datum) => xScale(datum.key))
                    .attr("y", (datum) => yScale(datum.quartile[2]))
                    .attr("fill", 'lightgrey')
                    .attr("stroke", "#000")
                    .attr("stroke-width", 1)
                    .on('mouseover', d => tooltip.show(d))
                    .on('mouseout', () => tooltip.hide());

                updatedBoxes
                    .transition()
                    .ease(d3.easeLinear)
                    .duration(750)
                    .attr("width", xScale.bandwidth())
                    .attr("height", (datum) => yScale(datum.quartile[0]) - yScale(datum.quartile[2]))
                    .attr("x", (datum) => xScale(datum.key))
                    .attr("y", (datum) => yScale(datum.quartile[2]));

                updatedBoxes.exit()
                    .transition()
                    .ease(d3.easeLinear)
                    .duration(100)
                    .remove();

                updatedLines.enter()
                    .append("line")
                    .attr('class', 'whiskers')
                    .attr("x1", d => d.x1)
                    .attr("y1", d => d.y1)
                    .attr("x2", d => d.x2)
                    .attr("y2", d => d.y2)
                    .attr("stroke", "#000")
                    .attr("stroke-width", 1)
                    .attr("fill", "none");

                updatedLines
                    .transition()
                    .ease(d3.easeLinear)
                    .duration(750)
                    .attr("x1", d => d.x1)
                    .attr("y1", d => d.y1)
                    .attr("x2", d => d.x2)
                    .attr("y2", d => d.y2);

                updatedLines.exit()
                    .transition()
                    .ease(d3.easeLinear)
                    .duration(100)
                    .remove();

                svg.select('.title').text(`${yAxisLabel} vs ${xAxisLabel}`);
            };

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
        if (typeof updateData === 'function') updateData();
        return chart;
    };

    return chart;
}









