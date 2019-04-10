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
        this.salaryScatterChart.data(data);
    }

}