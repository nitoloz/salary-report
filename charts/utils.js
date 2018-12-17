const margin = {top: 50, right: 50, bottom: 50, left: 100};
const height = 600;
const width = 1000;

class Utils {
    static getSexColorScale() {
        return d3.scaleOrdinal() // D3 Version 4
            .domain(["Male", "Female"])
            .range(["#80b1d3", "#fb8072"]);
    }

    static appendXAxis(selection, x, y, text) {
        selection.append('text')
            .attr('class', 'label')
            .attr('y', y)
            .attr('x', x)
            .attr('dy', '.71em')
            .style('text-anchor', 'end')
            .style('font-size', '12')
            .style('fill', 'black')
            .text(text);
    }

    static appendYAxis(selection, x, y, text) {
        selection.append('text')
            .attr('class', 'label')
            .attr('transform', 'rotate(-90)')
            .attr('x', x)
            .attr('y', y)
            .attr('dy', '.71em')
            .style('font-size', '12')
            .style('fill', 'black')
            .style('text-anchor', 'end')
            .text(text);
    }

    static appendTitle(selection, x, y, text) {
        selection.append("text")
            .attr("x",x)
            .attr("y",y)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "underline")
            .text(text);
    }
}