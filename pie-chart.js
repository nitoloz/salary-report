let cityPieChart = pieChart()
    .width(width / 1.5)
    .height(height / 1.5)
    .groupByOption(CITY);

d3.csv('data/salaries-responses.csv')
    .then((data) => {
        d3.select("#city-pie-chart-area")
            .datum(data)
            .call(cityPieChart);
    });

function pieChart() {
    let width = 1000,
        height = 600,
        groupByOption = CITY;

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
            let color = d3.scaleOrdinal(d3.schemePastel2);

            let arc = d3.arc()
                .innerRadius(0.5 * radius)
                .outerRadius(radius)
                .cornerRadius(8);
            // .padAngle(0.01);

            let pie = d3.pie()
                .value(function (d) {
                    return d.value;
                })
                .sort((a, b) => {
                    return a.value - b.value;
                });

            let tooltip = d3.tip()
                .attr("class", "d3-tip")
                // .offset([-8, 0])
                .html(function (d) {
                    return `City: ${d.key}<br>
                    Number of respondents: ${d.value}`
                });

            linePlotSvg.call(tooltip);

            let path = pieChartSvg.selectAll('path')
                .data(pie(groupedData))
                .enter()
                .append("g")
                .append('path')
                .attr('d', arc)
                .attr('fill', (d, i) => color(i))
                .style('stroke', 'white')
                .on("mouseover", function (d) {
                    // d3.select(this)
                    //     .transition()
                    //     .duration(100)
                    //     .attr('r', 10)
                    //     .attr('stroke-width', 3);
                    tooltip.show(d.data);
                })
                .on("mouseout", function () {
                    // d3.select(this)
                    //     .transition()
                    //     .duration(100)
                    //     .attr('r', 5)
                    //     .attr('stroke-width', 1);
                    tooltip.hide();
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

    return chart;
}
