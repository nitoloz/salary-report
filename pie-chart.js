
d3.csv('data/salaries-responses.csv')
    .then((data) => {
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

        d3.selectAll("input")
            .on("change", function () {
                if (this.value === 'City') {
                    dynamicPieChart
                        .groupByOptionLabel('City')
                        .tooltipFormatter(null)
                        .colorScale(d3.scaleOrdinal(d3.schemeSet3))
                        .data(groupedDataCity);
                } else {
                    dynamicPieChart
                        .groupByOptionLabel('Sex')
                        .colorScale(sexColorScale)
                        .tooltipFormatter(sexPieChartTooltipFormatter)
                        .data(groupedDataSex);
                }
            });

        let groupedDataCity = processPieChartData(data, CITY);
        let groupedDataSex = processPieChartData(data, SEX);

        dynamicPieChart
            .groupByOptionLabel('City')
            .colorScale(d3.scaleOrdinal(d3.schemeSet3))
            .data(groupedDataCity);

        d3.select("#pie-chart-area")
            .call(dynamicPieChart);

    });
