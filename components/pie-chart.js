class PieChart {

    constructor() {
        this.groupByOption = 'CITY';
        this.sortingFunction = null;
        this.pieChart = pieChartD3()
            .width(Utils.getChartContainerDimensions().width)
            .height(Utils.getChartContainerDimensions().height)
            .id('pie-chart-area')
            .groupByOptionLabel('City')
            .groupByOption(DataProperties[this.groupByOption])
            .colorScale(d3.scaleOrdinal(d3.schemeSet3));

        d3.select("#pie-chart-area")
            .call(this.pieChart);

        this.subscribeToDropdownSelection()
    }

    subscribeToDropdownSelection() {


        document.querySelector('select[id="pieChartSelect"]').onchange = (event) => {
            switch (event.target.value) {
                case 'City':
                    this.groupByOption = 'CITY';
                    this.sortingFunction = null;
                    this.pieChart
                        .groupByOptionLabel('City')
                        .groupByOption(DataProperties[this.groupByOption])
                        .colorScale(d3.scaleOrdinal(d3.schemeSet3))
                        .data(processPieChartData(this.data, DataProperties[this.groupByOption]));
                    break;
                case 'Sex':
                    this.groupByOption = 'SEX';
                    this.sortingFunction = null;
                    this.pieChart
                        .groupByOptionLabel('Sex')
                        .groupByOption(DataProperties[this.groupByOption])
                        .colorScale(Utils.getSexColorScale())
                        .data(processPieChartData(this.data, DataProperties[this.groupByOption]));
                    break;
                case 'Seniority':
                    this.groupByOption = 'SENIORITY_LEVEL';
                    this.sortingFunction = null;
                    this.pieChart
                        .groupByOptionLabel('Seniority')
                        .groupByOption(DataProperties[this.groupByOption])
                        .colorScale(d3.scaleOrdinal(d3.schemeSet3))
                        .data(processPieChartData(this.data, DataProperties[this.groupByOption]));
                    break;
                case 'CompanyType':
                    this.groupByOption = 'COMPANY_TYPE';
                    this.sortingFunction = null;
                    this.pieChart
                        .groupByOptionLabel('Type')
                        .groupByOption(DataProperties[this.groupByOption])
                        .colorScale(d3.scaleOrdinal(d3.schemeSet3))
                        .data(processPieChartData(this.data, DataProperties[this.groupByOption]));
                    break;
                case 'Language':
                    this.groupByOption = 'WORK_LANGUAGE';
                    this.sortingFunction = null;
                    this.pieChart
                        .groupByOptionLabel('Language')
                        .groupByOption(DataProperties[this.groupByOption])
                        .colorScale(d3.scaleOrdinal(d3.schemeSet3))
                        .data(processPieChartData(this.data, DataProperties[this.groupByOption]));
                    break;
                case 'Duration':
                    this.groupByOption = 'CONTRACT_DURATION';
                    this.sortingFunction = null;
                    this.pieChart
                        .groupByOptionLabel('Сontract Duration')
                        .groupByOption(DataProperties[this.groupByOption])
                        .colorScale(d3.scaleOrdinal(d3.schemeSet3))
                        .data(processPieChartData(this.data, DataProperties[this.groupByOption]));
                    break;
                case 'BusinessSector':
                    this.groupByOption = 'BUSINESS_SECTOR';
                    this.sortingFunction = null;
                    this.pieChart
                        .groupByOptionLabel('Business Sector')
                        .groupByOption(DataProperties[this.groupByOption])
                        .colorScale(d3.scaleOrdinal(d3.schemeSet3))
                        .data(processPieChartData(this.data, DataProperties[this.groupByOption]));
                    break;
                case 'Vacation':
                    this.groupByOption = 'VACATION_DAYS';
                    this.sortingFunction = Utils.numberSortingFunction;
                    this.pieChart
                        .groupByOptionLabel('Vacation Days')
                        .groupByOption(DataProperties[this.groupByOption])
                        .colorScale(d3.scaleOrdinal(d3.schemeSet3))
                        .data(processPieChartData(this.data, DataProperties[this.groupByOption], this.sortingFunction));
                    break;
                case 'Homeoffice':
                    this.groupByOption = 'HOMEOFFICE_DAYS';
                    this.sortingFunction = Utils.numberSortingFunction;
                    this.pieChart
                        .groupByOptionLabel('Homeoffice Days')
                        .groupByOption(DataProperties[this.groupByOption])
                        .colorScale(d3.scaleOrdinal(d3.schemeSet3))
                        .data(processPieChartData(this.data, DataProperties[this.groupByOption], this.sortingFunction));
                    break;
                case 'Size':
                    this.groupByOption = 'COMPANY_SIZE';
                    this.sortingFunction = (a, b) => {
                        return companySizesOrder.indexOf(a.key) - companySizesOrder.indexOf(b.key)
                    };
                    this.pieChart
                        .groupByOptionLabel('Size')
                        .groupByOption(DataProperties[this.groupByOption])
                        .colorScale(d3.scaleOrdinal(d3.schemeSet3))
                        .data(processPieChartData(this.data, DataProperties[this.groupByOption], this.sortingFunction));
                    break;
                default:
                    break;
            }
        };
    }

    updateData(data) {
        this.data = data;
        this.pieChart
            .groupByOption(DataProperties[this.groupByOption])
            .placeHolderTooltip(this.getPlaceholderTooltip())
            .data(processPieChartData(this.data, DataProperties[this.groupByOption], this.sortingFunction))
    }

    getPlaceholderTooltip() {
        const salariesValues = this.data.map(response => response[DataProperties.CURRENT_SALARY]).sort((a, b) => a - b);
        const meanSalary = Math.round(d3.mean(salariesValues) / 1000) * 1000;

        const raisesValues = this.data.filter(response => response[DataProperties.CURRENT_SALARY] >= 0 && response[DataProperties.PREVIOUS_SALARY] >= 0)
            .map(response => response[DataProperties.CURRENT_SALARY] - response[DataProperties.PREVIOUS_SALARY]).sort((a, b) => a - b);
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
