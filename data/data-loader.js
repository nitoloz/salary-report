class DataLoader {

    constructor() {
        this.selectedYear = '2018';
        this.loadedData = [];

        this.scatterChart = new ScatterChart();
        this.boxPlot = new BoxPlot();
        this.groupedBarChart = new GroupedBarChart();
        this.pieChart = new PieChart();
        this.filters = new Filters();
        this.listenToYearSelector();
    }

    listenToYearSelector() {
        document.querySelector('select[id="yearSelect"]').onchange = (event) => {
            switch (event.target.value) {
                case '2018':
                case '2017':
                    localStorage.setItem('selectedYear', event.target.value);
                    this.getSelectedYear();
                    this.loadData();
                    break;
                default:
                    break;
            }
        };
    }

    getSelectedYear() {
        this.selectedYear = Utils.getSelectedYear();
        if (this.selectedYear === '2018') {
            updateColumnNames(COLUMN_NAMES_2018);
        } else {
            updateColumnNames(COLUMN_NAMES_2017);
        }
        document.getElementById('yearSelect').value = this.selectedYear;
    }

    loadData() {
        d3.csv(`data/salaries-responses-${this.selectedYear}.csv`)
            .then((data) => {
                data.forEach(d => {
                    d[DataProperties.SEX] = d[DataProperties.SEX] === 'M' ? 'Male' : 'Female';
                    d[DataProperties.COMPANY_SIZE] = d[DataProperties.COMPANY_SIZE] === 'До 10 человек' ? '10 or less' : d[DataProperties.COMPANY_SIZE];
                    d[DataProperties.SALARY_RAISE] = d[DataProperties.CURRENT_SALARY] >= 0 && d[DataProperties.PREVIOUS_SALARY] >= 0
                        ? d[DataProperties.CURRENT_SALARY] - d[DataProperties.PREVIOUS_SALARY]
                        : 0;
                });
                this.loadedData = data;

                this.filters.updateData(data.slice());
                this.groupedBarChart.updateData(data.slice());
                this.pieChart.updateData(data.slice());
                this.scatterChart.updateData(data.slice());
                this.boxPlot.updateData(data.slice());
            });
    }

    showFilteredCharts(filter, key) {
        document.getElementById("filter-content").textContent = `${key}: ${filter}`;
        document.getElementById("filter").className = document.getElementById("filter").className.replace(/\binvisible\b/g, "visible");
        const filteredData = this.loadedData.filter(entry => entry[key] === filter);
        this.boxPlot.updateData(filteredData);
    }
}

const dataLoader = new DataLoader();
dataLoader.getSelectedYear();
dataLoader.loadData();


