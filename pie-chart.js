d3.csv('data/salaries-responses.csv')
    .then((data) => {
        data.forEach(d => d[SEX] = d[SEX] === 'M' ? 'Male' : 'Female');

        const meanSalary = Math.round(d3.mean(data.map(response => response[CURRENT_SALARY])) / 1000) * 1000;
        const medianSalary = Math.round(d3.median(data.map(response => response[CURRENT_SALARY])) / 1000) * 1000;

        let placeHolderTooltip = `<tspan x="0">December 2017</tspan>
                                  <tspan x="0" dy="1.2em">Total respondents: ${data.length}</tspan>
                                  <tspan x="0" dy="1.2em">Mean salary: ${meanSalary}</tspan>
                                  <tspan x="0" dy="1.2em">Median salary: ${medianSalary}</tspan>`;

        let dynamicPieChart = pieChart()
            .width(width / 1.5)
            .height(height / 1.5)
            .placeHolderTooltip(placeHolderTooltip);

        let sexColorScale = d3.scaleOrdinal()
            .domain(["M", "F"])
            .range(["#80b1d3", "#fb8072"]);

        document.querySelector('select[id="pieChartSelect"]').onchange = function (event) {
            switch (event.target.value) {
                case 'City':
                    dynamicPieChart
                        .groupByOptionLabel('City')
                        .colorScale(d3.scaleOrdinal(d3.schemeSet3))
                        .data(dataGroupedByCity);
                    break;
                case 'Sex':
                    dynamicPieChart
                        .groupByOptionLabel('Sex')
                        .colorScale(sexColorScale)
                        .data(dataGroupedBySex);
                    break;
                case 'Seniority':
                    dynamicPieChart
                        .groupByOptionLabel('Seniority')
                        .colorScale(d3.scaleOrdinal(d3.schemeSet3))
                        .data(dataGroupedBySeniority);
                    break;
                case 'CompanyType':
                    dynamicPieChart
                        .groupByOptionLabel('Type')
                        .colorScale(d3.scaleOrdinal(d3.schemeSet3))
                        .data(dataGroupedByCompanyType);
                    break;
                case 'Language':
                    dynamicPieChart
                        .groupByOptionLabel('Language')
                        .colorScale(d3.scaleOrdinal(d3.schemeSet3))
                        .data(dataGroupedByLanguage);
                    break;
                case 'Size':
                    dynamicPieChart
                        .groupByOptionLabel('Size')
                        .colorScale(d3.scaleOrdinal(d3.schemeSet3))
                        .data(dataGroupedByCompanySize);
                    break;
                default:
                    break;
            }
        };

        let dataGroupedByCity = processPieChartData(data, CITY);
        let dataGroupedBySex = processPieChartData(data, SEX);
        let dataGroupedBySeniority = processPieChartData(data, SENIORITY_LEVEL);
        let dataGroupedByCompanyType = processPieChartData(data, COMPANY_TYPE);
        let dataGroupedByLanguage = processPieChartData(data, WORK_LANGUAGE);
        let dataGroupedByCompanySize = processPieChartData(data, COMPANY_SIZE);

        dynamicPieChart
            .groupByOptionLabel('City')
            .colorScale(d3.scaleOrdinal(d3.schemeSet3))
            .data(dataGroupedByCity);

        d3.select("#pie-chart-area")
            .call(dynamicPieChart);

    });
