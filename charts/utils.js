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

    static appendSaveButtons(selection) {
        // var button = d3.button()
        //     .on('press', function(d, i) { console.log("Pressed", d, i, this.parentNode)})
        //     .on('release', function(d, i) { console.log("Released", d, i, this.parentNode)});
        // selection.selectAll('.button')
        //     .data(data)
        //     .enter()
        //     .append('g')
        //     .attr('class', 'button')
        //     .call(button);
    }

    static downloadSvg(svg, name) {
        const svgData = svg.node().outerHTML;
        const svgBlob = new Blob([svgData], {type: "image/svg+xml;charset=utf-8"});
        const svgUrl = URL.createObjectURL(svgBlob);
        const downloadLink = document.createElement("a");
        downloadLink.href = svgUrl;
        downloadLink.download = `${name}.svg`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }
}

function openNav() {
    // document.getElementById("mySidepanel").style.width = "300px";
}

/* Set the width of the sidebar to 0 (hide it) */
function closeNav() {
    // document.getElementById("mySidepanel").style.width = "50px";
}