console.log("hello");
var margin = {top: 20, right: 80, bottom: 30, left: 80},
    width = 760 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var parseTime = d3.timeParse("%Y");

var x = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    z = d3.scaleOrdinal(d3.schemeCategory10);


var line = d3.line()
    .curve(d3.curveBasis)
    .x(function(d) { return x(parseTime(d.date)); })
    .y(function(d) { return y(d.energy); });
//appends a svg with our determined height and width pluss margins to the html body as 
//well as creates a g group as a child to our svg object and moves that group to the display part of our svg
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    //xScale will handle scaling of time on the x axis so that our
    //x-axis takes in the smallest data and the highest date


    //yscale handles scaling of our domain of our energy consumption values for our 
    //y axis from 0 to our maximum energy consumption value to our already defined range
   

//load in data and run the callback function after succesfully loading it
d3.tsv("BRICSdata.tsv").then(function(data){
    //if(error) throw error;
    data.date = parseTime(data.date);
    for (var i = 1, n = data.columns.length, c; i < n; ++i) data[c = data.columns[i]] = +data[c];
    console.log(data);
    //creates an array of dicts where id is the country and the value is an array of dictionaries with each index equalling the energy and data of the rows below that country/id
    //each country id has a value of the array of energy levels per year
    var cities = data.columns.slice(1).map(function(id) {
        return {
          id: id,
          values: data.map(function(d) {
            return {date: d.date, energy: parseFloat(d[id],10)};
          })
        };
      });

    //array of length 6
    console.log(cities);
    //the range we are going to use for our domain
    console.log(d3.extent(data, function(d) { return d.date; }));
    console.log(d3.extent(data, function(d) { return d.date; })[0])
    console.log(d3.extent(data, function(d) { return d.date; })[1])
    console.log(cities.map(function(c) {return c.id;}));  
    
    //extent returns the max and min date in an array with min as first index and max as second
    //we then modify our scale to have this as our domain of values

    x.domain(d3.extent(data, function(d) { return parseTime(d.date); }));
    
    //gets the min and max of the energy values of the cities
    //it does this by using a callback functionality of d3.max twice. It finds the max value of each cities energy value in the values array
  y.domain([
    d3.min(cities, function(c) { return d3.min(c.values, function(d) { return d.energy; }); }),
    d3.max(cities, function(c) { return d3.max(c.values, function(d) { return d.energy; }); })
  ]);

  z.domain(cities.map(function(c) { return c.id; }));

  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .append("text")
      .attr("transform", "translate( " + (width+ 40) + ",0)")
      .attr("y", 6)
      .attr("dy", "0.51em")
      .attr("fill", "#000")
      .text("year");

/*

      .append("text")
      .attr("transform", "translate( " + (width+ 40) + ",0)")
      .attr("y", 6)
      .attr("dy", "0.51em")
      .attr("fill", "#000")
      .text("year");*/

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("y", -margin.left + 10)
      .attr("x", -height/2 + 25)
      .attr("dy", "0.71em")
      .attr("transform", "rotate(-90)")
      .attr("fill", "#000")
      .text("Million BTU's Per Person");
 

  var city = g.selectAll(".city")
    .data(cities)
    .enter().append("g")
      .attr("class", "city");

  city.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { return z(d.id); });
      

  city.append("text")
      .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(parseTime(d.value.date)) + "," + y(d.value.energy) + ")"; })
      .attr("x", 3)
      .attr("dy", "0.35em")
      .style("font", "10px sans-serif")
      .text(function(d) { return d.id; });
});
