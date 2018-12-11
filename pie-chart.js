d3.csv('data/salaries-responses.csv')
    .then((data) => {
        data.forEach(d => {
            d[SEX] = d[SEX] === 'M' ? 'Male' : 'Female';
            d[COMPANY_SIZE] = d[COMPANY_SIZE] === 'До 10 человек' ? '10 or less' : d[COMPANY_SIZE];
        });

        const meanSalary = Math.round(d3.mean(data.map(response => response[CURRENT_SALARY])) / 1000) * 1000;
        const medianSalary = Math.round(d3.median(data.map(response => response[CURRENT_SALARY])) / 1000) * 1000;

        const placeHolderTooltip = `<tspan x="0">December 2017</tspan>
                                  <tspan x="0" dy="1.2em">Total respondents: ${data.length}</tspan>
                                  <tspan x="0" dy="1.2em">Mean salary: ${meanSalary}</tspan>
                                  <tspan x="0" dy="1.2em">Median salary: ${medianSalary}</tspan>`;

        const dynamicPieChart = pieChart()
            .width(width / 1.5)
            .height(height / 1.5)
            .placeHolderTooltip(placeHolderTooltip);

        const sexColorScale = d3.scaleOrdinal()
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

        const dataGroupedByCity = processPieChartData(data, CITY);
        const dataGroupedBySex = processPieChartData(data, SEX);
        const dataGroupedBySeniority = processPieChartData(data, SENIORITY_LEVEL);
        const dataGroupedByCompanyType = processPieChartData(data, COMPANY_TYPE);
        const dataGroupedByLanguage = processPieChartData(data, WORK_LANGUAGE);

        const companySizesOrder = ['10 or less', '10-50', '50-100', '100-1000', '1000+'];
        const dataGroupedByCompanySize = processPieChartData(data, COMPANY_SIZE, (a, b) => {
            return companySizesOrder.indexOf(a.key) - companySizesOrder.indexOf(b.key)
        });

        dynamicPieChart
            .groupByOptionLabel('City')
            .colorScale(d3.scaleOrdinal(d3.schemeSet3))
            .data(dataGroupedByCity);

        d3.select("#pie-chart-area")
            .call(dynamicPieChart);
    });
