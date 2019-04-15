class ScatterChart {

    constructor() {
        this.salaryScatterChart = scatterPlotD3()
            .width(width)
            .height(height)
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