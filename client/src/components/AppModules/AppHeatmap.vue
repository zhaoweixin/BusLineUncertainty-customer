<template>
  <Card class="card-heatmap">
    <p slot="title" style="text-align: left">
      <Icon type="ios-bus-outline" />
      Station Stability View
    </p>
    <div id="heatmap"></div>
  </Card>
</template>

<script>
/*
zhong
*/
import Stream from '../../data-help/StreamDraw'
import CalenderHeatmap from '../../data-help/CalenderHeatmap'

export default {
  name: "AppHeatmap",
  data() {
    return {
      container: 'heatmap'
    };
  },
  mounted() {
    let that = this;
    this.$axios.get('http://localhost:8080/static/RIVER.json').then(data=>{
      CalenderHeatmap.init(that.container)
      CalenderHeatmap.Draw(data.data)
    })
  },
  methods: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card-heatmap {
  width: 40%;
  height: 100%;
  position: absolute;
  /* float: left; */
  left: 30%;
  float:left;
}

#heatmap {
  /* position: relative;
  float: left; */
  position: absolute;
  width: 100%;
  height: 100%;
  /* background-color: rgb(130, 125, 131); */
}
</style>
