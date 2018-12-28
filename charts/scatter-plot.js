function scatterPlot() {

    let initialConfiguration = {
        width: 1000,
        height: 600,
        data: [],
        xAxisProperty: TOTAL_EXPERIENCE,
        yAxisProperty: CURRENT_SALARY,
        trellisingProperty: SEX,
        xAxisLabel: 'Total experience (Years)',
        yAxisLabel: 'Salary (EUR)',
        colorScale: d3.scaleOrdinal(d3.schemeSet3),
        tooltipFormatter: (d) => {
            return `Position: ${d[POSITION]}<br>
            Salary ${selectedYear}: ${d[CURRENT_SALARY]}<br>
            Salary Previous Year: ${d[PREVIOUS_SALARY]}<br>
            Age: ${d[AGE] || 'no data'} <br>
            Sex: ${d[SEX] || 'no data'} <br>
            City: ${d[CITY] || 'no data'} <br>
            Total Experience: ${d[TOTAL_EXPERIENCE]}<br>
            First EU Salary: ${d[FIRST_EUROPE_SALARY]}<br> 
            Work Language: ${d[WORK_LANGUAGE]}<br> 
            Company Size: ${d[COMPANY_SIZE]}`;
        }
    };

    let width = initialConfiguration.width,
        height = initialConfiguration.height,
        data = initialConfiguration.data,
        xAxisLabel = initialConfiguration.xAxisLabel,
        yAxisLabel = initialConfiguration.yAxisLabel,
        xAxisProperty = initialConfiguration.xAxisProperty,
        yAxisProperty = initialConfiguration.yAxisProperty,
        trellisingProperty = initialConfiguration.trellisingProperty,
        colorScale = initialConfiguration.colorScale,
        tooltipFormatter = initialConfiguration.tooltipFormatter;

    function chart(selection) {
        selection.each(function () {
            data = data.filter(d => parseInt(d[yAxisProperty]) > 0 && parseInt(d[xAxisProperty]) > 0);
            const yAxisValues = data.map(d => parseInt(d[yAxisProperty]));
            const xAxisValues = data.map(d => parseInt(d[xAxisProperty]));

            const xScale = d3.scaleLinear()
                .domain([
                    d3.min([0, d3.min(xAxisValues)]),
                    d3.max([0, d3.max(xAxisValues)])
                ]).range([margin.left, width - margin.right]);

            const yScale = d3.scaleLinear()
                .domain([
                    d3.min([d3.min(yAxisValues)]),
                    d3.max([d3.max(yAxisValues)])
                ])
                .range([height - margin.bottom, margin.top]);

            const svg = selection.append('svg')
                .attr('height', height)
                .attr('width', width)
                .append("g");

            //Clippath in order to prevent points from being visible outside of chart area
            //https://developer.mozilla.org/ru/docs/Web/CSS/clip-path
            svg.append("defs").append("clipPath")
                .attr("id", "clip")
                .append("rect")
                .attr("width", width - margin.left - margin.right)
                .attr("height", height - margin.top - margin.bottom)
                .attr('transform', `translate(${margin.left},${margin.top})`);

            const xAxis = d3.axisBottom(xScale)
                .tickSize(-height + margin.top + margin.bottom)
                .tickSizeOuter(0);

            const gXAxis = svg.append("g")
                .attr("class", "x axis")
                .attr("transform", `translate(0,${(height - margin.top)})`)
                .call(xAxis);


            const yAxis = d3.axisLeft(yScale)
                .tickFormat((d) => `EUR ${d / 1000}K`)
                .tickSize(-width + margin.left + margin.right)
                .tickSizeOuter(0);

            const gYAxis = svg.append("g")
                .attr("class", "y axis")
                .attr("transform", `translate(${margin.left},0)`)
                .call(yAxis);

            Utils.appendXAxis(gXAxis, width - margin.right, -12, xAxisLabel);
            Utils.appendYAxis(gYAxis, -50, 5, yAxisLabel);
            Utils.appendTitle(svg, width / 2, margin.top / 2, `${yAxisLabel} vs ${xAxisLabel}`);

            //Zoom setup
            const zoom = d3.zoom()
                .scaleExtent([1 / 2, 7])
                .extent([[0, 0], [width, height]])
                .filter(function () {
                    return d3.event.type === 'touchstart'
                        ? false : d3.event.type === 'wheel'
                            ? d3.event.ctrlKey : true;
                })
                .on("zoom", zoomed);

            function zoomed() {
                let newXScale = d3.event.transform.rescaleX(xScale);
                let newYScale = d3.event.transform.rescaleY(yScale);
                gXAxis.call(xAxis.scale(newXScale));
                gYAxis.call(yAxis.scale(newYScale));
                circles.data(data)
                    .attr('cx', d => newXScale(parseInt(d[xAxisProperty])))
                    .attr('cy', d => newYScale(parseInt(d[yAxisProperty])));
            }

            svg.append("rect")
                .attr("width", width - margin.left - margin.right)
                .attr("height", height - margin.top - margin.bottom)
                .style("fill", "none")
                .style("pointer-events", "all")
                .attr('transform', `translate(${margin.left},${margin.top})`)
                .call(zoom);

            const tooltip = d3.tip()
                .attr("class", "d3-tip")
                .offset([-8, 0])
                .html(tooltipFormatter);

            svg.call(tooltip);

            const circlesG = svg.append("g")
                .attr("clip-path", "url(#clip)");

            const circles = circlesG.selectAll('circle')
                .data(data)
                .enter()
                .append('circle')
                .attr('cx', d => xScale(parseInt(d[xAxisProperty])))
                .attr('cy', d => yScale(parseInt(d[yAxisProperty])))
                .attr('r', '5')
                .attr('stroke', 'grey')
                .attr('stroke-width', 1)
                .attr('fill', d => colorScale(d[trellisingProperty]))
                .on('mouseover', (d) => {
                    d3.select(this)
                        .transition()
                        .duration(100)
                        .attr('r', 10)
                        .attr('stroke-width', 3);
                    tooltip.show(d);
                })
                .on('mouseout', () => {
                    d3.select(this)
                        .transition()
                        .duration(100)
                        .attr('r', 5)
                        .attr('stroke-width', 1);
                    tooltip.hide();
                });

            const scatterPlotLegend = stackedLegend()
                .colorScale(colorScale)
                .data(colorScale.domain());

            svg.append("g")
                .attr("transform", `translate(${width - 120}, 0)`)
                .call(scatterPlotLegend);
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