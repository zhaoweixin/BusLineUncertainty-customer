<template>
  <Card class="card-spd">
    <p slot="title" style="text-align: left">
      <Icon type="ios-ionic-outline" />
      Station Probability Density Detail
    </p>
    <div id="stationPD">
      <div id="stationPDTooltip_box"></div>
      <div id="stationPD1"></div>
      <div id="stationPD2"></div>
      <!-- <CellGroup>
        <Cell title="" v-for="(item, index) in stations" :key="index">
          <div class="SPD" :id="'SPD_' + index"></div>
        </Cell>
      </CellGroup> -->
    </div>
  </Card>
</template>

<script>
import * as d3 from "d3";
export default {
  name: "AppStationPD",
  data() {
    return {
      data: null,
      stations: [],
      station_detail:{},
      container: 'stationPD',
      colors: d3.scaleOrdinal(d3["schemeSet3"]),
    };
  },
  components: {},
  mounted() {
    let that = this;
    this.initToolTipsbox()
    
    this.$axios.get("pdf_data").then((res) => {
      this.stations = Object.keys(res.data)
      this.data = res.data
      this.stations.forEach((station) => {
        let pdf = [],
            hours = Object.keys(that.data[station])
        hours.forEach((hour) => {
          let len = that.data[station][hour]['cdf_x'].length
          for(let i=0; i<len; i++){
            pdf.push({'x': that.data[station][hour]['cdf_x'][i], 'y': that.data[station][hour]['cdf_y'][i]})
          }
        })
        that.station_detail[station] = []
        that.station_detail[station] = pdf
      })
    }).then(()=>{
      let station = 2,
          container = 'stationPD1';
      this.area(station, container)
    });

  },
  methods: {
    initToolTipsbox(){
      let parentContainerId = 'stationPD',
          containerId = 'stationPDTooltip_box',
          toolboxWidth = document.getElementById(parentContainerId).offsetWidth,
          toolboxHeight = document.getElementById(parentContainerId).offsetHeight,
          containerHeight = document.getElementById(containerId).offsetHeight,
          margin = {'left': toolboxWidth* 0.05, 'right': toolboxWidth* 0.05, 'top': containerHeight * 0.15, 'bottom': containerHeight * 0.15}        
      let innerWidth = toolboxWidth - margin.left - margin.right,
          tooltipHeight = toolboxHeight * 0.045,
          tooltipSubHeight = toolboxHeight * 0.095
        // Add title to graph
      
      let svg = d3.select('#' + containerId).append('svg')
                  .attr('width', innerWidth).attr('height', containerHeight)
                  .append('g')
                  .attr('transform', `translate(${margin.left},${margin.top})`)

      svg.append("text")
              .attr("x", 0)
              .attr("y", tooltipHeight)
              .attr("text-anchor", "left")
              .style("font-size", "22px")
              .text("LineGrid");

      // Add subtitle to graph
      svg.append("text")
              .attr("x", 0)
              .attr("y", tooltipSubHeight)
              .attr("text-anchor", "left")
              .style("font-size", "14px")
              .style("fill", "grey")
              .style("max-width", 400)
              .text("A short description of the take-away message of this chart.");
    },
    area(station, container){
      // {x: '06:05:45', y: 0.001}
      let that = this,
          width = document.getElementById(container).offsetWidth,
          height = document.getElementById(container).offsetHeight,
          marginG = {top: height*0.3,  bottom: height*0.3, left: width*0.05, right: width*0.05, transtop: height*0.15},
          innerWidthG = width - marginG.left - marginG.right,
          innerHeightG = height - marginG.top - marginG.bottom,
          pdf = this.station_detail[station],
          pdf_len = pdf.length,
          pdf_min = Math.min.apply(Math, pdf.map(function(o) { return o.y; })),
          pdf_max = Math.max.apply(Math, pdf.map(function(o) { return o.y; })),
          x_scale_min = '2020-01-01 05:30',
          x_scale_max = '2020-01-01 22:00',
          colorrange = ['white', 'red'],
          colorScale = d3.scaleLinear().domain([pdf_min, pdf_max]).range(colorrange);
      // area
      // height 0.2

      //draw area
      //width of area is equal to gradient width
      let marginA = {top: height*0.3,  bottom: height*0.3, left: width*0.05, right: width*0.05, transtop: height*0.2},
          innerWidthA = width - marginA.left - marginA.right,
          innerHeightA = height - marginA.top - marginA.bottom


      let svg1 = d3.select('#' + container).append('svg')
                  .attr('width', innerWidthA)
                  .attr('height', innerHeightA)
                  //.attr('transform', `translate(${marginA.left}, ${marginA.top})`)
                  .style('border', '1px solid blue')
                  .attr('transform', `translate(${marginA.left},${marginA.transtop})`),
          xScale_area = d3.scaleTime().domain([new Date(x_scale_min), new Date(x_scale_max)]).range([0, innerWidthA]),
          yScale_area = d3.scaleLinear().domain([pdf_min, pdf_max]).range([innerHeightA, 0]),
          xAxis_area = d3.axisBottom(xScale_area).ticks(8)
                .tickSize(innerHeightA)
                .tickPadding(8 - innerHeightG),
          yAxis_area = d3.axisRight(yScale_area)
                .ticks(2)
                .tickSize(innerWidthA)
                .tickPadding(8 - innerWidthA)

      let aX = svg1.append("g")
                .attr("class", "zoomAxis")
                .call(xAxis_area);
      let aY = svg1.append("g")
                .attr("class", "zoomAxis")
                .call(yAxis_area);

      let area_generator = d3.area()
          .x((d) => {return xScale_area(new Date('2020-01-01 ' + d.x))})
          .y0(yScale_area(0))
          .y1((d) => {return yScale_area(d.y)})
      let area_graph = svg1.append('path')
              .datum(pdf)
              .attr('fill', '#cce5df')
              .attr('stroke', '#69b3a2')
              .attr('stroke-width', 1.5)
              .attr('d', area_generator)

      //draw color graident
      let svg = d3.select('#' + container).append('svg')
                  .attr('width', innerWidthG)
                  .attr('height', innerHeightG)
                  .attr('transform', `translate(${marginG.left}, ${marginG.transtop})`)
      
      let linearGradient = svg.append('defs').append('linearGradient').attr('id', 'gradient')
                  .attr('x1', "0%")
                  .attr('y1', "50%")
                  .attr('x2', "100%")
                  .attr('y2', "50%")
      
      //gradient start
      let scale_gradient_x = d3.scaleTime().domain([new Date(x_scale_min), new Date(x_scale_max)]).range([0, 1])

      linearGradient.append('stop').attr('offset', 0).attr('stop-color', colorScale(pdf_min))
      for(let i=0; i<pdf_len; i++){
        linearGradient.append('stop').attr('offset', scale_gradient_x(new Date('2020-01-01 ' + pdf[i].x))).attr('stop-color', colorScale(pdf[i].y))
      }
      linearGradient.append('stop').attr('offset', 1).attr('stop-color', colorScale(pdf_min))

      
      let xScale_gradient = d3.scaleTime().domain([new Date(x_scale_min), new Date(x_scale_max)]).range([0, innerWidthG]),
          yScale_gradient = d3.scaleLinear().domain([pdf_min, pdf_max]).range([0, innerHeightG]),
          xAxis_gradient = d3.axisBottom(xScale_gradient).ticks(8)
                .tickSize(innerHeightG)
                .tickPadding(8 - innerHeightG),
          yAxis_gradient = d3.axisRight(yScale_gradient)
                .ticks(2)
                .tickSize(innerWidthG)
                .tickPadding(8 - innerWidthG);
      let view = svg.append('rect')
                .attr("class", "view")
                .attr("x", 0.5)
                .attr("y", 0.5)
                .attr("width", innerWidthG - 1)
                .attr("height", innerHeightG - 1);
      let gX = svg.append("g")
                .attr("class", "zoomAxis")
                .call(xAxis_gradient);
      let gY = svg.append("g")
                .attr("class", "zoomAxis")
                .call(yAxis_gradient);
      

      //parallel


      let zoom_gradient = d3.zoom()
        .scaleExtent([1,5])
        .translateExtent([[0, 0], [innerWidthG, innerHeightG]])
        .on("zoom", zoomed_gradient)

      svg.call(zoom_gradient)
      svg1.call(zoom_gradient)

      function zoomed_gradient(event, d) {
        area_graph.attr("transform", event.transform);
        view.attr("transform", event.transform);

        aX.call(xAxis_area.scale(event.transform.rescaleX(xScale_area)));
        aY.call(yAxis_area.scale(event.transform.rescaleY(yScale_area)));

        gX.call(xAxis_gradient.scale(event.transform.rescaleX(xScale_gradient)));
        gY.call(yAxis_gradient.scale(event.transform.rescaleY(yScale_gradient)));

      }
    
      //https://bl.ocks.org/mbostock/db6b4335bf1662b413e7968910104f0f
      //https://gist.github.com/biovisualize/373c6216b5634327099a
      //https://www.d3-graph-gallery.com/graph/area_basic.html
      //https://github.com/d3/d3-zoom/blob/v3.0.0/README.md#zoom-transforms


      
    },
    test(data, domid, index,station_id) {

      let width = 400;
      let height = 150; //this.$el.offsetHeight;

      // set the dimensions and margins of the graph
      let margin = { top: 20, right: 20, bottom: 20, left: 20 };

      (width = width - margin.left - margin.right),
        (height = height - margin.top - margin.bottom);

      let zoom = d3
        .zoom()
        .scaleExtent([1, 10])
        .extent([
          [margin.left, 0],
          [width - margin.right, height],
        ])
        .translateExtent([
          [margin.left, -Infinity],
          [width - margin.right, Infinity],
        ])
        .on("zoom", zoomed);

      // append the svg object to the body of the page
      let svg = d3
        .select(domid)
        .append("svg")
        // .attr("viewBox", [40, 0, width, height])
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr(
          "transform",
          "translate(" + margin.left * 2 + "," + margin.top + ")"
        );

      svg
        .append("defs")
        .append("clipPath")
        .attr("id", "clip-spd")
        .append("rect")
        .attr("x", 20)
        .attr("width", width - margin.left - margin.right)
        .attr("height", height);

      // let startDateTime = new Date(2021, 1, 1, 0, 0, 0);

      // let data = [...new Array(10)].fill(0).map((d, i) => {
      //   return {
      //     date: new Date(
      //       startDateTime.setMinutes(startDateTime.getMinutes() + 10)
      //     ),
      //     value: Math.random() * 10,
      //   };
      // });

      // let dateExtent = d3.extent(data, (d) => d.date);
      let dateExtent = [
        // new Date(1900, 1, 1, 0, 0, 0),
        d3.timeParse("%H:%M:%S")('05:00:00'),
        // new Date(1900, 1, 2, 0, 0, 0),
        d3.timeParse("%H:%M:%S")('23:00:00'),
      ];
      // let maxValue = d3.max(data, (d) => d.value);

      // add the x Axis
      var x = d3
        .scaleUtc()
        .domain(dateExtent)
        .range([margin.left, width - margin.right]);

      let xAxis = (g, x) =>
        g.attr("transform", `translate(0,${height - margin.bottom})`).call(
          d3.axisBottom(x)
          .tickFormat(d=>d3.timeFormat("%H:%M")(d))
          // .ticks(5)
          //.tickSizeOuter(0)
        );

      // add the y Axis
      var y = d3
        .scaleLinear()
        .range([height - margin.bottom, margin.top])
        .domain([0, 4]);

      let yAxis = (g, y) =>
        g
          .attr("transform", `translate(${margin.left},0)`)
          .call(d3.axisLeft(y).ticks(5))
          //.call((g) => g.select(".domain").remove());

      let gx = svg.append("g").call(xAxis, x);

      let gy = svg.append("g").call(yAxis, y);

      let area = (data, x,y) =>{

        data = [...Array(100)].map((d,i)=>{
          return {
            date:  d3.timeParse("%H:%M:%S")(data.cdf_x[i]),
            value: data.cdf_y[i]
          }
        })
 
       return d3
          .area()
          .curve(d3.curveBasis)
          .x((d,i) => x(d.date))
          .y0(y(0))
          .y1((d,i) => y(d.value))(data);
          
      }

      // data = [...Array(100)].map((d,i)=>{
      //     return {
      //       date:  d3.timeParse("%H:%M:%S")(data['6'].cdf_x[i]),
      //       value: data['6'].cdf_y[i]
      //     }
      // })


      let g = svg
        .append("g")
        .selectAll("g")
        .data(Object.keys(data))
        .join("g")
        .attr("clip-path", "url(#clip-spd)")
        .attr("fill-opacity", 0.7);

        g.append("path")
        // .attr("fill", "#69b3a2")
        .attr("fill", this.colors(index))
        .attr("stroke", "#000")
        .attr("stroke-width", 1)
        .attr("stroke-opacity", 0.3)
        // .attr("stroke-linejoin", "round")
        .attr("d", d=>area(data[d], x,y));


      // let areaPath = svg
      //   .append("g")
      //   .attr("transform", `translate(${margin.left},0)`)
      //   .attr("fill-opacity", 0.7)
      //   .append("path")
      //   .attr("clip-path", "url(#clip)")
      //   // .attr("fill", "#69b3a2")
      //   .attr('fill',this.colors(index))
      //   .attr("stroke", "#000")
      //   .attr("stroke-width", 1)
      //   .attr("stroke-opacity", 0.3)
      //   // .attr("stroke-linejoin", "round")
      //   .attr("d", area(data, x));

      svg.call(zoom);

      svg
        .append("circle")
        .attr("cx", -25)
        .attr("cy", height - 20)
        .attr("r", 4)
        .attr("stroke", "#000")
        .attr("stroke-width", 1)
        .attr("stroke-opacity", 0.3)
        .attr("fill", this.colors(index));

      svg
        .append("text")
        .text("Station "+station_id)
        .attr("x", -height / 2.3)
        .attr("y", -20)
        .classed("trend-type", true)
        .style("text-anchor", "middle")
        .attr("transform", "rotate(-90)");

      function zoomed(event) {
        const xz = event.transform.rescaleX(x);
        const new_y = event.transform.rescaleX(y);
        // areaPath.attr("d", area(data, xz));
        let y_domain = new_y.domain()
        new_y.domain([0,Math.abs(y_domain[1])])
        g.selectAll('path').attr("d", d=>area(data[d], xz,new_y));
        gx.call(xAxis, xz);
        gy.call(yAxis, new_y);
      }
    },
  },
};
</script>

<style scope>
.card-spd {
  width: 100%;
  height: 47%;
  position: absolute;
  /* float: left; */
  float:left;
  top: 53%;
}

.SPD {
  width: 400px;
  height: 130px;
  /* background-color: #0ff; */
}


#stationPD {
  position: absolute;
  /* float: left; */
  width: 100%;
  height: 100%;
  text-align: left;
  /* background-color: #0ff; */
}

#stationPDTooltip_box{
  position:relative;
  float:left;
  width: 100%;
  height: 13%;
  border: 1px solid blue;
}

#stationPD1{
  position:relative;
  float:left;
  width: 100%;
  height: 39%;
  border: 1px solid red;
}

#stationPD2{
  position:relative;
  float:left;
  width: 100%;
  height: 39%;
  border: 1px solid blue;
}

.view {
  fill: url(#gradient);
  stroke-width: 4px;
  stroke: grey;
}

.zoomAxis{
  stroke-dasharray: 6;
  color: black;
  opacity: 0.4;
}

</style>