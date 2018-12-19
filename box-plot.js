boxPlotInitializer = (data) => {

    const boxPlotData = processBoxPlotData(data, TOTAL_EXPERIENCE, CURRENT_SALARY);
    const salaryBoxPlot = boxPlot()
        .width(width)
        .height(height)
        .data(boxPlotData);

    d3.select("#box-plot-area")
        .call(salaryBoxPlot);
};