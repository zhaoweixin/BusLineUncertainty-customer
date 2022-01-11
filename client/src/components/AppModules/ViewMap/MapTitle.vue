<template>
    <div id="MapTitle"></div>
</template>

<script>


import * as d3 from "d3";

export default {
  name: "MapTitle",
  data() {
    return {
    };
  },
  mounted() {
      let divid = 'MapTitle',
          Height = document.getElementById(divid).offsetHeight,
          Width = document.getElementById(divid).offsetWidth,
          margin = {'left': Width* 0.05, 'right': Width* 0.05, 'top': Height * 0.15, 'bottom': Height * 0.15},
          innerHeight = Height - margin.top - margin.bottom,
          innerWidth = Width - margin.left - margin.right,
          tooltipHeight = innerHeight * 0.5,
          tooltipSubHeight = innerHeight * 0.95,
          svg = d3.select('#' + divid).append('svg')
              .attr('width', innerWidth).attr('height', Height)
              .append('g')
              .attr('transform', `translate(${0},${margin.top})`)
        
      svg.append("text")
        .attr("x", 0)
        .attr("y", tooltipHeight)
        .attr("text-anchor", "left")
        .style("font-size", "22px")
        .text("Map Overview & Bus Prediction");

      // Add subtitle to graph
      svg.append("text")
          .attr("x", 0)
          .attr("y", tooltipSubHeight)
          .attr("text-anchor", "left")
          .style("font-size", "14px")
          .style("fill", "grey")
          .text("A short description of the take-away message of this chart.");
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#MapTitle {
  width: 100%;
  height: 6%;
  position: absolute;
  /* float: left; */
  float: left;
}
</style>
