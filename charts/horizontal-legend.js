function horizontalLegend() {
    let colorScale = d3.scaleOrdinal(d3.schemeSet3);
    let data = [];

    function chart(selection) {
        selection.each(function () {
            let dataL = 0;
            const offset = 30;

            const legend = d3.select(this)
                .selectAll("legend")
                .data(data)
                .enter().append('g')
                .attr("class", "legend")
                .attr("transform", function (d, i) {
                    let newdataL = dataL;
                    dataL += d.length * 7 + offset;
                    return "translate(" + (newdataL) + ",0)"
                });

            legend.append('rect')
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", 10)
                .attr("height", 10)
                .style("fill", function (d, i) {
                    return colorScale(d)
                });

            legend.append('text')
                .attr("x", 20)
                .attr("y", 10)
                //.attr("dy", ".35em")
                .text(function (d, i) {
                    return d
                })
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