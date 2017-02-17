d3.csv("tw.csv", function(error, links) {

var nodes = {};
var rel = {};

links.forEach(function(link) {
  link.id = "rel" + link.relnum;
  var sLinkSrc = link.source;
  var sLinkTgt = link.target;
  link.source = nodes[link.source] ||
        (nodes[link.source] = {name: link.source, relcnt: 0, srccnt: 0, tgtcnt: 0, image: link.target_image});
  link.target = nodes[link.target] ||
        (nodes[link.target] = {name: link.target, relcnt: 0, srccnt: 0, tgtcnt: 0, image: link.target_image});
  link.relationship = link.relationship;

  if(nodes[sLinkSrc]){
     nodes[sLinkSrc]["relcnt"] = nodes[sLinkSrc]["relcnt"]+1;
     nodes[sLinkSrc]["srccnt"] = nodes[sLinkSrc]["srccnt"]+1;
  }

  if(nodes[sLinkTgt]){
    nodes[sLinkTgt]["relcnt"] = nodes[sLinkTgt]["relcnt"]+1;
    nodes[sLinkTgt]["tgtcnt"] = nodes[sLinkTgt]["tgtcnt"]+1;
  }
});

var width = 1000,
    height = 500;

var force = d3.layout.force()
    .nodes(d3.values(nodes))
    .links(links)
    .size([width, height])
    .linkDistance(350)
    .charge(-800)
    .on("tick", tick)
    .start();

var drag = force.drag().on("dragstart", dragstart);

var svg = d3.select("#graph").append("svg")
    .attr("width", width)
    .attr("height", height);

// build the arrow.
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

// add the links and the arrows
var path = svg.append("svg:g").selectAll("path")
    .data(force.links())
  .enter()
.append("svg:path")
   .attr("id", function(d) { return d.id; } )
    .attr("class", "link")
    .attr("marker-end", "url(#end)");

var mytext = svg.append("svg:g").selectAll("text")
.data(force.links())
.enter()
.append("text")
.attr("dx", "150")
.attr("dy", "-8")
 .append("textPath")
 .attr("xlink:href", function(d) { return "#" + d.id; })
 .attr("style", "fill:magenta; font-weight:bold; font-size:12")
 .text(function(d) { return d.relationship; } );

// define the nodes
var node = svg.selectAll(".node")
    .data(force.nodes())
  .enter().append("g")
    .attr("class", "node")
    .call(force.drag);

// add the nodes
node.append("circle")
    .attr("r", 12)
    .attr("fill", "grey")
   .append("svg:title")
   .text(function(d) { return "Source: " + d.srccnt + " ~ Target: " + d.tgtcnt; });

// add the text
node.append("text")
    .attr("x", 12)
    .attr("dy", ".35em")
    .attr("style", "fill:blue; font-weight:bold; font-size:16")
    .text(function(d) { return d.name; });



node.append("svg:image")
   .attr('x',-9)
   .attr('y',-12)
   .attr('width', 20)
   .attr('height', 24)
   .attr("xlink:href", function(d){
     return d.image;
   })

node.append("text")
   .attr("text-anchor", "middle")
   .attr("style", function(d) {
      if (d.relcnt >= 3) {
         return "font-weight:bold; font-size:12; fill:red"
      } else {
         return "font-weight:bold; font-size:12"
      }
   })
   .text(function(d) { return d.relcnt; });

// add the curvy lines
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

    node
         .attr("transform", function(d) {
             return "translate(" + d.x + "," + d.y + ")"; });
}

function dragstart(d) {
   //d3.select(this).classed("fixed", d.fixed = true);
}

if(error){
   console.log(error);
}else{
   console.log(nodes);
   console.log(links);
   console.log(path);
   console.log(rel);
}
});
