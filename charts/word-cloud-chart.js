function wordCloudChartD3() {

    let initialConfiguration = {
        width: 1000,
        height: 600,
        data: [],
        colorScale: d3.scaleOrdinal(d3.schemeSet3),
        id: ''
    };

    let width = initialConfiguration.width,
        height = initialConfiguration.height,
        data = initialConfiguration.data,
        id = initialConfiguration.id;
    let updateData = null;

    function chart(selection) {


        selection.each(function () {
            const svg = selection
                .append('svg')
                .attr('height', height)
                .attr('width', width)
                .append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

            const layout = d3.layout.cloud()
                .size([width, height])
                .padding(5)
                .rotate(function () {
                    return ~~(Math.random() * 2) * 90;
                })
                .fontSize(function (d) {
                    return d.size;
                });

            const sizeScale = d3.scaleLinear()
                .domain([0, 30])
                .range([20, 80]);

            updateData = function () {

                sizeScale.domain([d3.min(data, d => d.size), d3.max(data, d => d.size)]);
                console.log(sizeScale.domain());

                layout.words(data.map(function (d) {
                    return {text: d.word, size: sizeScale(d.size)};
                })).on("end", draw).start();

                function draw(words) {
                    const updatedWords = svg.selectAll("text").data(words);
                    updatedWords
                        .enter().append("text")
                        .style("font-size", function (d) {
                            return `${d.size}px`;
                        })
                        .style("fill", "#69b3a2")
                        .attr("text-anchor", "middle")
                        .attr("transform", function (d) {
                            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                        })
                        .text(function (d) {
                            return d.text;
                        });

                    updatedWords
                        .transition()
                        .ease(d3.easeLinear)
                        .duration(750)
                        .style("font-size", function (d) {
                            return `${d.size}px`;
                        })
                        .style("fill", "#69b3a2")
                        .attr("text-anchor", "middle")
                        .attr("transform", function (d) {
                            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                        })
                        .text(function (d) {
                            return d.text;
                        });

                    updatedWords.exit()
                        .transition()
                        .ease(d3.easeLinear)
                        .duration(100)
                        .remove();
                }
            };
        })
    }

    chart.id = function (value) {
        if (!arguments.length) return id;
        id = value;
        return chart;
    };

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