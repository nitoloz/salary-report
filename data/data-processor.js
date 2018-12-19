const OTHERS_GROUP = 'Others';

function processPieChartData(data, groupByOption, customSortingFunction, minimalLevel = 0.005) {
    data = data.filter(d => d[groupByOption] !== '');

    const internalMap = new Map();
    data.forEach(d => internalMap[d[groupByOption]] ? internalMap[d[groupByOption]]++ : internalMap[d[groupByOption]] = 1);

    const defaultSortingFunction = (a, b) => {
        return b.key === OTHERS_GROUP
            ? -1
            : a.key === OTHERS_GROUP
                ? Number.MAX_VALUE
                : b.value.value - a.value.value
    };

    return d3.nest()
        .key(d => internalMap[d[groupByOption]] / data.length > minimalLevel ? d[groupByOption] : OTHERS_GROUP)
        .rollup(d => {
            return {
                value: d.length,
                extra: {
                    percentageValue: Math.round(d.length / data.length * 100),
                    meanSalary: Math.round(d3.mean(d.map(response => response[CURRENT_SALARY])) / 1000) * 1000,
                    medianSalary: Math.round(d3.median(d.map(response => response[CURRENT_SALARY])) / 1000) * 1000,
                }
            }
        })
        .entries(data)
        .sort(customSortingFunction ? customSortingFunction : defaultSortingFunction);
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

function processBoxPlotData(data, xOption, yOption) {
    data = data.filter(d => parseInt(d[xOption]) > 0);

    return d3.nest()
        .key((d) => {
            return d[xOption];
        })
        .rollup((d) => {
            return d;
        })
        .entries(data)
        .map(group => {
            return {
                key: group.key,
                values: group.value.sort(function (x, y) {
                    return d3.ascending(parseInt(x[yOption]), parseInt(y[yOption]));
                })
            };
        });
}