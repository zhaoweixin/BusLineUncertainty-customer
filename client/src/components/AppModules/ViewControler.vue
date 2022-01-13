<template>
  <Card id="control-card" style="">
    <div style="background: #515A6E;">
      <p slot="title" style="text-align:center; font-weight: 600; font-size: 18px; color: white; padding-top: 8%; padding-bottom: 8%">
        Control Panel
      </p>
    </div>

    <Card id="control-card1" class="control-card-item" >
      
      <p slot="title" style="text-align:left; font-size: 16px; padding: 0px !important">
        <Icon type="ios-albums-outline" />
        Bus Line
      </p>

      <Input v-model="busline" placeholder="Enter bus line to explore..." style="width: 100%; float: center; padding: 10px 0px 10px 0;" />
      <Button class="clickbutton">Explore</Button>

    </Card>

    <!-- <Card id="control-card2" class="control-card-item" >
      <p slot="title" style="text-align:left; font-size: 16px; padding: 0px !important">
        <Icon type="ios-albums-outline" />
        Forecast
      </p>
        <Form :model="formTop" label-position="left">
            <FormItem label="Departure Station">
                <Input v-model="formTop.input1" placeholder="Departure station number"></Input>
            </FormItem>
            <FormItem label="Target Station">
                <Input v-model="formTop.input2" placeholder="Target station number"></Input>
            </FormItem>
            <FormItem label="Departure Time">
                <Input v-model="formTop.input3" placeholder="Departure time XX:XX:XX"></Input>
            </FormItem>
        </Form>
        <Button class="clickbutton">Submit</Button>

    </Card>
    <Card id="control-card3" class="control-card-item" >
      <p slot="title" style="text-align:left; font-size: 16px; padding: 0px !important">
        <Icon type="ios-albums-outline" />
        Station Comparison
      </p>

        <Form :model="formTop" label-position="left">
            <FormItem label="First Station">
                <Input v-model="formTop.input1" placeholder="First station number"></Input>
            </FormItem>
            <FormItem label="Second Station">
                <Input v-model="formTop.input2" placeholder="Second station number"></Input>
            </FormItem>
        </Form>

        <Button class="clickbutton">Submit</Button>
    </Card> -->

    <Card id="control-card4" class="control-card-item" >
      <p slot="title" style="text-align:left; font-size: 16px; padding: 0px !important">
        <Icon type="ios-albums-outline" />
        Running direction
      </p>

      <RadioGroup v-model="border" style="padding: 10px 0">
          <Radio label="UpLine"></Radio>
          <Radio label="DownLine"></Radio>
      </RadioGroup>
    </Card>

    <Card id="busrunningline" class="control-card-item" >
      <p slot="title" style="text-align:left; font-size: 16px; padding: 0px !important">
        <Icon type="ios-albums-outline" />
        Line Information
      </p>
    </Card>

  </Card>
</template>

<script>
import * as d3 from 'd3';

