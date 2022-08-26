<template>
  <div id="RealtimeData">
    <h2 class="title">
      <span>XX</span>
    </h2>
    <div class="page-cnotain">
      <section class="card" v-show="false">
        <h4 class="title">实时数据</h4>
        <div class="contain">
          <ul class="device-content" v-if="deviceData.data"">
            <li
              v-for=" (items, index) in deviceData.label" :key="items.param"
            :style="{ 'background-color': deviceData.color[index].color }">
            <img :src="require('@/assets/icon' + (index + 1) + '.png')" alt="" />
            <div>
              <span class="name">{{ items.name }}</span>
              <span v-if="items.name.includes('状态')">
                <img class="status" :src="
                  require('@/assets/' +
                    (deviceData.data[items.param] ? 'red' : 'green') +
                    '.png')
                " alt="" />
              </span>
              <span class="value" v-else :style="{ color: deviceData.color[index].color1 }">{{
                  deviceData.data[items.param] || "--"
              }} <i>({{ items.unit }})</i>
              </span>
            </div>
            </li>
          </ul>
        </div>
      </section>

      <section class="card" v-show="false">
        <h4 class="title">实时数据(1小时)</h4>
        <div class="contain">
          <!-- <Picker :data="pickerData" @changeValue="changeValue"/> -->
          <div id="hour-chart" class="chart"></div>
        </div>
      </section>
      <section class="card">
        <h4 class="title">告警</h4>
        <div class="contain">
          <div class="choose-date">
            <span>请选择日期</span>
            <van-cell readonly clickable name="calendar" :right-icon="require('@/assets/xiala.png')"
              placeholder="开始时间-结束时间" :value="policeData.date" @click="policeData.show = true" />
            <van-calendar v-model="policeData.show"  :max-date="maxDate"
          :min-date="minDate" type="range" @confirm="onConfirm" allow-same-day />

          </div>
           <!-- <Buttons :data="policeData.btn" @change="changeValue"/> -->
        
           <div id="hour-chart" class="chart"></div>
        </div>
      </section>
      <section class="card">
        <h4 class="title">历史数据</h4>
        <div class="contain">
          <div class="choose-date">
            <span>请选择日期</span>
            <van-cell readonly clickable name="calendar" :right-icon="require('@/assets/xiala.png')"
              placeholder="开始时间-结束时间" :value="historyData.date" @click="historyData.show = true" />
            <van-calendar v-model="historyData.show"  :max-date="maxDate"
          :min-date="minDate" type="range" @confirm="onConfirm" allow-same-day />

          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import Picker from "@/components/Picker";
import Buttons from "@/components/Buttons";
import {
  queryDeviceData,
  getDeviceDataMA,
  queryHistoryDataPage,
  queryPoliceNumType,
} from "@/api/index";
import { DropdownMenu, DropdownItem, Calendar } from "vant";
import { initLineChart, setSize } from "@/utils/index";

