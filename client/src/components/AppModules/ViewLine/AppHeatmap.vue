<template>
  <Card class="card-heatmap">
    <p slot="title" style="text-align: left" id="heatmap-head">
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
import Stream from '../../../data-help/StreamDraw'
import CalenderHeatmap from '../../../data-help/CalenderHeatmap'

export default {
  name: "AppHeatmap",
  data() {
    return {
      container: 'heatmap'
    };
  },
  mounted() {
    let that = this;
    this.$axios.get('river').then(data=>{
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
  width: 100%;
  height: 31.4%;
  position: absolute;
  /* float: left; */
  float:left;
  top: 68.6%;
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
