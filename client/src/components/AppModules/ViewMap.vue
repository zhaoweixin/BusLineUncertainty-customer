<template>
  <Card class="card-busline">
    <MapTitle></MapTitle>
    <AppMap></AppMap>
    <AppForecast></AppForecast>
  </Card>
</template>

<script>
import MapTitle from "./ViewMap/MapTitle";
import AppMap from "./ViewMap/AppMap";
import AppForecast from './ViewMap/AppForecast';


export default {
  name: "AppCompound",
  components: {
    MapTitle,
    AppMap,
    AppForecast
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