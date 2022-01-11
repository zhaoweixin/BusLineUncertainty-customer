<template>
  <div id="container">
    <!-- <AppHeader></AppHeader> -->
    <Header class="header">
      <div class="header-title">
        <h2 >Bus Travel Time Uncertainty Visual Explorer</h2>
        <!-- <p class="sub-title">Comprehensive Assessment Visualization Platform</p> -->
      </div>
    </Header>

    <Content class="content">
      <ViewControler></ViewControler>
      <ViewMap></ViewMap>
      <ViewLine></ViewLine>
      <ViewStation></ViewStation>
    </Content>

    <Footer class="layout-footer-center footer">2019-2022 &copy; TMViz</Footer>

  </div>
</template>

<script>
import ViewControler from "./AppModules/ViewControler";
import ViewMap from "./AppModules/ViewMap";
import ViewLine from "./AppModules/ViewLine";
import ViewStation from "./AppModules/ViewStation";

export default {
  name: "AppLayout",
  data() {
    return {};
  },
  components: {
    ViewControler,
    ViewMap,
    ViewLine,
    ViewStation
    
  },
  mounted() {},
  methods: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#container {
  position: relative;
  /* background-color: #ff0; */
  width: 100%;
  height: 100%;
}

.header{
    /* position: fixed; */
    /* float: left; */
    height: 5%
}

.header-title{
  color:#fff;
  line-height: 60px;
}

.content{
    /* position: inherit; */
    margin: 0;
    height: 92%;
    /* top: 0%; */
}

.footer{
    height: 3%;
    /* background-color: rgb(119, 27, 27); */
    /* bottom: 0; */
    /* margin: 0;  */
    padding: 0;
    line-height: 35px; 
}
</style>
