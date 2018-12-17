scatterChartInitializer = (data) => {

    const colorScale = Utils.getSexColorScale();

    const salaryScatterChart = scatterPlot()
        .width(width)
        .height(height)
        .colorScale(colorScale)
        .data(data);

    d3.select("#scatter-chart-area")
        .call(salaryScatterChart);
};


