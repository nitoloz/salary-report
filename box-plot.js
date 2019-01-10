boxPlotInitializer = (data) => {

    const boxPlotExperienceData = processBoxPlotData(data, TOTAL_EXPERIENCE, CURRENT_SALARY);
    const boxPlotAgeData = processBoxPlotData(data, WORK_LANGUAGE, CURRENT_SALARY);
    const salaryBoxPlot = boxPlot()
        .width(width)
        .height(height)
        .data(boxPlotExperienceData);

    d3.select("#box-plot-area")
        .call(salaryBoxPlot);
};