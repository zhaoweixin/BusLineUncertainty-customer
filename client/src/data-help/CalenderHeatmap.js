import * as d3 from 'd3'
import { color, scaleImplicit, ticks } from 'd3'

var width
var height
var margin
var innerWidth
var innerHeight
var container
var tooltipHeight
var tooltipSubHeight
//https://www.d3-graph-gallery.com/graph/heatmap_style.html
export default class CalenderHeatmap {
    //河流图 Station Stability View
    //分别对应 时间数组，站点数组和二维结果数组
    static init(con){
        container = con
        width = document.getElementById(container).offsetWidth
        height = document.getElementById(container).offsetHeight
        margin = {top: height * 0.15, bottom: height * 0.2, left: width * 0.1, right: width * 0.1 }
        innerHeight = height - margin.top - margin.bottom
        innerWidth = width - margin.left - margin.right
        tooltipHeight = height * 0.08
        tooltipSubHeight = height * 0.03
        
    }
    static Draw(data){
        let svg = d3.select('#' + container)
            .append('svg').attr('width', width).attr('height', height)
            .append('g').attr('transform', `translate(${margin.left}, ${margin.top})`)
        let ind_x = data.ind_x,
            ind_y = data.ind_y,
            value_max = data.value_max,
            value_min = data.value_min,
            value = []
        
        
        ind_y.forEach((d_y,i) => {
            ind_x.forEach((d_x, j) => {
                value.push({'x': d_x, 'y': d_y, 'value': data.value[i][j]})
            })
        })
        
        
        const table_x = ind_x,
            table_y = ind_y
        
        //计算x轴scale并添加删除轴线的x轴
        const x = d3.scaleBand()
            .range([0, innerWidth])
            .domain(table_x)
            .padding(0.05)
        svg.append('g')
            .attr("transform", `translate(0, ${innerHeight})`)
            .call(d3.axisBottom(x).tickSize(0))
            .select(".domain").remove()
        
        //计算y轴scale
        const y = d3.scaleBand()
            .range([innerHeight, 0])
            .domain(table_y)
            .padding(0.05);
        svg.append("g")
            .call(d3.axisLeft(y).tickSize(0))
            .select(".domain").remove()
        
        //计算color scale
        //-> 待修改为真实颜色
        // const myColor = d3.scaleSequential()
        //     .interpolator(d3.interpolateInferno)
        //     .domain([value_min, value_max])
        
        const myColor = d3.scaleLinear()
            .domain([value_min, value_max])
            .range(["#80ff00", "#ff8040"])
        
        //["#bf4063", "#ff8040", "#80ff00", "#0d8a20"]

        const tooltip = d3.select("#" + container)
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")
            .style('position', 'absolute')
            
        // Three function that change the tooltip when user hover / move / leave a cell
        const mouseover = function(event,d) {
            tooltip
            .style("opacity", 1)
            d3.select(this)
            .style("stroke", "black")
            .style("opacity", 1)
        }
        const mousemove = function(event,d) {
            tooltip
            .html("The exact value of<br>this cell is: " + d.value)
            .style("left", (event.x)/6 + "px")
            .style("top", (event.y)/6 + "px")
        }
        const mouseleave = function(event,d) {
            tooltip
            .style("opacity", 0)
            d3.select(this)
            .style("stroke", "none")
            .style("opacity", 0.8)
        }
        // add the squares
        svg.selectAll()
            .data(value, function(d) {return d.x+':'+d.y;})
            .join("rect")
            .attr("x", function(d) { return x(d.x) })
            .attr("y", function(d) { return y(d.y) })
            .attr("rx", 4)
            .attr("ry", 4)
            .attr("width", x.bandwidth() )
            .attr("height", y.bandwidth() )
            .style("fill", function(d) { return myColor(d.value)} )
            .style("stroke-width", 4)
            .style("stroke", "none")
            .style("opacity", 0.8)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
        
        // Add title to graph
        svg.append("text")
                .attr("x", 0)
                .attr("y", - tooltipHeight)
                .attr("text-anchor", "left")
                .style("font-size", "22px")
                .text("Heatmap");

        // Add subtitle to graph
        svg.append("text")
                .attr("x", 0)
                .attr("y", - tooltipSubHeight)
                .attr("text-anchor", "left")
                .style("font-size", "14px")
                .style("fill", "grey")
                .style("max-width", 400)
                .text("A short description of the take-away message of this chart.");
    }
}