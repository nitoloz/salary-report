let selectedYear = '2018';

document.querySelector('select[id="yearSelect"]').onchange = function (event) {
    switch (event.target.value) {
        case '2018':
        case '2017':
            localStorage.setItem('selectedYear', event.target.value);
            location.reload();
            break;
        default:
            break;
    }
};

getSelectedYear();
loadData();

function getSelectedYear() {
    selectedYear = localStorage.getItem('selectedYear') ? localStorage.getItem('selectedYear') : '2018';
    if (selectedYear === '2018') {
        updateColumnNames(COLUMN_NAMES_2018);
    } else {
        updateColumnNames(COLUMN_NAMES_2017);
    }
    document.getElementById('yearSelect').value = selectedYear;
}

function loadData() {
    d3.csv(`data/salaries-responses-${selectedYear}.csv`)
        .then((data) => {
            data.forEach(d => {
                d[SEX] = d[SEX] === 'M' ? 'Male' : 'Female';
                d[COMPANY_SIZE] = d[COMPANY_SIZE] === 'До 10 человек' ? '10 or less' : d[COMPANY_SIZE];
            });

            groupedBarChartInitializer(data);
            pieChartInitializer(data);
            scatterChartInitializer(data);
            boxPlotInitializer(data);
        });
}


