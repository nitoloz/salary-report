function gradientLegend() {
    let updateLegendData = null;
    let width = 150;
    let height = 50;
    let colors = ['blue', 'red'];
    let values = [40, 110];

    function chart(selection) {
        selection.each(function () {

            const key = d3.select(this)
                .append("g")
                .attr("width", height)
                .attr("height", height);

            const legend = key.append("defs")
                .append("svg:linearGradient")
                .attr("id", "gradient")
                .attr("x1", "0%")
                .attr("y1", "100%")
                .attr("x2", "100%")
                .attr("y2", "100%")
                .attr("spreadMethod", "pad");

            const colorGradientStep = 100 / (colors.length - 1);
            colors.forEach((color, i) => {
                legend.append("stop")
                    .attr("offset", `${colorGradientStep * i}%`)
                    .attr("stop-color", color)
                    .attr("stop-opacity", 1);
            });

            key.append("rect")
                .attr("width", width)
                .attr("height", height - 30)
                .style("fill", "url(#gradient)");

            const y = d3.scaleLinear()
                .range([0, width])
                .domain([values[0], values[values.length - 1]]);

            const yAxis = d3.axisBottom()
                .scale(y)
                .tickValues([
                    values[0],
                    Math.round((values[0] + values[values.length - 1]) / 2),
                    values[values.length - 1]
                ]);

            key.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(0,20)")
                .call(yAxis);
        })
    }

    chart.width = function (value) {
        if (!arguments.length) return width;
        width = value;
        return chart;
    };

    chart.height = function (value) {
        if (!arguments.length) return height;
        height = value;
        return chart;
    };

    chart.colors = function (value) {
        if (!arguments.length) return colors;
        colors = value;
        return chart;
    };

    chart.values = function (value) {
        if (!arguments.length) return values;
        values = value;
        return chart;
    };

    chart.data = function (value) {
        if (!arguments.length) return data;
        data = value;
        if (typeof updateLegendData === 'function') updateLegendData();
        return chart;
    };

    return chart;
}