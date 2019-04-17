const sortByMedian = (a, b) => parseInt(a.quartile[1]) - parseInt(b.quartile[1]);
const xAxisOptions = [
    {
        selectLabel: 'Experience',
        axisLabel: 'Total experience (Years)',
        groupByOption: 'TOTAL_EXPERIENCE'
    },
    {
        selectLabel: 'City',
        axisLabel: 'City',
        groupByOption: 'CITY'
    },
    {
        selectLabel: 'Sex',
        axisLabel: 'Sex',
        groupByOption: 'SEX'
    },
    {
        selectLabel: 'Seniority',
        axisLabel: 'Seniority Level',
        groupByOption: 'SENIORITY_LEVEL'
    },
    {
        selectLabel: 'CompanyType',
        axisLabel: 'Company Type',
        groupByOption: 'COMPANY_TYPE'
    },
    {
        selectLabel: 'Language',
        axisLabel: 'Language',
        groupByOption: 'WORK_LANGUAGE'
    },
    {
        selectLabel: 'Size',
        axisLabel: 'Company Size',
        groupByOption: 'COMPANY_SIZE'
    }
];

const yAxisOptions = [
    {
        selectLabel: 'Salary',
        axisLabel: 'Salary (EUR)',
        groupByOption: 'CURRENT_SALARY'
    },
    {
        selectLabel: 'Raise',
        axisLabel: 'Salary Raise (EUR)',
        groupByOption: 'SALARY_RAISE'
    }
];

class BoxPlot {

    constructor() {

        this.selectedXAxisOption = xAxisOptions[0];
        this.selectedYAxisOption = yAxisOptions[0];
        this.salaryBoxPlot = boxPlotD3()
            .width(width)
            .height(height);

        d3.select("#box-plot-area")
            .call(this.salaryBoxPlot);

        document.querySelector('select[id="boxPlotXAxisSelect"]').onchange = (event) => {
            this.selectedXAxisOption = xAxisOptions.find(option => option.selectLabel === event.target.value);
            this.redrawPlot();
        };

        document.querySelector('select[id="boxPlotYAxisSelect"]').onchange = (event) => {
            this.selectedYAxisOption = yAxisOptions.find(option => option.selectLabel === event.target.value);
            this.redrawPlot();
        };
    }

    updateData(data) {
        this.data = data;
        this.redrawPlot();
    }


    redrawPlot() {
        let boxPlotData;
        switch (DataProperties[this.selectedXAxisOption.groupByOption]) {
            case DataProperties.TOTAL_EXPERIENCE:
                boxPlotData = processBoxPlotData(this.data,
                    DataProperties[this.selectedXAxisOption.groupByOption],
                    DataProperties[this.selectedYAxisOption.groupByOption]);
                break;
            case DataProperties.COMPANY_SIZE:
                boxPlotData = processBoxPlotData(this.data,
                    DataProperties[this.selectedXAxisOption.groupByOption],
                    DataProperties[this.selectedYAxisOption.groupByOption],
                    (a, b) => companySizesOrder.indexOf(a.key) - companySizesOrder.indexOf(b.key));
                break;
            default:
                boxPlotData = processBoxPlotData(this.data,
                    DataProperties[this.selectedXAxisOption.groupByOption],
                    DataProperties[this.selectedYAxisOption.groupByOption],
                    sortByMedian);
                break;
        }

        this.salaryBoxPlot
            .xAxisLabel(this.selectedXAxisOption.axisLabel)
            .yAxisLabel(this.selectedYAxisOption.axisLabel)
            .data(boxPlotData);
    }

}