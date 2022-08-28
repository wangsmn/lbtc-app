<template>
  <div id="RealtimeData">
    <h2 class="title">
      <span class="icon left-icon">
        <van-icon name="arrow-left" @click.stop="$router.go(-1)" />
      </span>
      <span>{{ device.name }}</span>
      <span class="icon right-icon">
        <van-icon name="bars" @click.stop="" />
      </span>
    </h2>
    <div class="page-cnotain">
      <section class="card">
        <h4 class="title">实时数据</h4>
        <div class="contain">
          <ul class="device-content" v-if="deviceData.data">
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
                    class="status"
                    :src="
                      require('@/assets/' +
                        (deviceData.data[items.param] ? 'red' : 'green') +
                        '.png')
                    "
                    alt=""
                  />
                </span>
                <span
                  class="value"
                  v-else
                  :style="{ color: deviceData.color[index].color1 }"
                  >{{ deviceData.data[items.param] || "--" }}
                  <i>({{ items.unit }})</i>
                </span>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <section class="card">
        <h4 class="title">实时数据(小时)</h4>
        <div class="contain">
          <div id="hour-chart" class="chart"></div>
        </div>
      </section>
      <section class="card">
        <h4 class="title">告警分析 <van-icon name="bars" @click.stop="" /></h4>
        <div class="contain">
          <div class="choose-date" v-show="false">
            <span>请选择日期</span>
            <van-cell
              readonly
              clickable
              name="calendar"
              :right-icon="require('@/assets/xiala.png')"
              placeholder="开始时间-结束时间"
              :value="policeData.date"
              @click="policeData.show = true"
            />
            <van-calendar
              v-model="policeData.show"
              :max-date="maxDate"
              :min-date="minDate"
              type="single"
              @confirm="policeDataOnConfirm"
              allow-same-day
            />
          </div>
          <!-- <Buttons :data="policeData.btn" @change="changeValue" /> -->
          <Picker :data="policeData.pickerData" @changeValue="changeValue" />
          <div id="police-chart" class="chart" style="height: 6rem"></div>
        </div>
      </section>
      <section class="card">
        <h4 class="title">超标详情</h4>
        <div class="contain">
          <div class="choose-date">
            <span>请选择日期</span>
            <van-cell
              readonly
              clickable
              name="calendar"
              :right-icon="require('@/assets/xiala.png')"
              placeholder="开始时间-结束时间"
              :value="exceedingStandard.date"
              @click="exceedingStandard.show = true"
            />
            <van-calendar
              v-model="exceedingStandard.show"
              :max-date="maxDate"
              :min-date="minDate"
              type="range"
              @confirm="exceedingStandardOnConfirm"
              allow-same-day
            />
          </div>
          <van-empty
            description="暂无数据"
            v-if="
              !exceedingStandard.data || exceedingStandard.data.length === 0
            "
          />
          <div id="exceeding-standard-chart" class="chart"></div>
        </div>
      </section>
      <section class="card">
        <h4 class="title">历史数据</h4>
        <div class="contain">
          <div class="choose-date">
            <span>请选择日期</span>
            <van-cell
              readonly
              clickable
              name="calendar"
              :right-icon="require('@/assets/xiala.png')"
              placeholder="开始时间-结束时间"
              :value="historyData.date"
              @click="historyData.show = true"
            />
            <van-calendar
              v-model="historyData.show"
              :max-date="maxDate"
              :min-date="minDate"
              type="range"
              @confirm="historyDataOnConfirm"
              allow-same-day
            />
          </div>
          <h5 class="des">
            共有<span class="num">{{ historyData.total }}</span
            >条数据
          </h5>
          <van-empty
            description="暂无数据"
            v-if="!historyData.data || historyData.data.length === 0"
          />
          <div class="list" v-else>
            <p class="list-header">
              <span>日期</span>
              <span
                v-for="(item, index) in deviceData.label"
                :key="index"
                v-html="item.name1"
              ></span>
            </p>
            <div class="list-body">
              <ul>
                <li
                  class="list-item"
                  v-for="(item, index) in historyData.data"
                  :key="index"
                >
                  <span>{{ item.environmentData.syncTime }}</span>
                  <span v-for="(n, i) in deviceData.label" :key="i">
                    {{ item.environmentData[n.param] }}
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <van-pagination
            v-model="historyData.currentPage"
            :total-items="historyData.total"
            :show-page-size="3"
            force-ellipses
            @change="historyDataChange"
          />
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
  queryPoliceTypeNum,
  queryPoliceData,
} from "@/api/index";
import { DropdownMenu, DropdownItem, Calendar, Empty } from "vant";
import { initLineChart, setSize, initBarChart } from "@/utils/index";