export default {
  name: "App",
  components: {},
  data (){
    return {
      busline: '',
      formTop: {
        input1: '',
        input2: '',
        input3: ''
      },
      border: 'UpLine'
    }
  },
  mounted(){
    this.getbusline_data('31')
  },
  methods:{
    getbusline_data(lineid){
      // let line_31 = ['邻玉小学', '交机技校', '邻玉场', '邻玉场口', '七十三砖厂', '七十三公里', '七十二公里', '七十三公里', '二回寺', '何家坝', '保养场', '两里村', '矿大门', '宪桥', '牛市坎', '桥南', '十五中', '淘米洞', '灯杆山', '宏道堂', '沱江二桥北', '工商大楼', '金井湾', '王氏鞋城']
      //let line_31 = ['Linyu Primary School', 'Jiaoji Technical School', 'Linyu Street', 'Linyu Street Crossing', 'No 73. Brickyard', 'No 73. Street', 'No 72. Street', 'No 73. Street', 'Erhui Temple', 'Hejiaba', 'Baoyangchang', 'Liangli Village', 'Kuangdamen', 'Xian Bridge', 'Niushikan', 'Bridge South', 'No 15. Middle School', 'Taomidong', 'Denggan Mount', 'Hongdaotang', 'Tuojiang Second Bridge North', 'Industrial and Commercial Building', 'Jinjingwan', "Wang Shoe's Market"]
      let line_31 = ['L.Y. Primary School', 'J.J. Technical School', 'L.Y. Street', 'L.Y. Street Crossing', 'No 73. Brickyard', 'No 73. Street', 'No 72. Street', 'No 73. Street', 'E.H. Temple', 'Hejiaba', 'Baoyangchang', 'L.L. Village', 'Kuangdamen', 'Xian Bridge', 'Niushikan', 'Bridge South', 'No 15. Middle School', 'Taomidong', 'D.G. Mount', 'Hongdaotang', 'T.J. 2nd Bridge North', 'I&C Building', 'Jinjingwan', "Wang Shoe's Market"]
      let busline_info = d3.range(line_31.length).map((i) => {
        return {'lineid': lineid,'index': i, 'name': line_31[i], 'color': Math.random() * 10}
      })
      this.drawbusline(busline_info)
    },
    drawbusline(busline){
      let containerid = 'busrunningline',
          parentid = 'control-card',
          broid1 = 'control-card1',
          broid2 = 'control-card4',
          height = document.getElementById(parentid).offsetHeight - 
            document.getElementById(broid1).offsetHeight - 
            document.getElementById(broid2).offsetHeight ,
          width = document.getElementById(parentid).offsetWidth,
          margin = {'left': width* 0.05, 'right': width* 0.05, 'top': height * 0.05, 'bottom': height * 0.1},
          innerHeight = height - margin.top - margin.bottom,
          innerWidth = width - margin.left - margin.right,
          indexmax = Math.max.apply(null, busline.map((d) => {return d.index})),
          indexmin = Math.min.apply(null, busline.map((d) => {return d.index})),
          colormax = Math.max.apply(null, busline.map((d) => {return d.color})),
          colormin = Math.min.apply(null, busline.map((d) => {return d.color})),
          linedata = []
      
      for(let i=1; i<busline.length; i++){
        linedata.push({'y0': busline[i-1].index, 'y1': busline[i].index})
      }
      
      let svg = d3.select('#' + containerid).append('svg')
              .attr('width', innerWidth)
              .attr('height', innerHeight)
              .append('g')
              .attr('transform', `translate(${0},${margin.top})`)

      let yScale = d3.scaleLinear().domain([indexmin, indexmax]).range([0, innerHeight * 0.9]),
          colorScale = d3.scaleLinear().domain([colormin, colormax]).range(['green', 'red'])
      
      let img1=svg.append('g').append('image')
          .attr('xlink:href','http://localhost:8080/static/bus.png')
          .attr('width',20)
          .attr('height',20)
          .attr('x', innerWidth / 4.9)
          .attr('y', -margin.top * 0.6);

      let line = svg.append('g').selectAll('.lline')
        .data(linedata)
        .enter()
        .append('line')
        .attr('x1', innerWidth / 4)
        .attr('y1', d => yScale(d.y0))
        .attr('x2', innerWidth / 4)
        .attr('y2', d => yScale(d.y1))
        .style('fill', 'white')
        .style('stroke-width', 2)
        .style('stroke', 'grey')

      let circle = svg.append('g').selectAll('.ccircle')
        .data(busline)
        .enter()
        .append('circle')
        .attr('cx', innerWidth / 4)
        .attr('cy', (d) => yScale(d.index))
        .attr('r', 2)
        .style('fill', 'white')
        .style('stroke-width', 2)
        .style('stroke', d => colorScale(d.color))

      let text_num = svg.append('g').selectAll('.ttext')
        .data(busline)
        .enter()
        .append('text')
        .attr('x', margin.left * 1.5)
        .attr('y', d => yScale(d.index) + margin.top*0.13)
        .text((d) => d.index)
        .style('fill', 'grey')
        .style('font-size', '12px')

      let text_name = svg.append('g').selectAll('.ttext')
        .data(busline)
        .enter()
        .append('text')
        .attr('x', innerWidth / 3)
        .attr('y', d => yScale(d.index) + margin.top*0.13)
        .text((d) => d.name)
        .style('fill', 'grey')

    }
  }
};
</script>

<style scope>
#control-card {
  width: 13%;
  height: 100%;
  position: relative;
  float: left;
  /* left: 10%; */
  /* left: 0; */
  /* margin: 0.1% ; */
}
#controler {
  width: 100%;
  height: 100%;
}
.clickbutton{
  margin-bottom: 10px;
}
.control-card-item{
  padding: 0 10%;
}
</style>