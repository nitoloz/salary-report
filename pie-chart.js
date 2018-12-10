d3.csv('data/salaries-responses.csv')
    .then((data) => {
        data.forEach(d => d[SEX] = d[SEX] === 'M' ? 'Male' : 'Female');
        let dynamicPieChart = pieChart()
            .width(width / 1.5)
            .height(height / 1.5);

        let sexColorScale = d3.scaleOrdinal()
            .domain(["M", "F"])
            .range(["#80b1d3", "#fb8072"]);

        d3.selectAll("input")
            .on("change", function () {
                switch (this.value) {
                    case 'City':
                        dynamicPieChart
                            .groupByOptionLabel('City')
                            .colorScale(d3.scaleOrdinal(d3.schemeSet3))
                            .data(groupedDataCity);
                        break;
                    case 'Sex':
                        dynamicPieChart
                            .groupByOptionLabel('Sex')
                            .colorScale(sexColorScale)
                            .data(groupedDataSex);
                        break;
                    case 'Seniority':
                        dynamicPieChart
                            .groupByOptionLabel('Seniority')
                            .colorScale(d3.scaleOrdinal(d3.schemeSet3))
                            .data(groupedDataSeniority);
                        break;
                    default:
                        break;
                }
            });

        let groupedDataCity = processPieChartData(data, CITY);
        let groupedDataSex = processPieChartData(data, SEX);
        let groupedDataSeniority = processPieChartData(data, SENIORITY_LEVEL);

        dynamicPieChart
            .groupByOptionLabel('City')
            .colorScale(d3.scaleOrdinal(d3.schemeSet3))
            .data(groupedDataCity);

        d3.select("#pie-chart-area")
            .call(dynamicPieChart);

    });
