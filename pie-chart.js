let dynamicPieChart = pieChart()
    .width(width / 1.5)
    .height(height / 1.5);

let sexColorScale = d3.scaleOrdinal()
    .domain(["M", "F"])
    .range(["#80b1d3", "#fb8072"]);

let sexPieChartTooltipFormatter = function (data) {
    return `<tspan x="0">Sex: ${data.data.key === 'M' ? 'Male' : 'Female'}</tspan>
            <tspan x="0" dy="1.2em">Respondents: ${data.data.value}</tspan>`;
};

d3.csv('data/salaries-responses.csv')
    .then((data) => {

        d3.selectAll("input")
            .on("change", function () {
                if (this.value === 'City') {
                    dynamicPieChart
                        .groupByOptionLabel('City')
                        .valueLabel('Number of respondents')
                        .colorScale(d3.scaleOrdinal(d3.schemeSet3))
                        .data(groupedDataCity);
                } else {
                    dynamicPieChart
                        .groupByOptionLabel('Sex')
                        .valueLabel('Number of respondents')
                        .colorScale(sexColorScale)
                        .tooltipFormatter(sexPieChartTooltipFormatter)
                        .data(groupedDataSex);
                }
            });

        data = data.filter(d => d[CITY] !== '');

        let groupedDataCity = d3.nest()
            .key(d => d[CITY])
            .rollup(d => d.length)
            .entries(data);

        let groupedDataSex = d3.nest()
            .key(d => d[SEX])
            .rollup(d => d.length)
            .entries(data);

        dynamicPieChart
            .groupByOptionLabel('City')
            .valueLabel('Number of respondents')
            .colorScale(d3.scaleOrdinal(d3.schemeSet3))
            .data(groupedDataCity);

        d3.select("#pie-chart-area")
            .call(dynamicPieChart);

    });

function pieChart() {
    let width = 1000,
        height = 600,
        data = [],
        groupByOptionLabel = 'City',
        valueLabel = 'Number of respondents',
        colorScale = d3.scaleOrdinal(d3.schemeSet3),
        tooltipFormatter = (data) => {
            return `<tspan x="0">${groupByOptionLabel}: ${data.data.key}</tspan>
            <tspan x="0" dy="1.2em">Respondents: ${data.data.value}</tspan>`;
        };

    function chart(selection) {
        selection.each(function () {
            let pieChartSvg = selection
                .append('svg')
                .attr('height', height)
                .attr('width', width)
                .append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

            let radius = Math.min(width, height) / 2;

            let arc = d3.arc()
                .innerRadius(radius * 0.5)
                .outerRadius(radius * 0.9)
                .cornerRadius(8);

            let pie = d3.pie()
                .value(d => d.value)
                .sort((a, b) => a.value - b.value);

            let path = pieChartSvg.datum(data)
                .selectAll('path')
                .data(pie)
                .enter()
                .append('path')
                .attr('d', arc)
                .attr('fill', (d, i) => colorScale(d.data.key))
                .style('stroke', 'white')

            path.call(appendTooltip);

            updateData = function () {

                let updatedPath = pieChartSvg.selectAll('path');
                let updatedData = pie(data);

                updatedPath = updatedPath.data(updatedData);

                updatedPath.enter()
                    .append('path')
                    .attr('fill', (d, i) => colorScale(d.data.key))
                    .attr('d', arc)
                    .call(appendTooltip);

                updatedPath
                    .transition()
                    .ease(d3.easeLinear)
                    .duration(750)
                    .attr('fill', (d, i) => colorScale(d.data.key))
                    .attrTween('d', arcTween);

                updatedPath.exit()
                // .transition()
                // .ease(d3.easeLinear)
                // .duration(5000)
                // .attrTween("d", arcTween)
                    .remove();
            };

            function arcTween(d) {
                let i = d3.interpolate(d.startAngle + 0.1, d.endAngle);
                return function (t) {
                    d.endAngle = i(t);
                    return arc(d)
                }
            }

            function appendTooltip(selection) {
                selection.on("mouseover", function (d, i) {
                    pieChartSvg.append('text')
                        .attr('class', 'tooltipCircle')
                        .attr('dy', -15)
                        .html(function () {
                            return tooltipFormatter(d);
                        })
                        .style('font-size', '.9em')
                        .style('text-anchor', 'middle'); // centres text in tooltip

                    pieChartSvg.append('circle')
                        .attr('class', 'tooltipCircle')
                        .attr('r', radius * 0.45) // radius of tooltip circle
                        .style('fill', colorScale(d.data.key)) // colour based on category mouse is over
                        .style('fill-opacity', 0.35);
                }).on("mouseout", function () {
                    d3.selectAll('.tooltipCircle').remove();
                });
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

    chart.tooltipFormatter = function (value) {
        if (!arguments.length) return tooltipFormatter;
        tooltipFormatter = value;
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
