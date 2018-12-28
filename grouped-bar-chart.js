groupedBarChartInitializer = (data) => {
    const colorScale = Utils.getSexColorScaleWithoutDomain();

    const groupedData2017 = processLineChartData(data, CURRENT_SALARY, SEX);
    const groupedData2016 = processLineChartData(data, PREVIOUS_SALARY, SEX);

    groupedData2017.forEach(group => {
        const groupKey = group.key.split(',')[0];
        const historicalData = groupedData2016.find(group => group.key.indexOf(groupKey) !== -1);
        group.values.forEach(groupItem => {
            const historicalGroupItem = historicalData.values.find(historicalGroupItem => historicalGroupItem.key === groupItem.key);
            groupItem.valueDifference = historicalGroupItem ? Math.round((groupItem.value - historicalGroupItem.value) * 10) / 10 : 0;
        })
    });

    const salaryGroupedBarChart = groupedBarChart()
        .width(width)
        .height(height)
        .colorScale(colorScale)
        .xAxisLabel('Average salary (EUR)')
        .yAxisLabel('Share of respondents (%)')
        .tooltipFormatter((d) => {
            return `Average salary (EUR): ${d.key}<br>
            Share of ${d.groupKey} respondents: ${d.value}%<br>
            Number of respondents: ${d.absoluteValue}<br>
            Yearly difference: ${d.valueDifference}%`;
        })
        .data(groupedData2017);
    // .data([...groupedData2016,...groupedData2017]);

    d3.select("#grouped-bar-chart-area")
        .call(salaryGroupedBarChart);
};