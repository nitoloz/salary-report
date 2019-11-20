const margin = {top: 50, right: 50, bottom: 50, left: 100};
const height = 600;
const width = 1000;
const fullWidth = 1300;
const companySizesOrder = ['10 or less', '10-50', '50-100', '100-1000', '1000+'];
const saveButtons = [
    {label: "Save as SVG", x: 30, y: 30},
    {label: "Save as PNG", x: 100, y: 30}];

Object.defineProperty(Array.prototype, 'flat', {
    value: function (depth = 1) {
        return this.reduce(function (flat, toFlatten) {
            return flat.concat((Array.isArray(toFlatten) && (depth - 1)) ? toFlatten.flat(depth - 1) : toFlatten);
        }, []);
    }
});

class Utils {

    static getChartContainerDimensions() {
        const rectangle = document.getElementsByClassName('container-fluid')[0].getBoundingClientRect();
        const chartWidth = Math.min(width, rectangle.width);
        const chartHeight = (chartWidth / width) * height;
        return {width: chartWidth, height: chartHeight};
    }


    static getFullWidthChartContainerDimensions() {
        const rectangle = document.getElementsByClassName('container-fluid')[0].getBoundingClientRect();
        const chartWidth = Math.min(fullWidth, rectangle.width);
        const chartHeight = (chartWidth / fullWidth) * height;
        return {width: chartWidth, height: chartHeight};
    }

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

    static getSelectedYear() {
        return localStorage.getItem('selectedYear') ? localStorage.getItem('selectedYear') : '2018';
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

    static applyAxisStyle(gAxis) {
        gAxis.selectAll('line')
            .style('fill', 'none')
            .style('stroke', 'rgba(0, 0, 0, 0.1)')
            .style('shape-rendering', 'crispEdges');
        gAxis.select('path')
            .style('fill', 'none')
            .style('stroke', 'rgba(0, 0, 0, 0.1)')
            .style('shape-rendering', 'crispEdges');
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

    static appendSaveButtons(chartDiv, chartSVG, name) {
        const buttonsDiv = document.createElement("div");
        const saveSVGButton = document.createElement("button");
        saveSVGButton.innerHTML = "Save as SVG";
        saveSVGButton.id = 'export_to_svg';
        saveSVGButton.className = 'btn btn-outline-secondary btn-sm float-left';
        saveSVGButton.onclick = function (event) {
            Utils.downloadSvg(chartSVG, name);
        };
        const savePNGButton = document.createElement("button");
        savePNGButton.innerHTML = "Save as PNG";
        savePNGButton.id = 'export_to_png';
        savePNGButton.className = 'btn btn-outline-secondary btn-sm float-left ml-2';
        savePNGButton.onclick = function (event) {
            exportToPng(`#${d3.select(chartSVG.node().children[1]).attr('id')}`, 'name');
        };

        buttonsDiv.appendChild(saveSVGButton);
        buttonsDiv.appendChild(savePNGButton);
        chartDiv.node().insertBefore(buttonsDiv, chartDiv.node().childNodes[0])
    }

    static downloadSvg(selection, name) {
        const svg = d3.select(selection.node().children[1]);
        svg.attr('xmlns', 'http://www.w3.org/2000/svg');
        const svgData = svg.node().outerHTML;
        const preface = '<?xml version="1.0" standalone="no"?>\r\n';
        const svgBlob = new Blob([preface, svgData], {type: "image/svg+xml;charset=utf-8"});
        const svgUrl = URL.createObjectURL(svgBlob);
        const downloadLink = document.createElement("a");
        downloadLink.href = svgUrl;
        downloadLink.download = name + '.svg';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }
}
