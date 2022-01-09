<template>
  <Card class="card-busstation">
    <AppOverView></AppOverView>
    <AppHeatmap></AppHeatmap>
    <AppStationPD></AppStationPD>
  </Card>
</template>

<script>

import AppOverView from './AppOverView'
import AppHeatmap from "./AppHeatmap";
import AppStationPD from "./AppStationPD";

export default {
  name: "AppCompound",
  components: {
    AppOverView,
    AppHeatmap,
    AppStationPD
  },
};
</script>

<style scope>
.card-busstation {
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