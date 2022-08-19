<template>
  <div class="Home">
    <h2 class="title">
      <span>决策</span>
    </h2>
    <div id="mapMain"></div>
  </div>
</template>

<script>
import AMapLoader from "@amap/amap-jsapi-loader";
export default {
  name: "Home",
  props: {},
  components: {},
  data() {
    return {
      map: null,
    };
  },
  computed: {},
  watch: {},
  methods: {
    initMap() {
      AMapLoader.load({
        key: "a7748709c251dfe29dcd4810de81c1d2",
        version: "2.0",
        plugins: [""],
      })
        .then((AMap) => {
          this.map = new AMap.Map("mapMain", {
            viewMode: "3D",
            zoom: 5,
            center: [105.602725, 37.076636],
          });
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  created() {},
  mounted() {
    this.initMap();
  },
};
</script>

<style scoped lang="less">
.Home {
  width: 100%;
  height: 100%;
  #mapMain {
    padding: 0px;
    margin: 0px;
    width: 100%;
    height: 100%;
    background: #000;
  }
}
</style>
<style>
.amap-copyright,
.amap-logo {
  display: none !important;
}
</style>
