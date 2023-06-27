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
          popper-class="myPopper"
          :popper-append-to-body="false"
          @change="filterFn"
        >
          <el-option
            v-for="item in filterData.options"
            :key="item.label"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
    </el-drawer>

    <section
      class="card"
      v-if="zxDeviceNum"
      style="padding: 0.266667rem 0.16rem 0"
    >
      <h4 class="title">总计</h4>
      <div class="contain">
        <p class="des">
          <span
            >在线数: <i>{{ zxDeviceNum.online }}</i
            ><i class="unit">(个)</i>
          </span>
          <i class="icon-fgx">/</i>
          <span
            >测点数: <i>{{ zxDeviceNum.num }}</i
            ><i class="unit">(个)</i></span
          >
        </p>
        <el-progress
          :text-inside="true"
          :stroke-width="20"
          :percentage="(zxDeviceNum && zxDeviceNum.percentage) || 0"
        >
        </el-progress>
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
              <span class="gray"
                >{{ zxDeviceNum.num - zxDeviceNum.online
                }}<i class="unit">(个)</i></span
              >
              <span>离线数</span>
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
        <Buttons :data="btn" style="padding: 0.1rem 0" @change="pointFilter" />
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
                            (!Number(item[items.param]) ? 'red' : 'green') +
                            '.png')
                        "
                        alt=""
                      />
                    </span>
                    <span
                      class="value"
                      v-else-if="items.name == '风机工作电流'"
                      :style="{ color: deviceData.color[index].color1 }"
                      >{{ item[items.param] || 0 }} <i>({{ items.unit }})</i>
                    </span>
                    <span
                      class="value"
                      v-else
                      :style="{ color: deviceData.color[index].color1 }"
                      >{{ item[items.param] || "-" }} <i>({{ items.unit }})</i>
                    </span>
                  </div>
                </li>
              </ul>
              <section class="card" v-if="item.deviceDcData">
                <h4 class="title">
                  电场数据
                  <span class="sub-des"
                    >电源数量:
                    <i class="value">{{ item.deviceDcData.data.length }}</i
                    >台</span
                  >
                </h4>
                <div>
                  <van-collapse v-model="item.deviceDcData.activeNames">
                    <van-collapse-item
                      :title="'电源:' + n.data1"
                      :name="n.data1"
                      v-for="n in item.deviceDcData.data"
                      :key="n.data1"
                    >
                      <div class="deviceDcDes">
                        <p>
                          <span class="num"
                            >{{ n.data2 }}<i class="unit">(kV)</i></span
                          >
                          <span class="name">二次电压</span>
                        </p>
                        <p>
                          <span class="num"
                            >{{ n.data3 }}<i class="unit">(mA)</i></span
                          >
                          <span class="name">二次电流</span>
                        </p>
                        <p>
                          <span class="num"
                            >{{ n.data4 }}<i class="unit">(W)</i></span
                          >
                          <span class="name">电源输出功率</span>
                        </p>
                        <p>
                          <span class="num"
                            >{{ n.data5 }} <i class="unit">(h)</i></span
                          >
                          <span class="name">累计工作时长</span>
                        </p>
                      </div>
                      <div
                        :class="[
                          'deviceDcStateDes',
                          n.data6 == 1 ? 'openState' : 'closeState',
                        ]"
                      >
                        <div class="icon">
                          <img
                            :src="
                              require(`@/assets/icon-${
                                n.data6 == 1 ? 'open' : 'close'
                              }.png`)
                            "
                            alt=""
                          />
                        </div>
                        <p>
                          <span>保护状态</span>
                          <span :class="['value', { red: n.data7 == 0 }]">{{
                            n.data7 == 0
                              ? "电源保护"
                              : n.data7 == 1
                              ? "正常工作"
                              : "-"
                          }}</span>
                        </p>
                        <p>
                          <span>短路保护</span>
                          <span :class="['value', { red: n.data8 == 1 }]">{{
                            n.data8 == 0
                              ? "未短路"
                              : n.data8 == 1
                              ? "短路保护"
                              : "-"
                          }}</span>
                        </p>
                        <p>
                          <span>超温保护</span>
                          <span :class="['value', { red: n.data9 == 1 }]">{{
                            n.data9 == 0
                              ? "未超温"
                              : n.data9 == 1
                              ? "超温保护"
                              : "-"
                          }}</span>
                        </p>
                        <p>
                          <span>手动模式</span>
                          <span class="value">{{
                            n.data10 == 0
                              ? "自动"
                              : n.data10 == 1
                              ? "手动"
                              : "-"
                          }}</span>
                        </p>
                      </div>
                    </van-collapse-item>
                  </van-collapse>
                </div>
              </section>
            </van-collapse-item>
          </van-collapse>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import Buttons from "@/components/Buttons";
