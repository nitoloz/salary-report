pieChartInitializer = (data) => {

    const salariesValues = data.map(response => response[CURRENT_SALARY]).sort((a, b) => a - b);
    const meanSalary = Math.round(d3.mean(salariesValues) / 1000) * 1000;

    const raisesValues = data.filter(response => response[CURRENT_SALARY] >= 0 && response[PREVIOUS_SALARY] >= 0)
        .map(response => response[CURRENT_SALARY] - response[PREVIOUS_SALARY]).sort((a, b) => a - b);
    const medianRaise = Math.round(d3.median(raisesValues) / 100) * 100;

    const quartiles = [
        d3.quantile(salariesValues, .25),
        d3.quantile(salariesValues, .5),
        d3.quantile(salariesValues, .75)
    ];

    const placeHolderTooltip = `<tspan x="0">December ${selectedYear}</tspan>
                                <tspan x="0" dy="1.2em">Total respondents: ${data.length}</tspan>
                                <tspan x="0" dy="1.2em">Mean salary: ${meanSalary}</tspan>
                                <tspan x="0" dy="2em">1st quartile: ${quartiles[0]}</tspan>
                                <tspan x="0" dy="1.2em">Median salary: ${quartiles[1]}</tspan>
                                <tspan x="0" dy="1.2em">3rd quartile: ${quartiles[2]}</tspan>
                                <tspan x="0" dy="1.2em">Median raise: ${medianRaise}</tspan>`;

    const dynamicPieChart = pieChartD3()
        .width(width / 1.2)
        .height(height / 1.2)
        .placeHolderTooltip(placeHolderTooltip);

    const sexColorScale = Utils.getSexColorScale();

    document.querySelector('select[id="pieChartSelect"]').onchange = function (event) {
        switch (event.target.value) {
            case 'City':
                dynamicPieChart
                    .groupByOptionLabel('City')
                    .groupByOption(CITY)
                    .colorScale(d3.scaleOrdinal(d3.schemeSet3))
                    .data(dataGroupedByCity);
                break;
            case 'Sex':
                dynamicPieChart
                    .groupByOptionLabel('Sex')
                    .groupByOption(SEX)
                    .colorScale(sexColorScale)
                    .data(dataGroupedBySex);
                break;
            case 'Seniority':
                dynamicPieChart
                    .groupByOptionLabel('Seniority')
                    .groupByOption(SENIORITY_LEVEL)
                    .colorScale(d3.scaleOrdinal(d3.schemeSet3))
                    .data(dataGroupedBySeniority);
                break;
            case 'CompanyType':
                dynamicPieChart
                    .groupByOptionLabel('Type')
                    .groupByOption(COMPANY_TYPE)
                    .colorScale(d3.scaleOrdinal(d3.schemeSet3))
                    .data(dataGroupedByCompanyType);
                break;
            case 'Language':
                dynamicPieChart
                    .groupByOptionLabel('Language')
                    .groupByOption(WORK_LANGUAGE)
                    .colorScale(d3.scaleOrdinal(d3.schemeSet3))
                    .data(dataGroupedByLanguage);
                break;
            case 'Size':
                dynamicPieChart
                    .groupByOptionLabel('Size')
                    .groupByOption(COMPANY_SIZE)
                    .colorScale(d3.scaleOrdinal(d3.schemeSet3))
                    .data(dataGroupedByCompanySize);
                break;
            default:
                break;
        }
    };

    const dataGroupedByCity = processPieChartData(data, CITY);
    const dataGroupedBySex = processPieChartData(data, SEX);
    const dataGroupedBySeniority = processPieChartData(data, SENIORITY_LEVEL);
    const dataGroupedByCompanyType = processPieChartData(data, COMPANY_TYPE);
    const dataGroupedByLanguage = processPieChartData(data, WORK_LANGUAGE);
    // const dataGroupedByJobNumber = processPieChartData(data, EUROPE_JOB_COUNT);

    const dataGroupedByCompanySize = processPieChartData(data, COMPANY_SIZE, (a, b) => {
        return companySizesOrder.indexOf(a.key) - companySizesOrder.indexOf(b.key)
    });

    dynamicPieChart
        .groupByOptionLabel('City')
        .colorScale(d3.scaleOrdinal(d3.schemeSet3))
        .data(dataGroupedByCity);

    d3.select("#pie-chart-area")
        .call(dynamicPieChart);
};
