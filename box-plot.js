boxPlotInitializer = (data) => {

    const sortByMedian = (a, b) => parseInt(a.quartile[1]) - parseInt(b.quartile[1]);

    const xAxisOptions = [
        {
            selectLabel: 'Experience',
            axisLabel: 'Total experience (Years)',
            groupByOption: TOTAL_EXPERIENCE
        },
        {
            selectLabel: 'City',
            axisLabel: 'City',
            groupByOption: CITY
        },
        {
            selectLabel: 'Sex',
            axisLabel: 'Sex',
            groupByOption: SEX
        },
        {
            selectLabel: 'Seniority',
            axisLabel: 'Seniority Level',
            groupByOption: SENIORITY_LEVEL
        },
        {
            selectLabel: 'CompanyType',
            axisLabel: 'Company Type',
            groupByOption: COMPANY_TYPE
        },
        {
            selectLabel: 'Language',
            axisLabel: 'Language',
            groupByOption: WORK_LANGUAGE
        },
        {
            selectLabel: 'Size',
            axisLabel: 'Company Size',
            groupByOption: COMPANY_SIZE
        }
    ];

    const yAxisOptions = [
        {
            selectLabel: 'Salary',
            axisLabel: 'Salary (EUR)',
            groupByOption: CURRENT_SALARY
        },
        {
            selectLabel: 'Raise',
            axisLabel: 'Salary Raise (EUR)',
            groupByOption: SALARY_RAISE
        }
    ];

    let selectedXAxisOption = xAxisOptions[0];
    let selectedYAxisOption = yAxisOptions[0];

    const boxPlotExperienceData = processBoxPlotData(data, TOTAL_EXPERIENCE, CURRENT_SALARY);


    const salaryBoxPlot = boxPlot()
        .width(width)
        .height(height)
        .data(boxPlotExperienceData);

    d3.select("#box-plot-area")
        .call(salaryBoxPlot);

    document.querySelector('select[id="boxPlotXAxisSelect"]').onchange = function (event) {
        selectedXAxisOption = xAxisOptions.find(option => option.selectLabel === event.target.value);
        updateBoxPlot();
    };

    document.querySelector('select[id="boxPlotYAxisSelect"]').onchange = function (event) {
        selectedYAxisOption = yAxisOptions.find(option => option.selectLabel === event.target.value);
        updateBoxPlot();
    };

    function updateBoxPlot() {
        const boxPlotData = selectedXAxisOption.groupByOption === TOTAL_EXPERIENCE
            ? processBoxPlotData(data, selectedXAxisOption.groupByOption, selectedYAxisOption.groupByOption)
            : selectedXAxisOption.groupByOption === COMPANY_SIZE
                ? processBoxPlotData(data, selectedXAxisOption.groupByOption, selectedYAxisOption.groupByOption,
                    (a, b) => companySizesOrder.indexOf(a.key) - companySizesOrder.indexOf(b.key))
                : processBoxPlotData(data, selectedXAxisOption.groupByOption, selectedYAxisOption.groupByOption, sortByMedian);

        salaryBoxPlot
            .xAxisLabel(selectedXAxisOption.axisLabel)
            .yAxisLabel(selectedYAxisOption.axisLabel)
            .data(boxPlotData);
    }
};