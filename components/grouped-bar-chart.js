class GroupedBarChart {

    constructor() {
        this.groupedBarChart = groupedBarChartD3()
            .width(Utils.getChartContainerDimensions().width)
            .height(Utils.getChartContainerDimensions().height)
            .id('grouped-bar-chart-area')
            .colorScale(Utils.getSexColorScale())
            .xAxisLabel('Average salary (EUR)')
            .yAxisLabel('Share of respondents (%)')
            .tooltipFormatter((d) => {
                return `Average salary (EUR): ${d.key}<br>
                        Share of ${d.groupKey} respondents: ${d.value}%<br>
                        Number of respondents: ${d.absoluteValue}<br>
                        Yearly difference: ${d.valueDifference}%`;
            });

        d3.select("#grouped-bar-chart-area")
            .call(this.groupedBarChart);
    }

    updateData(data) {
        const currentSalaryData = processLineChartData(data, DataProperties.CURRENT_SALARY, DataProperties.SEX);
        const previousSalaryData = processLineChartData(data, DataProperties.PREVIOUS_SALARY, DataProperties.SEX);

        currentSalaryData.forEach(group => {
            const groupKey = group.key.split(',')[0];
            const historicalData = previousSalaryData.find(group => group.key.indexOf(groupKey) !== -1);
            if (historicalData) {
                group.values.forEach(groupItem => {
                    const historicalGroupItem = historicalData.values.find(historicalGroupItem => historicalGroupItem.key === groupItem.key);
                    groupItem.valueDifference = historicalGroupItem ? Math.round((groupItem.value - historicalGroupItem.value) * 10) / 10 : 0;
                })
            }
        });
        this.groupedBarChart
            .colorScale(Utils.getSexColorScale())
            .data(currentSalaryData)
    }
}