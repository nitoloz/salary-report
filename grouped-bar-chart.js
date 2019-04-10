class GroupedBarChart {

    constructor() {
        this.groupedBarChart = groupedBarChartD3()
            .width(width)
            .height(height)
            .colorScale(Utils.getSexColorScaleWithoutDomain())
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
        const currentSalaryData = processLineChartData(data, CURRENT_SALARY, SEX);
        const previousSalaryData = processLineChartData(data, PREVIOUS_SALARY, SEX);

        currentSalaryData.forEach(group => {
            const groupKey = group.key.split(',')[0];
            const historicalData = previousSalaryData.find(group => group.key.indexOf(groupKey) !== -1);
            group.values.forEach(groupItem => {
                const historicalGroupItem = historicalData.values.find(historicalGroupItem => historicalGroupItem.key === groupItem.key);
                groupItem.valueDifference = historicalGroupItem ? Math.round((groupItem.value - historicalGroupItem.value) * 10) / 10 : 0;
            })
        });
        this.groupedBarChart.data(currentSalaryData)
    }
}