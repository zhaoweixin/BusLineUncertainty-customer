<template>
  <Card class="card-busline">
    <AppRouteStatus></AppRouteStatus>
    <AppRouteStablity></AppRouteStablity>
    <AppHeatmap></AppHeatmap>
  </Card>
</template>

<script>

import AppRouteStatus from "./ViewLine/AppRouteStatus";
import AppRouteStablity from "./ViewLine/AppRouteStablity";
import AppHeatmap from './ViewLine/AppHeatmap';


export default {
  name: "AppCompound",
  components: {
    AppRouteStablity,
    AppRouteStatus,
    AppHeatmap
  },
};
</script>

<style scope>
.card-busline {
  width: 29%;
  height: 100%;
  /* position: relative; */
  float: left;
  /* left: 10%; */
  /* left: 0; */
  /* margin: 0.1%;
  margin-left: 0; */
  /* background-color: rgb(90, 236, 163); */
}
</style>