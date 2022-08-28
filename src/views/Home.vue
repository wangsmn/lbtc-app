<template>
  <div class="Home">
    <h2 class="title">
      <span>首页</span>
      <span class="icon right-icon">
        <van-icon name="search" @click.stop="drawer = true" />
      </span>
    </h2>

    <el-drawer
      title="单位列表"
      :visible.sync="drawer"
      direction="ltr"
      custom-class="myDrawer"
    >
      <div class="filterBox">
        <el-select
          v-model="filterData.value"
          filterable
          placeholder="请选择"
          @change="filterFn"
        >
          <el-option
            v-for="item in filterData.options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
    </el-drawer>

    <div id="mapMain"></div>
    <van-popup
      v-model="popupFlag"
      round
      position="bottom"
      closeable
      :style="{ height: '80%' }"
    >
      <div class="popup-content">
        <h4 class="title">基本信息</h4>
        <div class="list">
          <p v-for="item in list.label" :key="item.param">
            <span class="name">{{ item.name }}:</span>
            <span class="value" v-if="list.data">{{
              list.data[item.param] || "--"
            }}</span>
            <span class="value" v-else>--</span>
          </p>
        </div>
        <h4 class="title" style="margin: 0.3rem 0">在线设备</h4>
        <div class="device-list">
          <van-collapse v-model="activeNames">
            <van-collapse-item
              :title="'设备' + (i + 1) + ': ' + item.deviceName"
              :name="item.deviceMac"
              v-for="(item, i) in deviceData.data"
              :key="item.deviceMac"
              :is-link="false"
            >
              <template #value>
                <div style="color: #3c80f2; font-weight: bold">
                  <van-icon name="bars" @click.stop="goPage(item)" />
                </div>
              </template>
              <ul class="device-content">
                <li
                  v-for="(items, index) in deviceData.label"
                  :key="items.param"
                  :style="{ 'background-color': deviceData.color[index].color }"
                >
                  <img
                    :src="require('@/assets/icon' + (index + 1) + '.png')"
                    alt=""
                  />
                  <div>
                    <span class="name">{{ items.name }}</span>
                    <span v-if="items.name.includes('状态')">
                      <img
                        :src="
                          require('@/assets/' +
                            (item[items.param] ? 'red' : 'green') +
                            '.png')
                        "
                        alt=""
                      />
                    </span>
                    <span
                      class="value"
                      v-else
                      :style="{ color: deviceData.color[index].color1 }"
                      >{{ item[items.param] || "--" }} <i>({{ items.unit }})</i>
                    </span>
                  </div>
                </li>
              </ul>
            </van-collapse-item>
          </van-collapse>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { queryUserByUserId, queryDeviceData } from "@/api/index";
