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

var height_x_bar
var width_x_bar
var margin_x_bar
var innerHeight_x_bar
var innerWidth_x_bar

var height_y_bar
var width_y_bar
var margin_y_bar
var innerHeight_y_bar
var innerWidth_y_bar


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
        //x_bar
        height_x_bar = margin.top
        width_x_bar = innerWidth
        margin_x_bar = {top: height_x_bar * 0.2, bottom: height_x_bar * 0.05, left: width_x_bar * 0.1, right: width_x_bar * 0.1},
        innerHeight_x_bar = height_x_bar - margin_x_bar.top - margin_x_bar.bottom,
        innerWidth_x_bar = width_x_bar,
        //y_bar
        height_y_bar = innerHeight
        width_y_bar = margin.right
        margin_y_bar = {top: height_y_bar * 0.2, bottom: height_y_bar * 0.2, left: width_y_bar * 0.1, right: width_y_bar * 0.1}
        innerHeight_y_bar = height_y_bar,
        innerWidth_y_bar = width_y_bar - margin_y_bar.left - margin_y_bar.right
    }
    static Draw(data){

        let svg_container = d3.select('#' + container)
                            .append('svg').attr('width', width).attr('height', height)
        let svg = svg_container.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`)
        let ind_x = data.ind_x,
            ind_y = data.ind_y,
            value_max = data.value_max,
            value_min = data.value_min,
            value = []
        
        let bar_hour = data.value.map((d) => d3.sum(d)),
            bar_station = []
        
        bar_hour = bar_hour.reverse()

        data.ind_x.forEach((d,i) => {
            let temp = []
            data.ind_y.forEach((v,j) =>{
                temp.push(data.value[j][i])
            })
            bar_station.push(d3.sum(temp))
        })

        let bar_hour_max = d3.max(bar_hour),
            bar_hour_min = d3.min(bar_hour),
            bar_station_max = d3.max(bar_station),
            bar_station_min = d3.min(bar_station)
        
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

        let realXaxis = d3.scaleBand()
            .range([0, innerWidth])
            .domain(ind_x.map((d) => d-2))
            .padding(0.05)

        svg.append('g')
            .attr("transform", `translate(0, ${innerHeight})`)
            .call(d3.axisBottom(realXaxis).tickSize(0))
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
            .html(() => {
                if(typeof(d) == 'object'){
                    return "The exact value of<br>this cell is: " + d.value.toFixed(2)
                }
                else if(typeof(d) == 'number'){
                    return "The exact value of<br>this cell is: " + d.toFixed(2)
                }
            })
            .style("left", (event.x)/4 + "px")
            .style("top", (event.y)/4 + "px")
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

            // x_bar
            let x_scale_x_bar = d3.scaleBand().domain(bar_station.map((d,i) => i)).range([0, innerWidth_x_bar]).padding(0.05),
            y_scale_x_bar = d3.scaleLinear().domain([bar_station_min-5, bar_station_max+5]).range([innerHeight_x_bar, 0]),
            x_bar_color = d3.scaleLinear().domain([bar_station_min-5, bar_station_max+5]).range(["#80ff00", "#ff8040"])


            let svg_x_bar = svg_container.append('g')
                            .attr('transform', `translate(${margin_x_bar.left * 1.25}, ${margin_x_bar.top})`)

            svg_x_bar.selectAll('.bbbar')
                .data(bar_station).enter()
                .append('rect')
                .attr('x', (d,i) => x_scale_x_bar(i))
                .attr('y', (d,i) => y_scale_x_bar(d))
                .attr('width', x_scale_x_bar.bandwidth())
                .attr('height', (d) => innerHeight_x_bar - y_scale_x_bar(d))
                .attr('fill', (d) => x_bar_color(d))
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave)

            // y_bar

            let x_scale_y_bar = d3.scaleLinear().domain([bar_hour_min-5, bar_hour_max+5]).range([innerWidth_y_bar, 0]),
            y_scale_y_bar = d3.scaleBand().domain(bar_hour.map((d,i) => i)).range([0, innerHeight_y_bar]).padding(0.05),
            y_bar_color = d3.scaleLinear().domain([bar_hour_min-5, bar_hour_max+5]).range(["#80ff00", "#ff8040"])

            let svg_y_bar = svg_container.append('g')
            .attr('transform', `translate(${width - margin.right}, ${margin.top})`)


            svg_y_bar.selectAll('.bbbar')
            .data(bar_hour).enter()
            .append('rect')
            .attr('x', 0)
            .attr('y', (d,i) => y_scale_y_bar(i))
            .attr('width', (d,i) => innerWidth_y_bar - x_scale_y_bar(d))
            .attr('height', y_scale_y_bar.bandwidth())
            .attr('fill', (d) => y_bar_color(d))
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)



            let legend_y = svg_container.append('g').append('text')
                .attr('x', -innerHeight / 2 - margin.top)
                .attr('y', margin.left / 2)
                .attr("text-anchor", "start")
                .attr("font-weight", "500")
                .text("Time (hour)")
                .classed("trend-type", true)
                .style("text-anchor", "middle")
                .attr("transform", "rotate(-90)")
                .style('font-weight', 500)
                .style('fill', 'grey')
                .style('font-size', '10px')

            let legend_x = svg_container.append('g').append('text')
                .attr('x', margin.left + innerWidth / 2)
                .attr('y', innerHeight + margin.top + margin.bottom /3)
                .attr("text-anchor", "start")
                .attr("font-weight", "500")
                .text("Station")
                .classed("trend-type", true)
                .style("text-anchor", "middle")
                .style('font-weight', 500)
                .style('fill', 'grey')
                .style('font-size', '10px')

        
        // Add title to graph
        // svg.append("text")
        //         .attr("x", 0)
        //         .attr("y", - tooltipHeight)
        //         .attr("text-anchor", "left")
        //         .style("font-size", "22px")
        //         .text("Heatmap");

        // // Add subtitle to graph
        // svg.append("text")
        //         .attr("x", 0)
        //         .attr("y", - tooltipSubHeight)
        //         .attr("text-anchor", "left")
        //         .style("font-size", "14px")
        //         .style("fill", "grey")
        //         .style("max-width", 400)
        //         .text("A short description of the take-away message of this chart.");
        

    }
}