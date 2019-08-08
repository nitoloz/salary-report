function wordCloudChartD3(){

    let initialConfiguration = {
        width: 1000,
        height: 600,
        data: [],
        colorScale: d3.scaleOrdinal(d3.schemeSet3)
    };

    let width = initialConfiguration.width,
        height = initialConfiguration.height,
        data = initialConfiguration.data;
    let updateData = null;

    function chart(selection) {
        selection.each(function () {


            updateData = function () {

            };
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

    chart.data = function (value) {
        if (!arguments.length) return data;
        data = value;
        if (typeof updateData === 'function') updateData();
        return chart;
    };

    return chart;
}