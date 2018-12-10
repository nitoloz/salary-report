const OTHERS_GROUP = 'Others';

function processPieChartData(data, groupByOption, minimalLevel = 0.005) {
    data = data.filter(d => d[groupByOption] !== '');

    const internalMap = new Map();
    data.forEach(d => internalMap[d[groupByOption]] ? internalMap[d[groupByOption]]++ : internalMap[d[groupByOption]] = 1);

    return d3.nest()
        .key(d => internalMap[d[groupByOption]]/data.length > minimalLevel ? d[groupByOption] : OTHERS_GROUP)
        .rollup(d => d.length)
        .entries(data)
        .sort((a, b) => b.key === OTHERS_GROUP
            ? -1
            : a.key === OTHERS_GROUP
                ? Number.MAX_VALUE
                : b.value - a.value);
}

function processLineChartData(data, xOption, trellisingOption) {
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