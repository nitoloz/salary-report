linePlotInitializer = (data) => {
    const colorScale = Utils.getSexColorScale();

    const groupedData = processLineChartData(data, CURRENT_SALARY, SEX);

    const salaryLineChart = lineChart()
        .width(width)
        .height(height)
        .colorScale(colorScale)
        .data(groupedData);

    d3.select("#line-chart-area")
        .call(salaryLineChart);
};