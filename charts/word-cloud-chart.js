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
            var myWords = [
                {word: "Running", size: "10"},
                {word: "Surfing", size: 20},
                {word: "Climbing", size: "50"},
                {word: "Kiting", size: "30"},
                {word: "Sailing", size: "20"},
                {word: "Snowboarding", size: "60"}
            ];
            const svg = selection
                .append('svg')
                .attr('height', height)
                .attr('width', width);

// Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
// Wordcloud features that are different from one word to the other must be here
            var layout = d3.layout.cloud()
                .size([width, height])
                .words(myWords.map(function (d) {
                    return {text: d.word, size: d.size};
                }))
                .padding(5)        //space between words
                .rotate(function () {
                    return ~~(Math.random() * 2) * 90;
                })
                .fontSize(function (d) {
                    return d.size;
                })      // font size of words
                .on("end", draw);
            layout.start();

// This function takes the output of 'layout' above and draw the words
// Wordcloud features that are THE SAME from one word to the other can be here
            function draw(words) {
                svg
                    .append("g")
                    .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
                    .selectAll("text")
                    .data(words)
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
            }

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