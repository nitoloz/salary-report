const margin = {top: 50, right: 50, bottom: 50, left: 100};
const height = 600;
const width = 1000;
const companySizesOrder = ['10 or less', '10-50', '50-100', '100-1000', '1000+'];

Object.defineProperty(Array.prototype, 'flat', {
    value: function(depth = 1) {
        return this.reduce(function (flat, toFlatten) {
            return flat.concat((Array.isArray(toFlatten) && (depth-1)) ? toFlatten.flat(depth-1) : toFlatten);
        }, []);
    }
});

class Utils {
    static getSexColorScale() {
        return d3.scaleOrdinal()
            .domain(["Male", "Female"])
            .range(["#80b1d3", "#fb8072"]);
    }

    static getSexColorScaleWithoutDomain() {
        return d3.scaleOrdinal()
            .range(["#80b1d3", "#fb8072"]);
    }

    static getExtendedSexColorScaleWithoutDomain() {
        return d3.scaleOrdinal()
            .range(['#80b1d380', '#fb807280', "#80b1d3", "#fb8072"]);
    }

    static appendXAxisTitle(selection, x, y, text) {
        selection.append('text')
            .attr('class', 'label x axis')
            .attr('y', y)
            .attr('x', x)
            .attr('dy', '.71em')
            .style('text-anchor', 'end')
            .style('font-size', '12')
            .style('fill', 'black')
            .text(text);
    }

    static appendYAxisTitle(selection, x, y, text) {
        selection.append('text')
            .attr('class', 'label y axis')
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
            .attr('class', 'title')
            .attr("x", x)
            .attr("y", y)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "underline")
            .text(text);
    }
}