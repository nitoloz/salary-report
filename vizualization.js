let svg = d3.select("#chart-area")
    .append('svg')
    .attr('width', 1000)
    .attr('height', 1000);


d3.csv('data/salaries-responses.csv')
    .then((data) => {
        let salaries = data.map(d => parseInt(d[CURRENT_SALARY]));

        let groupedData = d3.nest()
            .key((d) => { return d[CITY];})
            .rollup((d) => {
                return d.length;})
            .entries(data);

        let radiusScale = d3.scaleLinear()
            .domain([0, d3.max(groupedData,(d)=> {return d.value})])
            .range([5,100]);

        let circles = svg.selectAll('circle')
            .data(groupedData)
            .enter()
            .append('circle')
            .attr('cx', (d,i) => { return (i%40 * 20)+40;})
            .attr('cy', (d,i) => {return (Math.floor(i/40)+1)*50;})
            .attr('r', d => {return radiusScale(parseInt(d.value));})
            .attr('fill', (d,i)=>{
                switch(d.key){
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