import AMapLoader from "@amap/amap-jsapi-loader";
import { Toast } from "vant";
export default {
  name: "Home",
  props: {},
  components: {},
  data() {
    return {
      map: null,
      point: null,
      popupFlag: false,
      activeNames: [],
      list: {
        data: null,
        label: [
          {
            name: "公司名称",
            param: "company",
          },
          {
            name: "联系人",
            param: "people",
          },
          {
            name: "联系电话",
            param: "telephone",
          },
          {
            name: "地址",
            param: "address",
          },
          {
            name: "最后运维时间",
            param: "data2",
          },
        ],
      },

      deviceNameList: {
        label: [
          {
            name: "设备名称",
            param: "deviceName",
          },
          {
            name: "设备类型",
            param: "deviceType",
          },
          {
            name: "联系电话",
            param: "telephone",
          },
          {
            name: "地址",
            param: "address",
          },
          {
            name: "最后运维时间",
            param: "data2",
          },
        ],
      },

      deviceData: {
        data: [],
        color: [
          {
            color: "rgba(124, 198, 35, .1)",
            color1: "rgba(124, 198, 35, 1)",
          },
          {
            color: "rgba(136, 201, 157, .1)",
            color1: "rgba(136, 201, 157, 1)",
          },
          {
            color: "rgba(25, 240, 242, .1)",
            color1: "rgba(25, 240, 242, 1)",
          },
          {
            color: "rgba(62, 184, 180, .1)",
            color1: "rgba(62, 184, 180, 1)",
          },
          {
            color: "rgba(58, 130, 240, .1)",
            color1: "rgba(58, 130, 240, 1)",
          },
          {
            color: "rgba(123, 117, 239, .1)",
            color1: "rgba(123, 117, 239, 1)",
          },
          {
            color: "rgba(109, 208, 255, .1)",
            color1: "rgba(109, 208, 255, 1)",
          },
        ],
        label: [
          {
            name: "净化器状态",
            param: "data10",
          },
          {
            name: "风机状态",
            param: "data9",
          },
          {
            name: "净化器一次电流",
            param: "data12",
            unit: "A",
          },
          {
            name: "风机工作电流",
            param: "data11",
            unit: "A",
          },
          {
            name: "非甲烷总烃瞬时值",
            param: "data3",
            unit: "mg/m3",
          },
          {
            name: "颗粒物浓度瞬时值",
            param: "data2",
            unit: "μg/m3",
          },
          {
            name: "油烟浓度瞬时值",
            param: "data1",
            unit: "μg/m3",
          },
        ],
      },

      filterData: {
        value: "",
        options: [],
      },

      drawer: false,
    };
  },
  computed: {
    ...mapState(["token", "user"]),
  },
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
            zoom: 10,
            center: this.user.longitude || [116.42165, 39.89624],
          });

          this.getQueryUserByUserId();
        })
        .catch((e) => {
          console.log(e);
        });
    },

    getQueryUserByUserId() {
      queryUserByUserId({
        id: this.user.id,
        type: "1",
        pageLimit: "1",
        pageNum: "1000",
      })
        .then((res) => {
          if (res.rspMsg === "操作成功") {
            if (res.data && res.data.user) {
              const data = res.data.user;
              this.point = data;
              this.filterData.options = data.map((n, index) => {
                return {
                  value: n.longitude || index,
                  label: n.company,
                };
              });

              console.log(this.filterData.options);
              this.point.forEach((item) => {
                this.setPoint(item);
              });
            }
          } else {
            Toast.fail(res.rspMsg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    setPoint(item) {
      if (!item.longitude) return;
      let marker = new AMap.Marker({
        position: item.longitude.split(","),
        offset: new AMap.Pixel(-13, -30),
      });

      let markerContent = `<div class="myPoint">
          <img src="${require("@/assets/icon-conpany.png")}">
          <span>${item.company}</span>
        </div>`;

      marker.setContent(markerContent);
      marker.setMap(this.map);
      marker.setExtData(item);
      marker.on("click", this.markerClick);
    },

    markerClick(e) {
      const data = e.target.getExtData();
      console.log(data);
      this.popupFlag = true;
      this.list.data = data;
      this.deviceData.data = [];
      data.zxdevices &&
        data.zxdevices.forEach((n) => {
          queryDeviceData({
            deviceMac: n.deviceMac,
            type: "1",
          })
            .then((res) => {
              if (res.rspMsg === "操作成功") {
                res.data.dataS &&
                  this.deviceData.data.push({
                    ...res.data.dataS,
                    deviceName: n.deviceName,
                  });

                this.activeNames = this.deviceData.data.map((n) => {
                  return n.deviceMac;
                });
                // this.activeNames = [this.deviceData.data[0].deviceMac];
                console.log(this.deviceData.data);
              } else {
                Toast.fail(res.rspMsg);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        });
    },

    filterFn() {
      this.drawer = false;

      let pos = this.filterData.value.split(",");
      console.log(pos);

      this.map.setZoomAndCenter(14, [Number(pos[0]) + 0.01, pos[1]]);
    },

    goPage(n) {
      this.$router.push({
        path: "/RealtimeData",
        query: {
          name: n.deviceName,
          mac: n.deviceMac,
        },
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
  position: relative;
  #mapMain {
    padding: 0px;
    margin: 0px;
    width: 100%;
    height: calc(100% - 50px);
  }

  .filterBox {
    position: absolute;
    top: 50px;
    z-index: 9999;
    width: 100%;
    height: 60px;
    background: #fff;
    padding: 10px 0 10px 7px;

    ::v-deep.el-input__inner {
      height: 30px !important;
    }
  }

  .popup-content {
    padding-top: 20px;
    height: 100%;
    .list {
      padding: 0 10px;
      margin-top: 10px;
      p {
        display: flex;
        line-height: 1.8;
        .name {
          width: 100px;
          text-align: right;
        }
        .value {
          color: rgba(60, 128, 242, 1);
          padding-left: 10px;
        }
      }
    }

    .device-list {
      max-height: 60%;
      overflow-y: auto;
    }
  }
}
</style>
<style lang="less">
.amap-copyright,
.amap-logo {
  display: none !important;
}
.van-cell {
  padding: 6px 10px !important;
}

.van-cell__title {
  color: #3c80f2 !important;
}

.van-collapse-item__content {
  padding: 0 10px !important;
}

.myPoint {
  display: flex;
  font-size: 14px;
  position: relative;
  & > img {
    position: absolute;
    z-index: 10;
    width: 40px;
    height: 40px;
  }
  & > span {
    white-space: nowrap;
    background: rgba(150, 151, 153, 0.8);
    box-shadow: 4px 4px 0 0 rgba(150, 151, 153, 0.5);
    display: flex;
    height: 38px;
    position: absolute;
    left: 2px;
    align-items: center;
    color: #fff;
    padding: 0 4px 0 42px;
    top: 2px;
    border-radius: 19px 0 0 19px;
  }
}

.myDrawer {
  border-radius: 0 4px 4px 0;
  width: 70% !important;
  .el-drawer__header {
    padding: 20px 0 20px 5px;
    font-size: 16px;
  }
}
</style>
