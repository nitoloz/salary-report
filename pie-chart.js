class PieChart {

    constructor() {
        this.pieChart = pieChartD3()
            .width(width / 1.2)
            .height(height / 1.2)
            .groupByOptionLabel('City')
            .colorScale(d3.scaleOrdinal(d3.schemeSet3));

        d3.select("#pie-chart-area")
            .call(this.pieChart);

        this.subscribeToDropdownSelection()
    }

    subscribeToDropdownSelection() {


        document.querySelector('select[id="pieChartSelect"]').onchange = (event) => {
            const dataGroupedByCity = processPieChartData(this.data, CITY);
            const dataGroupedBySex = processPieChartData(this.data, SEX);
            const dataGroupedBySeniority = processPieChartData(this.data, SENIORITY_LEVEL);
            const dataGroupedByCompanyType = processPieChartData(this.data, COMPANY_TYPE);
            const dataGroupedByLanguage = processPieChartData(this.data, WORK_LANGUAGE);
            const dataGroupedByCompanySize = processPieChartData(this.data, COMPANY_SIZE, (a, b) => {
                return companySizesOrder.indexOf(a.key) - companySizesOrder.indexOf(b.key)
            });
            switch (event.target.value) {
                case 'City':
                    this.pieChart
                        .groupByOptionLabel('City')
                        .groupByOption(CITY)
                        .colorScale(d3.scaleOrdinal(d3.schemeSet3))
                        .data(dataGroupedByCity);
                    break;
                case 'Sex':
                    this.pieChart
                        .groupByOptionLabel('Sex')
                        .groupByOption(SEX)
                        .colorScale(Utils.getSexColorScale())
                        .data(dataGroupedBySex);
                    break;
                case 'Seniority':
                    this.pieChart
                        .groupByOptionLabel('Seniority')
                        .groupByOption(SENIORITY_LEVEL)
                        .colorScale(d3.scaleOrdinal(d3.schemeSet3))
                        .data(dataGroupedBySeniority);
                    break;
                case 'CompanyType':
                    this.pieChart
                        .groupByOptionLabel('Type')
                        .groupByOption(COMPANY_TYPE)
                        .colorScale(d3.scaleOrdinal(d3.schemeSet3))
                        .data(dataGroupedByCompanyType);
                    break;
                case 'Language':
                    this.pieChart
                        .groupByOptionLabel('Language')
                        .groupByOption(WORK_LANGUAGE)
                        .colorScale(d3.scaleOrdinal(d3.schemeSet3))
                        .data(dataGroupedByLanguage);
                    break;
                case 'Size':
                    this.pieChart
                        .groupByOptionLabel('Size')
                        .groupByOption(COMPANY_SIZE)
                        .colorScale(d3.scaleOrdinal(d3.schemeSet3))
                        .data(dataGroupedByCompanySize);
                    break;
                default:
                    break;
            }
        };
    }

    updateData(data) {
        this.data = data;
        const placeHolderTooltip = this.getPlaceholderTooltip();
        const chartData = processPieChartData(this.data, CITY);
        this.pieChart
            .placeHolderTooltip(placeHolderTooltip)
            .data(chartData)
    }

    getPlaceholderTooltip() {
        const salariesValues = this.data.map(response => response[CURRENT_SALARY]).sort((a, b) => a - b);
        const meanSalary = Math.round(d3.mean(salariesValues) / 1000) * 1000;

        const raisesValues = this.data.filter(response => response[CURRENT_SALARY] >= 0 && response[PREVIOUS_SALARY] >= 0)
            .map(response => response[CURRENT_SALARY] - response[PREVIOUS_SALARY]).sort((a, b) => a - b);
        const medianRaise = Math.round(d3.median(raisesValues) / 100) * 100;

        const quartiles = [
            d3.quantile(salariesValues, .25),
            d3.quantile(salariesValues, .5),
            d3.quantile(salariesValues, .75)
        ];
        return `<tspan x="0">December ${Utils.getSelectedYear()}</tspan>
                                <tspan x="0" dy="1.2em">Total respondents: ${this.data.length}</tspan>
                                <tspan x="0" dy="1.2em">Mean salary: ${meanSalary}</tspan>
                                <tspan x="0" dy="2em">1st quartile: ${quartiles[0]}</tspan>
                                <tspan x="0" dy="1.2em">Median salary: ${quartiles[1]}</tspan>
                                <tspan x="0" dy="1.2em">3rd quartile: ${quartiles[2]}</tspan>
                                <tspan x="0" dy="1.2em">Median raise: ${medianRaise}</tspan>`;
    }
}