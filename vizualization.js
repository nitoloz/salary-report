let svg = d3.select("#chart-area")
    .append('svg')
    .attr('width', 1000)
    .attr('height', 1000);


d3.csv('data/salaries-responses.csv')
    .then((data) => {
        let circles = svg.selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr('cx', (d,i) => { return (i%40 * 20);})
            .attr('cy', (d,i) => {return (Math.floor(i/40)+1)*50;})
            .attr('r', d => {return parseInt(d['Текущая ЗП'])/7500;})
            .attr('fill', 'red');
    });


