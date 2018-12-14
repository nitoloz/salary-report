d3.csv('data/salaries-responses.csv')
    .then((data) => {
        data.forEach(d => {
            d[SEX] = d[SEX] === 'M' ? 'Male' : 'Female';
        });

        const colorScale = d3.scaleOrdinal()
            .domain(["Male", "Female"])
            .range(["#80b1d3", "#fb8072"]);

        const groupedData = processLineChartData(data, CURRENT_SALARY, SEX);

        const salaryLineChart = lineChart()
            .width(width)
            .height(height)
            .colorScale(colorScale)
            .data(groupedData);

        d3.select("#line-chart-area")
            .call(salaryLineChart);
    });


