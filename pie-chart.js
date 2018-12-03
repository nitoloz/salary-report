let pieChartHeight = height / 1.5;
let pieChartWidth = width / 1.5;

let pieChartSvg = d3.select("#pie-chart-area")
    .append('svg')
    .attr('height', pieChartHeight)
    .attr('width', pieChartWidth)
    .append("g")
    .attr("transform", "translate(" + pieChartWidth / 2 + "," + pieChartHeight / 2 + ")");

d3.csv('data/salaries-responses.csv')
    .then((data) => {
        const groupByOption = CITY;

        data = data.filter(d => d[groupByOption] !== '');

        let groupedData = d3.nest()
            .key((d) => {
                return d[groupByOption];
            })
            .rollup((d) => {
                return d.length;
            })
            .entries(data);

        let radius = Math.min(pieChartWidth, pieChartHeight) / 2;
        let color = d3.scaleOrdinal(d3.schemePastel2);

        let arc = d3.arc()
            .innerRadius(0.5 * radius)
            .outerRadius(radius)
            .cornerRadius(8);

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

    });