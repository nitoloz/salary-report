const margin = {top: 50, right: 50, bottom: 50, left: 100};
const height = 600;
const width = 1000;
const fullWidth = 1300;
const companySizesOrder = ['10 or less', '10-50', '50-100', '100-1000', '1000+'];
const saveButtons = [
    {label: "Save as SVG", x: 30, y: 30},
    {label: "Save as PNG", x: 100, y: 30}];

const oldScatterPlotTooltip = (d) => {
    return `Position: ${d[DataProperties.POSITION]}<br>
            Total Experience: ${d[DataProperties.TOTAL_EXPERIENCE]}<br>
            Salary ${Utils.getSelectedYear()}: ${d[DataProperties.CURRENT_SALARY]}<br>
            Salary Previous Year: ${d[DataProperties.PREVIOUS_SALARY] || 'no data'}<br>
            First EU Salary: ${d[DataProperties.FIRST_EUROPE_SALARY] || 'no data'}<br> <br>

            Age: ${d[DataProperties.AGE] || 'no data'} <br>
            Sex: ${d[DataProperties.SEX] || 'no data'} <br>
            City: ${d[DataProperties.CITY] || 'no data'} <br><br>
            
            Work Language: ${d[DataProperties.WORK_LANGUAGE] || 'no data'}<br> 
            Company Size: ${d[DataProperties.COMPANY_SIZE] || 'no data'}`;
};

const newScatterPlotTooltip = (d) => {
    return `Position: ${d[DataProperties.POSITION]}<br>
            Total Experience: ${d[DataProperties.TOTAL_EXPERIENCE]}<br>
            Salary ${Utils.getSelectedYear()}: ${d[DataProperties.CURRENT_SALARY]}<br>
            Salary Previous Year: ${d[DataProperties.PREVIOUS_SALARY] || 'no data'}<br>
            Bonus ${Utils.getSelectedYear()}: ${d[DataProperties.CURRENT_BONUS] || 'no data'}<br>
            Stocks ${Utils.getSelectedYear()}: ${d[DataProperties.CURRENT_STOCKS] || 'no data'}<br><br>
            
            Age: ${d[DataProperties.AGE] || 'no data'} <br>
            Sex: ${d[DataProperties.SEX] || 'no data'} <br>
            City: ${d[DataProperties.CITY] || 'no data'} <br><br>
            
            Main Technology: ${d[DataProperties.MAIN_TECHNOLOGY] || 'no data'}<br> 
            Business Sector: ${d[DataProperties.BUSINESS_SECTOR] || 'no data'}<br> 
            Vacation: ${d[DataProperties.VACATION_DAYS] || 'no data'} days<br> 
            Home-office: ${d[DataProperties.HOMEOFFICE_DAYS]} days/month<br> 
            Contract Duration: ${d[DataProperties.CONTRACT_DURATION] || 'no data'}<br> 
            Company Size: ${d[DataProperties.COMPANY_SIZE] || 'no data'}`;
};

Object.defineProperty(Array.prototype, 'flat', {
    value: function (depth = 1) {
        return this.reduce(function (flat, toFlatten) {
            return flat.concat((Array.isArray(toFlatten) && (depth - 1)) ? toFlatten.flat(depth - 1) : toFlatten);
        }, []);
    }
});

class Utils {

    static numberSortingFunction(a, b) {
        return b.key === OTHERS_GROUP
            ? -1
            : a.key === OTHERS_GROUP
                ? Number.MAX_VALUE
                : parseInt(b.key) - parseInt(a.key)
    }

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

    static getScatterPlotTooltipFormatter() {
        switch (Utils.getSelectedYear()) {
            case '2017':
            case '2018':
                return oldScatterPlotTooltip;
                break;
            case '2019':
            default:
                return newScatterPlotTooltip;
                break;
        }
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

    static applyAxisStyle(gAxis, rotateLabels) {
        gAxis.selectAll('line')
            .style('fill', 'none')
            .style('stroke', 'rgba(0, 0, 0, 0.1)')
            .style('shape-rendering', 'crispEdges');
        gAxis.select('path')
            .style('fill', 'none')
            .style('stroke', 'rgba(0, 0, 0, 0.1)')
            .style('shape-rendering', 'crispEdges');

        if (rotateLabels) {

            gAxis.selectAll('.tick').selectAll("text")
            // .attr("y", 0)
            // .attr("x", 9)
            // .attr("dy", ".35em")
                .attr("transform", "rotate(-30)")
                .style("text-anchor", "end")
        }

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
