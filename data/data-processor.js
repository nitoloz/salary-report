function proceesPiChartData(data, groupByOption){
    data = data.filter(d => d[groupByOption] !== '');

    return d3.nest()
        .key(d => d[groupByOption])
        .rollup(d => d.length)
        .entries(data);
}