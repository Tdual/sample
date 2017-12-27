var width= screen.width;
var height = screen.height;

var x = d3.scale.linear()
    .range([0, width]).nice();

var y = d3.scale.linear()
    .range([height, 0]).nice()




d3.csv("fashion_vec2.csv", function(data) {
    
  data = data.slice(0,3000);
    
    
  data.forEach(function(d) { 
       d.x = +d.x;
       d.y = +d.y;
  });

  var xMax = d3.max(data, function(d) { return d.x; }) * 1.05,
       xMin = d3.min(data, function(d) { return d.x; }),
       xMin = xMin > 0 ? 0 : xMin,
       yMax = d3.max(data, function(d) { return d.y; }) * 1.05,
       yMin = d3.min(data, function(d) { return d.y; }),
       yMin = yMin > 0 ? 0 : yMin;

  x.domain([xMin, xMax]);
  y.domain([yMin, yMax]);

  var zoomBeh = d3.behavior.zoom()
      .x(x)
      .y(y)
      .scaleExtent([0, 500])
      .on("zoom", zoom);

  var svg = d3.select("#scatter")
    .append("svg")
      .attr("width", width)
      .attr("height", height)
    .append("g")
      .call(zoomBeh);

  var objects = svg.append("svg")
      .classed("objects", true)
      .attr("width", width)
      .attr("height", height);

  objects.selectAll(".dot")
      .data(data)
      .enter()
      .append("svg:image")
      .attr('x',-9)
      .attr('y',-12)
      .attr('width', 20)
      .attr('height', 20)
      .classed("dot", true)
      .attr("transform", transform)
      .attr("xlink:href", function(d){ 
          var name = d.vocab.split("/")[2];
          return "https://s3-ap-northeast-1.amazonaws.com/image-recommender/test/"+name; 
      });
 

  function zoom() {
    svg.selectAll(".dot")
        .attr("transform", transform);
  }

  function transform(d) {
    if(d.x && d.y){
        return "translate(" + x(d.x) + "," + y(d.y) + ")";
    }
  }
 
});