import {
  queryDeviceData,
  queryZxDeviceNumByUserId,
  queryUserLikeCompany,
} from "@/api/index";
import AMapLoader from "@amap/amap-jsapi-loader";
import { Toast, Popover } from "vant";
export default {
  name: "Home",
  props: {},
  components: {
    [Popover.name]: Popover,
    Buttons,
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
            color: "rgba(25, 240, 242, .1)",
            color1: "rgba(25, 240, 242, 1)",
          },
          {
            color: "rgba(136, 201, 157, .1)",
            color1: "rgba(136, 201, 157, 1)",
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

      btn: {
        active: 0,
        title: "是否在线",
        button: [
          {
            name: "在线",
            value: 1,
          },
          {
            name: "离线",
            value: 2,
          },
        ],
      },

      mapMarker: [],

      deviceDcData: {
        data: [],
        activeNames: [],
      },

      x_pi: (3.14159265358979324 * 3000.0) / 180.0,
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
    changePoi(poi) {
      let bd_lat = poi.split(",")[0];
      let bd_lon = poi.split(",")[1];
      let x = Number(bd_lon - 0.006);
      let y = Number(bd_lat - 0.0065);
      let z = Number(
        Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * this.x_pi)
      );
      let theta = Number(Math.atan2(y, x) - 0.000003 * Math.cos(x * this.x_pi));
      bd_lon = Number(z * Math.cos(theta));
      bd_lat = Number(z * Math.sin(theta));
      return [bd_lat, bd_lon];
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
            center: (this.user.longitude &&
              this.changePoi(this.user.longitude)) || [116.42165, 39.89624],
          });

          this.getQueryUserByUserId();
        })
        .catch((e) => {
          console.log(e);
        });
    },

    getQueryUserByUserId() {
      queryUserLikeCompany({
        company: "",
        userId: this.user.id,
        adminstrative: "",
        type: "2",
        pageLimit: 1,
        pageNum: 10000,
        job: "0",
      })
        .then((res) => {
          if (res.rspMsg === "操作成功") {
            if (res.data && res.data.data) {
              const data = res.data.data;
              this.point = data.map((n, i) => {
                let flag = n.zxdevices.some((n) => {
                  return (
                    n.syncTime &&
                    new Date().getTime() -
                      new Date(n.syncTime.replace(/-/g, "/")).getTime() <=
                      1000 * 60 * 60 * 24
                  );
                });

                return {
                  ...n,
                  flag,
                };
              });
              this.filterData.options = data.map((n, index) => {
                return {
                  value: n.longitude || index,
                  label: n.company,
                };
              });

              this.setPoint();
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

    setPoint() {
      this.map.remove(this.mapMarker);
      let arr = this.point.filter((n) => {
        if (this.btn.active == 2) {
          return !n.flag;
        } else if (this.btn.active == 1) {
          return n.flag;
        } else {
          return n;
        }
      });

      arr.forEach((item) => {
        if (item.longitude) {
          let marker = new AMap.Marker({
            position: this.changePoi(item.longitude),
            offset: new AMap.Pixel(-13, -30),
          });

          let markerContent = `<div class="myPoint">
          <img src="${require(`@/assets/icon-company${
            item.flag ? "" : "-offline"
          }.png`)}">
          <span class=${item.flag ? "online" : "offline"}>${item.company}</span>
        </div>`;

          marker.setContent(markerContent);
          marker.setMap(this.map);
          marker.setExtData(item);
          this.mapMarker.push(marker);
          marker.on("click", this.markerClick);
        }
      });
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
                let arr = [];

                Object.keys(res.data).forEach((n) => {
                  if (n.includes("Unit")) {
                    arr.push(res.data[n]);
                  }
                });

                arr.length > 0 &&
                  arr.sort((a, b) => {
                    return a.data1.slice(4) - b.data1.slice(4);
                  });

                res.data.dataS &&
                  this.deviceData.data.push({
                    ...res.data.dataS,
                    deviceName: n.deviceName,
                    deviceDcData:
                      arr.length > 0
                        ? {
                            data: arr,
                            activeNames: [arr[0].data1],
                          }
                        : null,
                  });

                this.activeNames = this.deviceData.data.map((n) => {
                  return n.deviceMac;
                });
              } else {
                // Toast.fail(res.rspMsg);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        });
    },

    filterFn() {
      this.setPoint();
      this.btn.active = "";
      this.drawer = false;
      try {
        let pos = this.changePoi(this.filterData.value);

        this.map.setZoomAndCenter(17, [
          Number(pos[0]) + 0.0007,
          Number(pos[1]),
        ]);
      } catch (error) {
        Toast.fail("所选择定位有误, 请重新其他");
      }
    },

    goPage(n) {
      this.$router.push({
        path: "/RealtimeData",
        query: {
          name: n.deviceName,
          mac: n.deviceMac,
          macArr: JSON.stringify(
            this.deviceData.data.map((n) => {
              return {
                name: n.deviceName,
                mac: n.deviceMac,
              };
            })
          ),
        },
      });
    },

    pointFilter() {
      this.setPoint();
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

  .unit {
    font-size: 12px;
    color: #333;
    padding-left: 4px;
  }

  ::v-deep .el-progress-bar__innerText {
    color: rgb(51, 51, 51);
  }

  .des {
    margin: 4px 0;
    display: flex;
    justify-content: flex-end;

    span {
      i:not(.unit) {
        font-size: 18px;
        color: #409eff;
      }
    }

    .el-progress-bar__innerText {
      font-size: 18px !important;
    }
  }

  .device-list-home {
    display: flex;
    margin-top: 6px;
    padding: 10px 0;
    justify-content: space-around;
    background: rgba(60, 128, 242, 0.1);
    border-radius: 4px;

    & > div {
      display: flex;
      align-items: center;

      img {
        height: 20px;
        margin-right: 8px;
      }

      p {
        display: flex;
        flex-direction: column;
        text-align: center;

        span {
          display: flex;
          align-items: center;
          &:first-child {
            font-size: 18px;
            padding-bottom: 2px;
            color: rgba(60, 128, 242, 1);

            &.red {
              color: red;
            }

            &.gray {
              color: #9e9fa1;
            }

            .unit {
              font-size: 12px;
            }
          }

          &:nth-child(2) {
            white-space: nowrap;
          }
        }
      }
    }
  }

  .card {
    .contain {
      margin-top: -10px;
    }
  }

  #mapMain {
    padding: 0px;
    margin: 0px;
    width: 100%;
    height: calc(100% - 225px);
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

    .card {
      .title {
        font-size: 14px;
      }
    }

    .device-list {
      max-height: 62%;
      overflow-y: auto;
      ::v-deep .van-icon.van-icon-bars {
        font-weight: bold;
        font-size: 18px;
      }
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
    background: rgba(150, 151, 153, 0.6);
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
    &.online {
      background: rgba(60, 128, 242, 0.7);
      box-shadow: 4px 4px 0 0 rgba(60, 128, 242, 0.5);
    }
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

.filterBox {
  .el-select {
    width: 95%;

    .el-input__icon {
      line-height: 1;
    }
  }
}

.myPopper {
  width: 60% !important;

  .el-select-dropdown__item {
    line-height: 1.7;
    white-space: normal;
    height: auto;
    padding: 6px 10px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }

  .el-scrollbar {
    padding-bottom: 10px !important;
  }

  .el-scrollbar__wrap {
    max-height: 400px !important;
  }
}

.icon-fgx {
  padding: 4px 5px 0;
  font-family: none;
}
</style>
