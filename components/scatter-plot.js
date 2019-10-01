class ScatterChart {

    constructor() {
        this.salaryScatterChart = scatterPlotD3()
            .width(Utils.getChartContainerDimensions().width)
            .height(Utils.getChartContainerDimensions().height)
            .id('scatter-chart-area')
            .colorScale(Utils.getSexColorScale());

        d3.select("#scatter-chart-area")
            .call(this.salaryScatterChart);
    }

    updateData(data) {
        this.salaryScatterChart
            .xAxisProperty(DataProperties.TOTAL_EXPERIENCE)
            .yAxisProperty(DataProperties.CURRENT_SALARY)
            .trellisingProperty(DataProperties.SEX)
            .data(data);
    }

}