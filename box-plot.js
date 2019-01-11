boxPlotInitializer = (data) => {

    const sortByMedian = (a, b) => parseInt(a.quartile[1]) - parseInt(b.quartile[1]);

    const boxPlotExperienceData = processBoxPlotData(data, TOTAL_EXPERIENCE, CURRENT_SALARY);
    const boxPlotLanguageData = processBoxPlotData(data, WORK_LANGUAGE, CURRENT_SALARY, sortByMedian);
    const boxPlotCityData = processBoxPlotData(data, CITY, CURRENT_SALARY, sortByMedian);
    const boxPlotSexData = processBoxPlotData(data, SEX, CURRENT_SALARY, sortByMedian);
    const boxPlotSeniorityData = processBoxPlotData(data, SENIORITY_LEVEL, CURRENT_SALARY, sortByMedian);
    const boxPlotCompanySizeData = processBoxPlotData(data, COMPANY_SIZE, CURRENT_SALARY, sortByMedian);
    const boxPlotCompanyTypeData = processBoxPlotData(data, COMPANY_TYPE, CURRENT_SALARY, sortByMedian);

    const salaryBoxPlot = boxPlot()
        .width(width)
        .height(height)
        .data(boxPlotExperienceData);

    d3.select("#box-plot-area")
        .call(salaryBoxPlot);

    document.querySelector('select[id="boxPlotSelect"]').onchange = function (event) {
        switch (event.target.value) {
            case 'Experience':
                salaryBoxPlot
                    .xAxisLabel('Total experience (Years)')
                    .data(boxPlotExperienceData);
                break;
            case 'City':
                salaryBoxPlot
                    .xAxisLabel('City')
                    .data(boxPlotCityData);
                break;
            case 'Sex':
                salaryBoxPlot
                    .xAxisLabel('Sex')
                    .data(boxPlotSexData);
                break;
            case 'Seniority':
                salaryBoxPlot
                    .xAxisLabel('Seniority')
                    .data(boxPlotSeniorityData);
                break;
            case 'CompanyType':
                salaryBoxPlot
                    .xAxisLabel('Company Type')
                    .data(boxPlotCompanyTypeData);
                break;
            case 'Language':
                salaryBoxPlot
                    .xAxisLabel('Language')
                    .data(boxPlotLanguageData);
                break;
            case 'Size':
                salaryBoxPlot
                    .xAxisLabel('Size')
                    .data(boxPlotCompanySizeData);
                break;
            default:
                break;
        }
    };
};