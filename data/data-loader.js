d3.csv('data/salaries-responses.csv')
    .then((data) => {
        data.forEach(d => {
            d[SEX] = d[SEX] === 'M' ? 'Male' : 'Female';
            d[COMPANY_SIZE] = d[COMPANY_SIZE] === 'До 10 человек' ? '10 or less' : d[COMPANY_SIZE];
        });

        linePlotInitializer(data);
        pieChartInitializer(data);
        scatterChartInitializer(data);
        boxPlotInitializer(data);
    });


