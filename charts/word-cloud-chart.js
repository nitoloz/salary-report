function wordCloudChartD3() {

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
            const svg = selection
                .append('svg')
                .attr('height', height)
                .attr('width', width)
                .append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

            const layout = d3.layout.cloud()
                .size([width, height])
                .padding(5)        //space between words
                .rotate(function () {
                    return ~~(Math.random() * 2) * 90;
                })
                .fontSize(function (d) {
                    return d.size;
                });   // font size of words

            updateData = function () {

// Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
// Wordcloud features that are different from one word to the other must be here

                layout.words(data.map(function (d) {
                    return {text: d.word, size: d.size};
                })).on("end", draw).start();

// This function takes the output of 'layout' above and draw the words
// Wordcloud features that are THE SAME from one word to the other can be here
                function draw(words) {
                    const updatedWords = svg.selectAll("text").data(words);
                    updatedWords
                        .enter().append("text")
                        .style("font-size", function (d) {
                            return `${d.size}px`;
                        })
                        .style("fill", "#69b3a2")
                        .attr("text-anchor", "middle")
                        .style("font-family", "Impact")
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
                        .style("font-family", "Impact")
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