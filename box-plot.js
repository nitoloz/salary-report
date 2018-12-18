boxPlotInitializer = (data) => {
    const salaryBoxPlot = boxPlot();

    d3.select("#box-plot-area")
        .call(salaryBoxPlot);
};