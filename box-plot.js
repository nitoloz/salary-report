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
            axisLabel: 'Total experience (Years)',
            groupByOption: CITY
        },
        {
            selectLabel: 'Sex',
            axisLabel: 'Total experience (Years)',
            groupByOption: SEX
        },
        {
            selectLabel: 'Seniority',
            axisLabel: 'Total experience (Years)',
            groupByOption: SENIORITY_LEVEL
        },
        {
            selectLabel: 'CompanyType',
            axisLabel: 'Total experience (Years)',
            groupByOption: COMPANY_TYPE
        },
        {
            selectLabel: 'Language',
            axisLabel: 'Total experience (Years)',
            groupByOption: WORK_LANGUAGE
        },
        {
            selectLabel: 'Size',
            axisLabel: 'Total experience (Years)',
            groupByOption: COMPANY_SIZE
        }
    ];

    let selectedXAxisOption = xAxisOptions[0];
    let selectedYAxisOption = CURRENT_SALARY;

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

    function updateBoxPlot() {
        const boxPlotData = selectedXAxisOption.groupByOption === TOTAL_EXPERIENCE
        ? processBoxPlotData(data, selectedXAxisOption.groupByOption, selectedYAxisOption)
        : processBoxPlotData(data, selectedXAxisOption.groupByOption, selectedYAxisOption, sortByMedian);
        salaryBoxPlot
            .xAxisLabel(selectedXAxisOption.axisLabel)
            .data(boxPlotData);
    }
};