d3.csv("tw.csv", function(error, links) {

var nodes = {};
links.forEach(function(link) {
  var sLinkSrc = link.source;
  var sLinkTgt = link.target;
  var selfImage = d3.select("#url").text();

  link.source = nodes[link.source] ||
        (nodes[link.source] = {name: link.source, relcnt: 0, srccnt: 0, tgtcnt: 0, image: selfImage});
  link.target = nodes[link.target] ||
        (nodes[link.target] = {name: link.target, relcnt: 0, srccnt: 0, tgtcnt: 0, image: link.target_image});

  if(nodes[sLinkSrc]){
     nodes[sLinkSrc].relcnt++;
     nodes[sLinkSrc].srccnt++;
  }
  if(nodes[sLinkTgt]){
    nodes[sLinkTgt].relcnt++;
    nodes[sLinkTgt].tgtcnt++;
  }
});

var width = 1000,
    height = 500;

var force = d3.layout.force()
    .nodes(d3.values(nodes))
    .links(links)
    .size([width, height])
    .linkDistance(250)
    .charge(-600)
    .on("tick", tick)
    .start();


var drag = force.drag();

var svg = d3.select("#graph").append("svg")
    .attr("width", width)
    .attr("height", height);

svg.append("svg:defs").selectAll("marker")
    .data(["end"])
  .enter().append("svg:marker")
    .attr("id", String)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 22)
    .attr("refY", -1)
    .attr("markerWidth", 8)
    .attr("markerHeight", 8)
    .attr("orient", "auto")
  .append("svg:path")
    .attr("d", "M0,-5L10,0L0,5");

var self = {};
force.nodes().forEach(function(v){
  if(v.srccnt >0){
    self = v;
   }
});
self.x = width/2;
self.y = height/2;

var path = svg.append("svg:g").selectAll("path")
    .data(force.links())
  .enter()
.append("svg:path")
   .attr("id", function(d) { return d.id; } )
    .attr("style", "fill: none; stroke: #666; stroke-width: 1.5px;")
    .attr("marker-end", "url(#end)");

var node = svg.selectAll(".node")
    .data(force.nodes())
  .enter().append("g")
    .attr("class", "node")
    .call(force.drag);

node.append("circle")
    .attr("r", 12)
    .attr("fill", "grey");

node.append("text")
    .attr("x", 12)
    .attr("dy", ".35em")
    .attr("style", "fill:blue; font-weight:bold; font-size:16")
    .text(function(d) { return d.name; });

node.append("svg:image")
   .attr('x',-9)
   .attr('y',-12)
   .attr('width', 20)
   .attr('height', 20)
   .attr("xlink:href", function(d){ return d.image; });

node.append("text")
   .attr("y", -12)
   .attr("text-anchor", "middle")
   .attr("style", "font-weight:bold; font-size:12; fill:red")
   .text(function(d) {
     if(d.relcnt >=2 ){
       return d.relcnt;
     }
   });

function tick() {
  path.attr("d", function(d) {
    var dx = d.target.x - d.source.x,
        dy = d.target.y - d.source.y,
        dr = Math.sqrt(dx * dx + dy * dy);
    return "M" +
        d.source.x + "," +
        d.source.y + "A" +
        dr + "," + dr + " 0 0,1 " +
        d.target.x + "," +
        d.target.y;
  });
  node.attr("transform", function(d) {
    return "translate(" + d.x + "," + d.y + ")";
  });
}

});
