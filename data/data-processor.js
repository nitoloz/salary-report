function processPieChartData(data, groupByOption){
    data = data.filter(d => d[groupByOption] !== '');

    return d3.nest()
        .key(d => d[groupByOption])
        .rollup(d => d.length)
        .entries(data);

}function processLineChartData(data, xOption, trellisingOption){
    data = data.filter(d => parseInt(d[xOption]) > 0);

    return d3.nest()
        .key((d) => {
            return d[trellisingOption];
        })
        .key((d) => {
            return Math.round(d[xOption] / 5000) * 5000;
        })
        .rollup((d) => {
            return d.length;
        })
        .entries(data)
        .map(group => {
            return {
                key: group.key,
                values: group.values.sort(function (x, y) {
                    return d3.ascending(parseInt(x.key), parseInt(y.key));
                })
            };
        });
}