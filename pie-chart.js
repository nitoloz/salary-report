let cityPieChart = pieChart()
    .width(width / 1.5)
    .height(height / 1.5)
    .groupByOption(CITY)
    .groupByOptionLabel('City')
    .valueLabel('Number of respondents');

let sexColorScale = d3.scaleOrdinal()
    .domain(["M", "F"])
    .range(["#80b1d3", "#fb8072"]);

let sexPieChartTooltipFormatter = function (data) {
    return `<tspan x="0">Sex: ${data.data.key === 'M' ? 'Male' : 'Female'}</tspan>
            <tspan x="0" dy="1.2em">Respondents: ${data.data.value}</tspan>`;
};

let sexPieChart = pieChart()
    .width(width / 1.5)
    .height(height / 1.5)
    .groupByOption(SEX)
    .groupByOptionLabel('Sex')
    .valueLabel('Number of respondents')
    .colorScale(sexColorScale)
    .tooltipFormatter(sexPieChartTooltipFormatter);

d3.csv('data/salaries-responses.csv')
    .then((data) => {
        d3.select("#city-pie-chart-area")
            .datum(data)
            .call(cityPieChart);

        d3.select("#sex-pie-chart-area")
            .datum(data)
            .call(sexPieChart);
    });

function pieChart() {
    let width = 1000,
        height = 600,
        groupByOption = CITY,
        groupByOptionLabel = 'City',
        valueLabel = 'Number of respondents',
        colorScale = d3.scaleOrdinal(d3.schemePastel2),
        tooltipFormatter = (data) => {
            return `<tspan x="0">${groupByOptionLabel}: ${data.data.key}</tspan>
            <tspan x="0" dy="1.2em">Respondents: ${data.data.value}</tspan>`;
        };

    function chart(selection) {
        selection.each(function (data) {
            let pieChartSvg = selection
                .append('svg')
                .attr('height', height)
                .attr('width', width)
                .append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

            data = data.filter(d => d[groupByOption] !== '');

            let groupedData = d3.nest()
                .key((d) => {
                    return d[groupByOption];
                })
                .rollup((d) => {
                    return d.length;
                })
                .entries(data);

            let radius = Math.min(width, height) / 2;

            let arc = d3.arc()
                .innerRadius(radius * 0.5)
                .outerRadius(radius * 0.9)
                .cornerRadius(8);

            let pie = d3.pie()
                .value(function (d) {
                    return d.value;
                })
                .sort((a, b) => {
                    return a.value - b.value;
                });

            let path = pieChartSvg.datum(groupedData)
                .selectAll('path')
                .data(pie)
                .enter()
                .append("g")
                .append('path')
                .attr('d', arc)
                .attr('fill', (d, i) => colorScale(i))
                .style('stroke', 'white');

            path.on("mouseover", function (d, i) {
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
                    .style('fill', colorScale(i)) // colour based on category mouse is over
                    .style('fill-opacity', 0.35);
            })
                .on("mouseout", function () {
                    d3.selectAll('.tooltipCircle').remove();
                });
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

    chart.groupByOption = function (value) {
        if (!arguments.length) return groupByOption;
        groupByOption = value;
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

    return chart;
}
