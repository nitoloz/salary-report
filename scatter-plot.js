const margin = {top: 50, right: 50, bottom: 50, left: 100};
const height = 600;
const width = 1000;

let svg = d3.select("#chart-area")
    .append('svg')
    .attr('height', height)
    .attr('width', width)
// .attr('transform','translate(' + margin.left + ',' + margin.top + ')');


d3.csv('data/salaries-responses.csv')
    .then((data) => {
        data = data.filter(d => parseInt(d[CURRENT_SALARY]) > 0 && parseInt(d[TOTAL_EXPERIENCE]) > 0);
        let salaries = data.map(d => parseInt(d[CURRENT_SALARY]));
        let experience = data.map(d => parseInt(d[TOTAL_EXPERIENCE]));
        //
        // let groupedData = d3.nest()
        //     .key((d) => {
        //         return d[CITY];
        //     })
        //     .rollup((d) => {
        //         return d.length;
        //     })
        //     .entries(data);

        // let radiusScale = d3.scaleLinear()
        //     .domain([0, d3.max(groupedData, (d) => {
        //         return d.value
        //     })])
        //     .range([5, 100]);
        //
        // let circles = svg.selectAll('circle')
        //     .data(groupedData)
        //     .enter()
        //     .append('circle')
        //     .attr('cx', (d, i) => {
        //         return (i % 40 * 20) + 40;
        //     })
        //     .attr('cy', (d, i) => {
        //         return (Math.floor(i / 40) + 1) * 50;
        //     })
        //     .attr('r', d => {
        //         return radiusScale(parseInt(d.value));
        //     })
        //     .attr('fill', (d, i) => {
        //         switch (d.key) {
        //             case `München`:
        //                 return 'blue';
        //             case 'Berlin':
        //                 return 'yellow';
        //             case `Frankfurt`:
        //                 return 'green';
        //             default:
        //                 return 'gray';
        //         }
        //     });


        let xScale = d3.scaleLinear()
            .domain([
                d3.min([0, d3.min(experience)]),
                d3.max([0, d3.max(experience)])
            ]).range([margin.left, width - margin.right]);

        let yScale = d3.scaleLog()
            .domain([
                d3.min([d3.min(salaries)]),
                d3.max([d3.max(salaries)])
            ])
            .range([height - margin.top, margin.bottom])
            .base(100);


        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (height - margin.top) + ")")
            .call(d3.axisBottom(xScale));

        svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + margin.left + ",0)")
            .call(d3.axisLeft(yScale)
                .ticks(10)
                .tickFormat((d) => {
                    return "EUR " + d/1000+"K";
                })
            );

        let colorScale = d3.scaleOrdinal(d3['schemeAccent']);

        // Circles
        let circles = svg.selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr('cx', function (d) {
                return xScale(parseInt(d[TOTAL_EXPERIENCE]))
            })
            .attr('cy', function (d) {
                return yScale(parseInt(d[CURRENT_SALARY]))
            })
            .attr('r', '5')
            .attr('stroke', 'black')
            .attr('stroke-width', 1)
            .attr('fill', function (d, i) {
                return colorScale(d[SEX])
            })
            .on('mouseover', function () {
                d3.select(this)
                    .transition()
                    .duration(100)
                    .attr('r', 10)
                    .attr('stroke-width', 3)
            })
            .on('mouseout', function () {
                d3.select(this)
                    .transition()
                    .duration(100)
                    .attr('r', 5)
                    .attr('stroke-width', 1)
            })
            .append('title')
            .text(function (d) {
                return 'Total Experience: ' + d[TOTAL_EXPERIENCE] +
                    '\nSalary: ' + d[CURRENT_SALARY]
            })
    });


