function horizontalLegend() {
    let colorScale = d3.scaleOrdinal(d3.schemeSet3);
    let data = [];

    function chart(selection) {
        selection.each(function () {

            const legend = d3.select(this)
                .selectAll("legend")
                .data(data)
                .enter().append('g')
                .attr("class", "legend")
                .attr("transform", (d, i) => `translate(0,${i * 20})`);

            legend.append('rect')
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", 10)
                .attr("height", 10)
                .style("fill", d => colorScale(d));

            legend.append('text')
                .attr("x", 20)
                .attr("y", 10)
                .text(d => d)
                .attr("class", "textselected")
                .style("text-anchor", "start")
                .style("font-size", 15);
        })
    }

    chart.colorScale = function (value) {
        if (!arguments.length) return colorScale;
        colorScale = value;
        return chart;
    };

    chart.data = function (value) {
        if (!arguments.length) return data;
        data = value;
        return chart;
    };

    return chart;
}