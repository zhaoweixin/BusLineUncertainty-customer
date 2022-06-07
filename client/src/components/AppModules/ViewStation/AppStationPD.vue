<template>
  <Card class="card-spd">
    <p slot="title" style="text-align: left">
      <Icon type="ios-ionic-outline" />
      Bus Arrival Station Probability
    </p>
    <div id="stationPD">
      <div id="stationPD1"></div>
      <div id="stationPD2"></div>
      <div id="stationPD3"></div>
      <div id="stationPDTooltip_box"></div>
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
      let station1 = 6,
          station2 = 7,
          station3 = 8,
          container1 = 'stationPD1',
          container2 = 'stationPD2',
          container3 = 'stationPD3';
      that.$axios.get("ppf_data").then((ppf_data) => {
        let stations1 = Object.keys(ppf_data.data).slice(4, 5),
            stations2 = Object.keys(ppf_data.data).slice(5, 6),
            stations3 = Object.keys(ppf_data.data).slice(6, 7);

        that.area(station1, container1, ppf_data.data, stations1)
        that.area(station2, container2, ppf_data.data, stations2)
        that.area(station3, container3, ppf_data.data, stations3)
      })
    });
  },
  methods: {
    initToolTipsbox(){
      let parentContainerId = 'stationPD',
          containerId = 'stationPDTooltip_box',
          toolboxWidth = document.getElementById(containerId).offsetWidth,
          toolboxHeight = document.getElementById(containerId).offsetHeight,
          containerHeight = document.getElementById(containerId).offsetHeight,
          margin = {'left': toolboxWidth* 0.05, 'right': toolboxWidth* 0.05, 'top': containerHeight * 0.15, 'bottom': containerHeight * 0.15}        
      let innerWidth = toolboxWidth - margin.left - margin.right,
          innerHeight = toolboxHeight - margin.top - margin.bottom,
          tooltipHeight = toolboxHeight * 0.045,
          tooltipSubHeight = toolboxHeight * 0.095
        // Add title to graph
      
      let svg = d3.select('#' + containerId).append('svg')
                  .attr('width', toolboxWidth).attr('height', containerHeight)
                  .append('g')
                  .attr('transform', `translate(${margin.left},${margin.top})`)
      //explore tips
      svg.append("text")
              .attr("x", 0)
              .attr("y", tooltipSubHeight*0.1)
              .attr("text-anchor", "left")
              .style("font-size", "14px")
              .style("fill", "grey")
              .style("max-width", 500)
              .text("Tips: Cumulative Probability Distribution(CDF) & Probability Distribution(PDF)");


      let table=svg.append('g').append('image')
          .attr('xlink:href','http://localhost:8080/static/legend/table.png')
          .attr('height',containerHeight * 0.7)
          .attr('x', innerWidth / 5)
          .attr('y', tooltipSubHeight);



      // rect color
      let rectColor = ["#bf4063", "#ff8040", "#80ff00", "#0d8a20"]
      
      let legend_g = svg
        .append("g")
        .attr("transform", `translate(${0},${margin.top})`);

      legend_g
        .selectAll(".legend")
        .data(rectColor)
        .enter()
        .append("rect")
        .attr("class", "legend")
        .attr("opacity", 0.7)
        .attr("fill", (d) => d)
        .attr("x", 0)
        .attr("y", (d, i) => i * innerHeight / 4)
        .attr("width", 20)
        .attr("height", 10);

      legend_g
        .selectAll("text")
        .data(['0.01 - 0.25','0.25 - 0.5','0.5 - 0.75','0.75 - 0.99'])
        .join("text")
        .text(d=>d)
        .attr("font-size", 9)
        .attr("x", 30)
        .attr("y", (d, i) => i * innerHeight / 4 + 8)
        .classed("trend-type", true)
        .style("text-anchor", "start")
        .style('fill', 'grey')
        .style('font-weight', '700');
      



      
    },
    area(station, container, ppfdata, ppfstations){
      // {x: '06:05:45', y: 0.001}
      let that = this,
          width = document.getElementById(container).offsetWidth,
          height = document.getElementById(container).offsetHeight,
          pdf = this.station_detail[station],
          pdf_len = pdf.length,
          pdf_min = Math.min.apply(Math, pdf.map(function(o) { return o.y; })),
          pdf_max = Math.max.apply(Math, pdf.map(function(o) { return o.y; })),
          x_scale_min = '2020-01-01 05:30',
          x_scale_max = '2020-01-01 22:00',
          colorrange = ['#FFFFFF', 'green'],
          colorScale = d3.scaleLinear().domain([pdf_min, pdf_max]).range(colorrange);
  

      // area
      // height 0.2

      //draw area
      //width of area is equal to gradient width
      let marginA = {top: height*0.25,  bottom: height*0.5, left: width*0.05, right: width*0.05, transtop: 0},
          innerWidthA = width - marginA.left - marginA.right,
          innerHeightA = height - marginA.top - marginA.bottom

      //draw title
      let title_svg = d3.select('#' + container).append('svg')
                  .attr('width', innerWidthA)
                  .attr('height', innerHeightA*0.4)
                  .attr('transform', `translate(${marginA.left},${marginA.top*0.15})`)
      let realstation = station - 2
          title_svg.append('text')
                  .attr('transform', `translate(${innerWidthA / 2.4},${innerHeightA*0.2})`)
                  .text('Station - ' + realstation)

          title_svg.append('rect')
                  .attr("x", innerWidthA / 2.4 - 15)
                  .attr("y", innerHeightA * 0.08)
                  .attr("width", 10)
                  .attr("height", 10)
                  .style('fill', 'grey')
                  .style('stroke-width', '4')
                  .style('stroke', 'none')
                  .style('opacity', '0.8')

      let legend_svg = d3.select('#' + container).append('svg')
                  .attr('width', marginA.left)
                  .attr('height', height)
                  .attr('transform', `translate(${-innerWidthA},${0})`)
                  .style('position', 'absolute')
            
      //height = 289  -> 100

      let legend_text = ['PDF', 'PDF', 'CDF']
      legend_svg.selectAll('.ttext')
              .data(legend_text).enter()
              .append('text')
              .attr('x', (d,i) => -height / 3 - height / 4.12 * i)
              .attr('y', marginA.left / 1.37)
              .attr("text-anchor", "start")
              .attr("font-weight", "300")
              .text((d) => d)
              .attr("transform", "rotate(-90)")
              .style('font-weight', 500)
              .style('fill', 'grey')
          
      //图形
      //draw area

      let svg_area = d3.select('#' + container).append('svg')
                  .attr('width', innerWidthA)
                  .attr('height', innerHeightA)
                  //.attr('transform', `translate(${marginA.left}, ${marginA.top})`)
                  .style('border', '0.5px solid black')
                  .attr('transform', `translate(${marginA.left},${marginA.transtop})`),
          xScale_area = d3.scaleTime().domain([new Date(x_scale_min), new Date(x_scale_max)]).range([0, innerWidthA]),
          yScale_area = d3.scaleLinear().domain([pdf_min, pdf_max]).range([innerHeightA, 0]),
          xAxis_area = d3.axisBottom(xScale_area).ticks(8)
                .tickSize(innerHeightA)
                .tickPadding(8 - innerHeightA),
          yAxis_area = d3.axisRight(yScale_area)
                .ticks(2)
                .tickSize(innerWidthA)
                .tickPadding(8 - innerWidthA)
      
      //axis X
      let aX = svg_area.append("g")
                .attr("class", "zoomAxis")
                .call(xAxis_area);
      //axis Y
      let aY = svg_area.append("g")
                .attr("class", "zoomAxis")
                .call(yAxis_area);

      let area_generator = d3.area()
          .x((d) => {return xScale_area(new Date('2020-01-01 ' + d.x))})
          .y0(yScale_area(0))
          .y1((d) => {return yScale_area(d.y)})
      let area_graph = svg_area.append('path')
              .datum(pdf)
              .attr("class", "area_graph" + station)
              .attr('fill', '#cce5df')
              .attr('stroke', '#69b3a2')
              .attr('stroke-width', 1.5)
              .attr('d', area_generator)

            // g
            //   .append("text")
            //   .attr("x", innerWidthA / 2.4 - 15 - 30)
            //   .attr("y", innerHeightA * 0.08)
            //   .attr("text-anchor", "start")
            //   .attr("font-weight", "300")
            //   .text("Station")
            //   .classed("trend-type", true)
            //   .attr("transform", "rotate(-90)")
            //   .style('font-weight', 500)
            //   .style('fill', 'grey')
      
      
      //渐变
      //draw color graident
      let marginG = {top: height*0.25,  bottom: height*0.5, left: width*0.05, right: width*0.05, transtop: 0},
          innerWidthG = width - marginG.left - marginG.right,
          innerHeightG = height - marginG.top - marginG.bottom

      let svg_gradient = d3.select('#' + container).append('svg')
                  .attr('width', innerWidthG)
                  .attr('height', innerHeightG)
                  .style('border', '0.5px solid black')
                  .attr('transform', `translate(${marginG.left}, ${marginG.transtop})`)
      let svg_gradient_g = svg_gradient.append('g')

      let linearGradient = svg_gradient_g.append('defs').attr('id', 'ggradient' + station)
                  .append('linearGradient')
                  .attr('id', 'gradient' + station)
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
      let view = svg_gradient_g.append('rect')
                .attr('id', 'vview' + station)
                .attr("x", 0.5)
                .attr("y", 0.5)
                .attr("width", innerWidthG - 1)
                .attr("height", innerHeightG - 1)
                .style('fill', "url(#gradient" + station + ")");
      
      let axis_svg_g = svg_gradient.append('g')
      
      let gX = axis_svg_g.append("g")
                .attr("class", "zoomAxis")
                .call(xAxis_gradient);
      let gY = axis_svg_g.append("g")
                .attr("class", "zoomAxis")
                .call(yAxis_gradient);
      
      
      //parallel cdf
      let marginC = {top: height*0.25,  bottom: height*0.5, left: width*0.05, right: width*0.05, transtop: 0},
          innerWidthC = width - marginC.left - marginC.right,
          innerHeightC = height - marginC.top - marginC.bottom,
          barhight = innerHeightC * 0.8
      
      let svg_cdf = d3.select('#' + container).append('svg')
                  .attr('width', innerWidthC)
                  .attr('height', innerHeightC)
                  .style('border', '0.5px solid black')
                  .attr('transform', `translate(${marginC.left}, ${marginC.transtop})`)
      
      let xScale_cdf = d3.scaleTime().domain([new Date(x_scale_min), new Date(x_scale_max)]).range([0, innerWidthC]),
          yScale_cdf = d3.scaleBand().rangeRound([0, marginC.top])
                        .domain(ppfstations.map((d) => "Station " + d))
                        .padding(0.1),
          xAxis_cdf =  d3.axisBottom(xScale_cdf)
                        .tickSize(innerHeightC)
                        .ticks(8),

          yAxis_cdf = d3.axisRight(yScale_cdf)
                        .tickSize(innerWidthC)
                        .ticks(2)
                        .tickPadding(8 - innerWidthC);
      
      let cX = svg_cdf.append("g")
                .attr("class", "zoomAxis")
                .call(xAxis_cdf)
                
      let cY = svg_cdf.append("g")
                .attr("class", "zoomAxis")
                .call(yAxis_cdf);

      let rectColor = ["#bf4063", "#ff8040", "#80ff00", "#0d8a20"],
          legend = ppfstations;
      
      svg_cdf
        .append("defs")
        .append("clipPath")
        .attr("id", "clipppf")
        .append("rect")
        .attr("x", 20)
        .attr("width", innerWidthC - marginC.left - marginC.right)
        .attr("height", innerHeightC);
  
      let svg_cdf_g = svg_cdf
          .append("g")
          .selectAll("g")
          .data(ppfstations)
          .join("g")
          .attr("clip-path", "url(#clipppf)")
          .attr("opacity", 0.7);
      
      
      svg_cdf_g.append("g")
        .selectAll("g")
        .data((d) =>
          Object.keys(ppfdata[d]).map((s) => {
            return ppfdata[d][s]
              .map((t, i) => {
                return i < ppfdata[d][s].length - 1
                  ? {
                      name: "Station " + d,
                      startTime: new Date("2020-01-01 " + t),
                      endTime: new Date("2020-01-01 " + ppfdata[d][s][i + 1]),
                    }
                  : null;
              })
              .filter((k) => k);
          })
        )
        .join("g")
        .selectAll("rect")
        .data(d =>{
          return d
        })
        .join("rect")
        .attr('class', 'cdf_g' + station)
        .attr("x", (d) => xScale_cdf(d.startTime))
        .attr("y", (d) => (innerHeightC - barhight) / 2)
        // .attr("y", (d) => yScale_cdf(d.name) + yScale_cdf.bandwidth() / 2 - 15)
        .attr("fill", (d, i) => rectColor[i])
        .attr("width", (d) => xScale_cdf(d.endTime) - xScale_cdf(d.startTime))
        .attr("height", barhight)
 

      // zoom related


      let zoom_gradient = function(mes){
        return d3.zoom()
        .scaleExtent([1,5])
        .translateExtent([[0, 0], [innerWidthG, innerHeightG]])
        .on("zoom", (event) => zoomed_gradient(event, mes))
      }

      svg_cdf_g.call(zoom_gradient(station))
      svg_gradient.call(zoom_gradient(station))
      svg_area.call(zoom_gradient(station))

      function zoomed_gradient(event, mes) {
        
        let new_x = event.transform.rescaleX(xScale_area),
            new_y = event.transform.rescaleY(yScale_area),
            old_y_domain_area = yScale_area.domain(),
            old_y_domain_cdf = yScale_cdf.domain(),
            old_y_domain_gradient = yScale_gradient.domain()
            
        let new_y_domain_area = new_y.domain()
            new_y.domain([old_y_domain_area[0], old_y_domain_area[1]])

        let color_x = event.transform.rescaleX(xScale_area);
            color_x.range([0,1])

        // area
        // 先清空

        d3.selectAll(".area_graph" + mes).remove();

        let area_generator = d3.area()
            .x((d) => new_x(new Date('2020-01-01 ' + d.x)))
            .y0(new_y(0))
            .y1((d) => new_y(d.y))
        
        area_graph = svg_area
          .append("path")
          .datum(pdf)
          .attr("class", "area_graph"  + mes)
          .attr("fill", "#cce5df")
          .attr("stroke", "#69b3a2")
          .attr("stroke-width", 1.5)
          .attr("d", area_generator);
        
        // rect
        // 先清空
        d3.selectAll('.cdf_g' + mes).remove();
        //值域替换

        svg_cdf_g.append("g")
          .selectAll("g")
          .data((d) =>
            Object.keys(ppfdata[d]).map((s) => {
              return ppfdata[d][s]
                .map((t, i) => {
                  return i < ppfdata[d][s].length - 1
                    ? {
                        name: "Station " + d,
                        startTime: new Date("2020-01-01 " + t),
                        endTime: new Date("2020-01-01 " + ppfdata[d][s][i + 1]),
                      }
                    : null;
                })
                .filter((k) => k);
            })
          )
          .join("g")
          .selectAll("rect")
          .data(d =>{
            return d
          })
          .join("rect")
          .attr('class', 'cdf_g' + mes)
          .attr("x", (d) => new_x(d.startTime))
          .attr("y", (d) => (innerHeightC - barhight) / 2)
          // .attr("y", (d) => yScale_cdf(d.name) + yScale_cdf.bandwidth() / 2 - 15)
          .attr("fill", (d, i) => rectColor[i])
          .attr("width", (d) => new_x(d.endTime) - new_x(d.startTime))
          .attr("height", barhight)

        // gradient
        // 先清空
        d3.selectAll('#ggradient' + mes).remove();
        d3.selectAll('#vview' + mes).remove();

        linearGradient = svg_gradient_g.append('defs').attr('id', 'ggradient'+ mes)
                  .append('linearGradient')
                  .attr('id', 'gradient' + mes)
                  .attr('x1', "0%")
                  .attr('y1', "50%")
                  .attr('x2', "100%")
                  .attr('y2', "50%")
        
        linearGradient.append('stop')
          .attr('offset', 0)
          .attr('stop-color', colorScale(pdf_min))
        
        //构造渐变
        for(let i=0; i<pdf_len; i++){
          linearGradient.append('stop')
            .attr('offset', color_x(new Date('2020-01-01 ' + pdf[i].x)))
            .attr('stop-color', colorScale(pdf[i].y))
        }

        linearGradient.append('stop')
          .attr('offset', 1)
          .attr('stop-color', colorScale(pdf_min))

        view = svg_gradient_g.append('rect')
                .attr('id', 'vview'+ mes)
                // .attr("class", "view")
                .attr("x", 0.5)
                .attr("y", 0.5)
                .attr("width", innerWidthG - 1)
                .attr("height", innerHeightG - 1)
                .style('fill', "url(#gradient" + mes + ")");



        
        // area_graph.attr("transform", event.transform);
        // view.attr("transform", event.transform);
        // svg_cdf_g.attr("transform", event.transform);


        //坐标轴
        aX.call(xAxis_area.scale(event.transform.rescaleX(xScale_area)));
        // aY.call(yAxis_area.scale(event.transform.rescaleY(yScale_area)));
        gX.call(xAxis_gradient.scale(event.transform.rescaleX(xScale_gradient)));
        // gY.call(yAxis_gradient.scale(event.transform.rescaleY(yScale_gradient)));
        cX.call(xAxis_cdf.scale(event.transform.rescaleX(xScale_cdf)));

      }
    
      //https://bl.ocks.org/mbostock/db6b4335bf1662b413e7968910104f0f
      //https://gist.github.com/biovisualize/373c6216b5634327099a
      //https://www.d3-graph-gallery.com/graph/area_basic.html
      //https://github.com/d3/d3-zoom/blob/v3.0.0/README.md#zoom-transforms


    },
  },
};
</script>

<style scope>
.card-spd {
  width: 100%;
  height: 94%;
  position: absolute;
  /* float: left; */
  float:left;
  top: 6%;
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
  height: 12%;
}

#stationPD1{
  position:relative;
  float:left;
  width: 100%;
  height: 28%;
}

#stationPD2{
  position:relative;
  float:left;
  width: 100%;
  height: 28%;
}

#stationPD3{


  position:relative;
  float:left;
  width: 100%;
  height: 28%;
}

.zoomAxis{
  stroke-dasharray: 6;
  color: black;
  opacity: 0.4;
}

</style>