<template>
  <div class="Home">
    <h2 class="title">
      <span>首页</span>
      <span class="icon left-icon">
        <van-icon name="search" @click.stop="drawer = true" />
      </span>
      <span class="icon right-icon">
        <van-popover
          v-model="showPopover"
          trigger="click"
          :actions="actions"
          @select="onSelect"
          placement="bottom-end"
        >
          <template #reference>
            <van-icon name="user-o" />
          </template>
        </van-popover>
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

    <section class="card" v-if="zxDeviceNum">
      <h4 class="title">总计</h4>
      <div class="contain">
        <p class="des">
          <span
            >在线数: <i>{{ zxDeviceNum.online }}</i
            ><i class="unit">(个)</i>
          </span>
          /
          <span
            >总设备: <i>{{ zxDeviceNum.num }}</i
            ><i class="unit">(个)</i></span
          >
        </p>
        <el-progress
          :text-inside="true"
          :stroke-width="20"
          :percentage="(zxDeviceNum && zxDeviceNum.percentage) || 0"
        ></el-progress>
        <div class="device-list-home">
          <div>
            <img :src="require('@/assets/home-icon1.png')" alt="" />
            <p>
              <span>{{ zxDeviceNum.userNum }} <i class="unit">(个)</i> </span>
              <span>单位数</span>
            </p>
          </div>
          <div>
            <img :src="require('@/assets/home-icon2.png')" alt="" />
            <p>
              <span>{{ zxDeviceNum.deviceNum }}<i class="unit">(个)</i></span>
              <span>净化器数量</span>
            </p>
          </div>
          <div>
            <img :src="require('@/assets/home-icon3.png')" alt="" />
            <p>
              <span class="red"
                >{{ zxDeviceNum.policeNum }}<i class="unit">(条)</i></span
              >
              <span>报警数</span>
            </p>
          </div>
        </div>
      </div>
    </section>

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
import { mapState, mapMutations } from "vuex";
import {
  queryUserByUserId,
  queryDeviceData,
  queryZxDeviceNumByUserId,
} from "@/api/index";
import AMapLoader from "@amap/amap-jsapi-loader";
import { Toast, Popover } from "vant";
export default {
  name: "Home",
  props: {},
  components: {
    [Popover.name]: Popover,
  },
  data() {
    return {
      map: null,
      point: null,
      popupFlag: false,
      activeNames: [],
      showPopover: false,
      actions: [{ text: "退出登录" }],
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
      zxDeviceNum: null,
    };
  },
  computed: {
    ...mapState(["token", "user"]),
  },
  watch: {},
  methods: {
    ...mapMutations(["LOGOUT"]),
    onSelect() {
      this.$router.push({ name: "Login" });
      this.LOGOUT();
    },
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
            center: this.user.longitude && this.user.longitude.split(",") || [116.42165, 39.89624],
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

    getQueryZxDeviceNumByUserId() {
      queryZxDeviceNumByUserId({
        userId: this.user.id,
        num: 1,
        type: 3,
      })
        .then((res) => {
          if (res.rspMsg === "操作成功" && res.data && res.data.length > 0) {
            let data = res.data[0];
            this.zxDeviceNum = {
              ...data,
              percentage: +parseFloat(
                (Number(data.online) / Number(data.num)) * 100
              ).toFixed(2),
            };
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

      this.map.setZoomAndCenter(13.4, [
        Number(pos[0]) + 0.015,
        Number(pos[1]) - 0.01,
      ]);
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
    this.getQueryZxDeviceNumByUserId();
  },
};
</script>

<style scoped lang="less">
.Home {
  width: 100%;
  height: 100%;
  position: relative;
  .unit{
    font-size: 12px;
    color: #333;
    padding-left: 4px;
  }
  .des{
    margin: 4px 0;
    display: flex;
    justify-content: flex-end;

    span{
      i:not(.unit){
        font-size: 18px;
        color: #409EFF;
      }
    }

    .el-progress-bar__innerText{
      font-size: 18px !important;
    }
  }

  .device-list-home{
    display: flex;
    margin-top: 6px;
    padding: 10px 0;
    justify-content: space-around;
    background:  rgba(60, 128, 242, .1);

    border-radius: 4px;
    &>div{
      display: flex;
      align-items: center;
      img{
        height: 22px;
        margin-right: 10px;
      }
      p{
        display: flex;
        flex-direction: column;
        text-align: center;

        span{
          &:first-child{
            font-size: 20px;
            // padding-bottom: 10px;
            color: rgba(60, 128, 242, 1);

            &.red{
              color: red;
            }
          }
        }
      }

    }
  }
  .card{

  .contain{
      margin-top: -10px;
    }
  }
  #mapMain {
    padding: 0px;
    margin: 0px;
    width: 100%;
    height: calc(100% - 210px);
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
      max-height: 62%;
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
