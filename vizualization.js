let svg = d3.select("#chart-area")
    .append('svg')
    .attr('width', 1000)
    .attr('height', 1000);


d3.csv('data/salaries-responses.csv')
    .then((data) => {
        let salaries = data.map(d => parseInt(d['Текущая ЗП']));
        let radiusScale = d3.scaleLinear()
            .domain([d3.min(salaries), d3.max(salaries)])
            .range([5,20]);

        let circles = svg.selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr('cx', (d,i) => { return (i%40 * 20)+40;})
            .attr('cy', (d,i) => {return (Math.floor(i/40)+1)*50;})
            .attr('r', d => {return radiusScale(parseInt(d['Текущая ЗП']));})
            .attr('fill', (d,i)=>{
                switch(d['Город']){
                    case `München`:
                        return 'blue';
                    case 'Berlin':
                        return 'yellow';
                    case `Frankfurt`:
                        return 'green';
                    default:
                        return 'gray';
                }
            });
    });


