<template>
  <Card id="control-card" style="">
    <div style="background: #515A6E;">
      <p slot="title" style="text-align:center; font-weight: 600; font-size: 18px; color: white; padding-top: 10px; padding-bottom: 10px">
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

    <Card id="control-card2" class="control-card-item" >
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
    </Card>

  </Card>
</template>

<script>
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
      }
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