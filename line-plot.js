linePlotInitializer = (data) => {
    const colorScale = Utils.getSexColorScaleWithoutDomain();

    const groupedData2017 = processLineChartData(data, CURRENT_SALARY, SEX);
    // const groupedData2016 = processLineChartData(data, PREVIOUS_SALARY, SEX);

    const salaryLineChart = lineChart()
        .width(width)
        .height(height)
        .colorScale(colorScale)
        .xAxisLabel('Average salary (EUR)')
        .yAxisLabel('Share of respondents (%)')
        .tooltipFormatter((d) => {
            return `Average salary (EUR): ${d.key}<br>
            Share of respondents: ${d.value}%<br>
            Number of respondents: ${d.absoluteValue}`;
        })
        .data(groupedData2017);
    // .data([...groupedData2017,...groupedData2016]);

    d3.select("#line-chart-area")
        .call(salaryLineChart);
};