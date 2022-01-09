<template>
  <Card class="card-busline">
    <AppMap></AppMap>
    <AppRouteStablity></AppRouteStablity>
    <AppRouteStatus></AppRouteStatus>
  </Card>
</template>

<script>

import AppMap from "./AppMap";
import AppRouteStablity from "./AppRouteStablity";
import AppRouteStatus from "./AppRouteStatus";


export default {
  name: "AppCompound",
  components: {
    AppMap,
    AppRouteStablity,
    AppRouteStatus    
  },
};
</script>

<style scope>
.card-busline {
  width: 100%;
  height: 50%;
  /* position: relative; */
  float: left;
  /* left: 10%; */
  /* left: 0; */
  /* margin: 0.1%;
  margin-left: 0; */
  /* background-color: rgb(90, 236, 163); */
}
</style>