export default {
  name: "",
  props: {},
  components: {
    [DropdownMenu.name]: DropdownMenu,
    [DropdownItem.name]: DropdownItem,
    [Calendar.name]: Calendar,
    [Empty.name]: Empty,
    Picker,
    Buttons,
  },
  data() {
    return {
      device: null,
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
            name1: "净化器</br>状态",
            param: "data10",
          },
          {
            name: "风机状态",
            name1: "风机</br>状态",
            param: "data9",
          },
          {
            name: "净化器一次电流",
            name1: "净化器</br>电流</br><i>(A)</i>",
            param: "data12",
            unit: "A",
          },
          {
            name: "风机工作电流",
            name1: "风机</br>电流</br><i>(A)</i>",
            param: "data11",
            unit: "A",
          },
          {
            name: "非甲烷总烃瞬时值",
            name1: "非甲烷</br>总烃</br><i>(mg/m3)</i>",
            param: "data3",
            unit: "mg/m3",
          },
          {
            name: "颗粒物浓度瞬时值",
            name1: "颗粒物</br>浓度</br><i>(μg/m3)</i>",
            param: "data2",
            unit: "μg/m3",
          },
          {
            name: "油烟浓度瞬时值",
            name1: "油烟</br>浓度</br><i>(μg/m3)</i>",
            param: "data1",
            unit: "μg/m3",
          },
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
      exceedingStandard: {
        date: this.formatterDate([new Date(), new Date()]),
        show: false,
        currentPage: 1,
        data: null,
      },
      historyData: {
        date: this.formatterDate([new Date(), new Date()]),
        show: false,
        currentPage: 1,
        total: null,
        data: null,
      },
      policeData: {
        date: this.formatterDate(new Date()),
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
        data: {},
        pickerData: {
          flag: false,
          title: "告警",
          value: "",
          data: [],
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
          xAxisName: "时",
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

      if (n.name === "告警") {
        this.policeData.pickerData = {
          ...this.policeData.pickerData,
          ...n,
        };
        this.policeTypeInitChart();
        return;
      }
      this.pickerData = {
        ...this.pickerData,
        ...n,
      };
    },

    policeDataOnConfirm(date) {
      this.policeData.date = this.formatterDate(date);
      this.policeData.show = false;
    },

    // 历史数据
    historyDataOnConfirm(date) {
      console.log(date);
      this.historyData.date = this.formatterDate(date);
      this.historyData.show = false;
      this.queryHistoryDataPageFn();
    },

    // 超标详情
    exceedingStandardOnConfirm(date) {
      this.exceedingStandard.date = this.formatterDate(date);
      this.exceedingStandard.show = false;
      this.queryPoliceDataFn();
    },

    queryPoliceDataFn() {
      let date = this.exceedingStandard.date.split(" 至 ");
      queryPoliceData({
        // zxDeviceMac: this.device.mac,
        zxDeviceMac: "055902202",
        beginTime: "2021-12-01",
        endTime: "2021-12-31",
        //   startTime: date[0] + " 00:00:00",
        // endTime: date[1] + " 59:59:59",
      })
        .then((res) => {
          if (res.rspMsg === "操作成功") {
            let data = res.data;
            console.log(data);
            let seriesArr = [
              {
                name: '总数',
                type: "bar",
                param: 'totalNum',
                data: [],
              },
              {
                name: '报警数',
                type: "bar",
                param: 'policeNum',
                data: [],
              },
              {
                name: '浓度最大值',
                type: "line",
                param: 'max_data',
                data: [],
              },
              {
                name: '浓度最小值',
                type: "line",
                param: 'max_data',
                data: [],
              },
              {
                name: '浓度平均值',
                type: "line",
                param: 'max_data',
                data: [],
              }
            ];
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    formatterDate(date) {
      let flag = date instanceof Array;
      if (!flag) {
        date = [date];
      }
      let year = date[0].getFullYear();
      let month = date[0].getMonth() + 1;
      let dateT = date[0].getDate();
      let year1, month1, dateT1;
      if (date[1]) {
        year1 = date[1].getFullYear();
        month1 = date[1].getMonth() + 1;
        dateT1 = date[1].getDate();
      }
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
      let str = flag
        ? year +
          "-" +
          month +
          "-" +
          dateT +
          " 至 " +
          year1 +
          "-" +
          month1 +
          "-" +
          dateT1
        : year + "-" + month + "-" + dateT;
      return str;
    },

    queryHistoryDataPageFn() {
      let date = this.historyData.date.split(" 至 ");

      queryHistoryDataPage({
        deviceMac: this.device.mac,
        startTime: date[0] + " 00:00:00",
        endTime: date[1] + " 59:59:59",
        page: this.historyData.currentPage,
        dataNum: "10",
      })
        .then((res) => {
          if (res.rspMsg === "操作成功") {
            this.historyData.total = res.data.total;
            this.historyData.data = res.data.list;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    historyDataChange() {
      this.queryHistoryDataPageFn();
    },

    // 告警
    queryPoliceTypeNumFn() {
      queryPoliceTypeNum({
        deviceMac: this.device.mac,
        syncTime: this.policeData.date,
      })
        .then((res) => {
          if (res.rspMsg === "操作成功") {
            let data = res.data;
            this.policeData.data = data;
            this.policeData.pickerData.data = [];
            Object.keys(data).forEach((n) => {
              this.policeData.pickerData.data.push(n);
            });
            this.policeData.pickerData.value =
              this.policeData.pickerData.data[0];
            this.policeTypeInitChart();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 告警
    policeTypeInitChart() {
      let data = this.policeData.data[this.policeData.pickerData.value];
      let xAxis = [],
        seriesData = [];
      data.forEach((n) => {
        xAxis.push(n.timeHour);
        seriesData.push(n.policeNum);
      });

      initLineChart({
        id: "police-chart",
        xAxis,
        series: {
          type: "line",
          data: seriesData,
        },
        options: {
          yAxisName: "件",
          xAxisName: "日",
          top: setSize(50),
        },
      });
    },
  },
  created() {
    console.log(this.$route.query);
    this.device = this.$route.query;
    this.getData(this.device.mac);
    this.queryHistoryDataPageFn();
    this.queryPoliceTypeNumFn();
    this.queryPoliceDataFn();
  },
  mounted() {},
};
</script>

<style scoped lang="less">
#RealtimeData {
  height: 100%;
  .van-pagination {
    transform: scale(0.8);
  }

  .des {
    text-align: center;
    margin-bottom: 4px;
    .num {
      font-size: 16px;
      padding: 0 6px;
      color: rgba(60, 128, 242, 1);
    }
  }
}
</style>
