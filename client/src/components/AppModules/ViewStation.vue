<template>
  <Card class="card-busstation">
    <StationTitle></StationTitle>
    <AppStationStats></AppStationStats>
    <AppStationPD></AppStationPD>
  </Card>
</template>

<script>
import StationTitle from './ViewStation/StationTitle';
import AppStationStats from './ViewStation/AppStationStats';
import AppStationPD from "./ViewStation/AppStationPD";

export default {
  name: "AppCompound",
  components: {
    StationTitle,
    AppStationStats,
    AppStationPD
  },
};
</script>

<style scope>
.card-busstation {
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