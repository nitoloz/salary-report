const margin = {top: 50, right: 50, bottom: 50, left: 100};
const height = 600;
const width = 1000;

d3.csv('data/salaries-responses.csv')
    .then((data) => {
        data = data.filter(d => parseInt(d[CURRENT_SALARY]) > 0 && parseInt(d[TOTAL_EXPERIENCE]) > 0);
        let salaries = data.map(d => parseInt(d[CURRENT_SALARY]));
        let experience = data.map(d => parseInt(d[TOTAL_EXPERIENCE]));

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
            .range([height - margin.bottom, margin.top])
            .base(100);

        let svg = d3.select("#scatter-chart-area")
            .append('svg')
            .attr('height', height)
            .attr('width', width)
            .append("g");

        //Clippath in order to prevent points from being visible outside of chart area
        //https://developer.mozilla.org/ru/docs/Web/CSS/clip-path
        svg.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", width - margin.left - margin.right)
            .attr("height", height - margin.top - margin.bottom)
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        //Axes setup
        let xAxis = d3.axisBottom(xScale)
            .tickSize(-height + margin.top + margin.bottom)
            .tickSizeOuter(0);

        let gXAxis = svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (height - margin.top) + ")")
            .call(xAxis);

        gXAxis.append('text') // X-axis Label
            .attr('class', 'label')
            .attr('y', -12)
            .attr('x', width - margin.right)
            .attr('dy', '.71em')
            .style('text-anchor', 'end')
            .style('font-size', '12')
            .style('fill', 'black')
            .text('Total experience (years)');

        let yAxis = d3.axisLeft(yScale)
            .ticks(10)
            .tickFormat((d) => {
                return "EUR " + d / 1000 + "K";
            })
            .tickSize(-width + margin.left + margin.right)
            .tickSizeOuter(0);

        let gYAxis = svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + margin.left + ",0)")
            .call(yAxis);

        gYAxis.append('text') // y-axis Label
            .attr('class', 'label')
            .attr('transform', 'rotate(-90)')
            .attr('x', -50)
            .attr('y', 5)
            .attr('dy', '.71em')
            .style('font-size', '12')
            .style('fill', 'black')
            .style('text-anchor', 'end')
            .text('Salary (EUR)');

        //Zoom setup
        let zoom = d3.zoom()
            .scaleExtent([1 / 2, 5])
            .extent([[0, 0], [width, height]])
            .filter(function () {
                return d3.event.type === 'wheel' ? d3.event.ctrlKey : true;
            })
            .on("zoom", zoomed);

        function zoomed() {
            let newXScale = d3.event.transform.rescaleX(xScale);
            let newYScale = d3.event.transform.rescaleY(yScale);
            gXAxis.call(xAxis.scale(newXScale));
            gYAxis.call(yAxis.scale(newYScale));
            circles.data(data)
                .attr('cx', function (d) {
                    return newXScale(parseInt(d[TOTAL_EXPERIENCE]))
                })
                .attr('cy', function (d) {
                    return newYScale(parseInt(d[CURRENT_SALARY]))
                });
        }

        svg.append("rect")
            .attr("width", width - margin.left - margin.right)
            .attr("height", height - margin.top - margin.bottom)
            .style("fill", "none")
            .style("pointer-events", "all")
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
            .call(zoom);

        //Points setup
        let colorScale = d3.scaleOrdinal(d3['schemeAccent']);

        let circlesG = svg.append("g")
            .attr("clip-path", "url(#clip)");

        let circles = circlesG.selectAll('circle')
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
            });

        circles.append('title')
            .text(function (d) {
                return `Position: ${d[POSITION]}
                Total Experience: ${d[TOTAL_EXPERIENCE]}
                Salary 12.2017: ${d[CURRENT_SALARY]}
                Salary 12.2016: ${d[PREVIOUS_SALARY]}
                First EU Salary: ${d[FIRST_EUROPE_SALARY]}
                Company Size: ${d[COMPANY_SIZE]}
                Age: ${d[AGE] || 'no data'}`
            });
    });