export default {
  name: "",
  props: {},
  components: {
    [DropdownMenu.name]: DropdownMenu,
    [DropdownItem.name]: DropdownItem,
    [Calendar.name]: Calendar,
    Picker,
    Buttons,
  },
  data() {
    return {
      mac: null,
      maxDate: new Date(),
      minDate: new Date(new Date().valueOf() - 24 * 60 * 60 * 1000 * 60),
      deviceData: {
        data: null,
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
      pickerData: {
        flag: false,
        title: "",
        value: "油烟最大值",
        data: [
          "油烟最大值",
          "油烟平均值",
          "颗粒物最大值",
          "颗粒物平均值",
          "非甲烷总烃最大值",
          "非甲烷总烃平均值",
        ],
        param: [
          "dataYYM",
          "dataYYA",
          "dataKLWM",
          "dataKLWA",
          "dataFJWZJM",
          "dataFJWZJA",
        ],
      },
      hourData: {
        label: [
          {
            name: "油烟最大值",
            param: "dataYYM",
            data: [],
          },
          {
            name: "油烟平均值",
            param: "dataYYA",
            data: [],
          },
          {
            name: "颗粒物最大值",
            param: "dataKLWM",
            data: [],
          },
          {
            name: "颗粒物平均值",
            param: "dataKLWA",
            data: [],
          },
          {
            name: "非甲烷总烃最大值",
            param: "dataFJWZJM",
            data: [],
          },
          {
            name: "非甲烷总烃平均值",
            param: "dataFJWZJA",
            data: [],
          },
        ],
        data: [],
      },
      historyData: {
        date: this.formatterDate([new Date(), new Date()]),
        show: false,
      },
      policeData: {
        date: this.formatterDate([new Date(), new Date()]),
        show: false,
        btn: {
          button: [
            {
              name: "时",
              value: 1,
            },
            {
              name: "日",
              value: 2,
            },
            {
              name: "月",
              value: 3,
            },
          ],
          name: "告警",
          active: 2,
        },
      },
    };
  },
  watch: {},
  methods: {
    getData(mac) {
      // 实时数据
      queryDeviceData({
        deviceMac: mac,
        type: "1",
      })
        .then((res) => {
          if (res.rspMsg === "操作成功") {
            this.deviceData.data = res.data.dataS;
          }
        })
        .catch((err) => {
          console.log(err);
        });

      // 每小时数据
      getDeviceDataMA({
        zxDeviceMac: mac,
      })
        .then((res) => {
          if (res.rspMsg === "操作成功") {
            this.hourData.data = res.data;
            this.initChart();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    initChart() {
      let xAxis = [];
      this.hourData.data.forEach((n) => {
        xAxis.push(n.hSyncTime.slice(-8));
        this.hourData.label.forEach((v) => {
          v.data.push(n[v.param] || 0);
        });
      });

      let series = this.hourData.label.map((n) => {
        return {
          name: n.name,
          type: "line",
          data: n.data,
        };
      });

      initLineChart({
        id: "hour-chart",
        xAxis,
        series,
        options: {
          yAxisName: "μg/m3",
          top: setSize(150),
          legend: {
            selectedMode: "single",
            selected: {
              油烟最大值: true,
              油烟平均值: false,
              颗粒物最大值: false,
              颗粒物平均值: false,
              非甲烷总烃最大值: false,
              非甲烷总烃平均值: false,
            },
          },
        },
      });
    },

    changeValue(n) {
      console.log(n);

      this.pickerData = {
        ...this.pickerData,
        ...n,
      };
    },

    onConfirm(date) {
      this.historyData.date = this.formatterDate(date);
      this.historyData.show = false;
    },

    formatterDate(date) {
      let year = date[0].getFullYear();
      let month = date[0].getMonth() + 1;
      let dateT = date[0].getDate();
      let year1 = date[1].getFullYear();
      let month1 = date[1].getMonth() + 1;
      let dateT1 = date[1].getDate();
      if (month < 10) {
        month = "0" + month;
      }
      if (month1 < 10) {
        month1 = "0" + month1;
      }
      if (dateT < 10) {
        dateT = "0" + dateT;
      }
      if (dateT1 < 10) {
        dateT1 = "0" + dateT1;
      }
      let str =
        year +
        "-" +
        month +
        "-" +
        dateT +
        " 至 " +
        year1 +
        "-" +
        month1 +
        "-" +
        dateT1;
      return str;
    },

    queryHistoryDataPageFn(mac) {
      let date = this.historyData.date.split(" 至 ");
      console.log(date);

      queryHistoryDataPage({
        deviceMac: "047427208" || mac,
        // startTime: date[0] + " 00:00:00",
        // endTime: date[1] + " 00:00:00",
        startTime: "2021-04-29 15:57:25", //查询开始时间
        endTime: "2021-05-30 15:57:25", //查询结束时间
        page: "1",
        dataNum: "1000",
      })
        .then((res) => {
          if (res.rspMsg === "操作成功") {
            console.log(res);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    queryPoliceNumTypeFn(mac) {
      let date = this.historyData.date.split(" 至 ");
      queryPoliceNumType({
        deviceMac: "048102005",
        // startTime: date[0] + " 00:00:00",
        // endTime: date[1] + " 00:00:00",
        startTime: "2021-04-29  00:00:00", //查询开始时间
        endTime: "2021-05-29  00:00:00", //查询结束时间
        type: this.policeData.btn.active.toString(),
      })
        .then((res) => {
          if (res.rspMsg === "操作成功") {
            console.log(res);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  created() {
    this.mac = this.$route.query.mac;
    this.getData(this.mac);
    // this.queryHistoryDataPageFn(this.mac);
    this.queryPoliceNumTypeFn(this.mac);
  },
  mounted() {},
};
</script>

<style scoped lang="less">
</style>
