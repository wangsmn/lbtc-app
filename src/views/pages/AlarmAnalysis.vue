<template>
  <div id="AlarmAnalysis">
    <h2 class="title">
      <span class="icon left-icon">
        <van-icon name="arrow-left" @click.stop="$router.go(-1)" />
      </span>
      <span>告警分析</span>
      <span class="icon right-icon">
        <van-icon name="home-o" @click.stop="$router.push({ path: '/Home' })" />
      </span>
    </h2>
    <div class="page-contain">
      <section class="card">
        <h4 class="title">超标设备在线数</h4>
        <div class="contain">
          <Picker :data="onlineNumber" @changeValue="changeValue" />
          <div
            id="online-number-chart"
            class="chart"
            style="height: 6rem"
          ></div>
        </div>
      </section>
      <section class="card">
        <h4 class="title">告警分析</h4>
        <div class="contain">
          <div class="choose-date">
            <span>请选择日期</span>
            <van-cell
              readonly
              clickable
              :right-icon="require('@/assets/xiala.png')"
              placeholder="开始时间-结束时间"
              :value="alarmAnalysis.date"
              @click="alarmAnalysis.show = true"
            />
            <van-popup
              v-model="alarmAnalysis.show"
              round
              position="bottom"
              :style="{ height: '60%' }"
            >
              <van-datetime-picker
                v-model="alarmAnalysis.currentDate"
                type="year-month"
                title="选择年月"
                :min-date="minDate"
                :max-date="maxDate"
                :formatter="formatter"
                @confirm="alarmAnalysisOnConfirm"
              />
            </van-popup>
          </div>

          <van-divider
            :style="{
              color: '#3C80F2',
              borderColor: '#3C80F2',
              padding: '0 16px',
            }"
          >
            告警事件次数占比
          </van-divider>
          <div
            id="alarm-analysis-chart"
            class="chart"
            style="height: 6rem"
          ></div>
          <van-divider
            :style="{
              color: '#3C80F2',
              borderColor: '#3C80F2',
              padding: '0 16px',
            }"
          >
            告警月度次数TOP20
          </van-divider>
          <div
            id="alarm-analysis-chart1"
            class="chart"
            style="height: 6rem"
          ></div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Picker from "@/components/Picker";
import { queryPoliceMonthData, getPoliceNumByType } from "@/api/index";
import {
  DropdownMenu,
  DropdownItem,
  DatetimePicker,
  Empty,
  Divider,
} from "vant";
import {
  initLineChart,
  setSize,
  initPieChart,
  initTransverseBarChart,
  setColor,
} from "@/utils/index";

export default {
  name: "AlarmAnalysis",
  components: {
    [DropdownMenu.name]: DropdownMenu,
    [DropdownItem.name]: DropdownItem,
    [DatetimePicker.name]: DatetimePicker,
    [Divider.name]: Divider,
    [Empty.name]: Empty,
    Picker,
  },
  data() {
    let year = new Date().getFullYear(),
      yearArr = [];

    for (var i = 0; i <= 10; i++) {
      yearArr.push(+year - i);
    }
    return {
      maxDate: new Date(),
      minDate: new Date(2010, 0, 1),

      onlineNumber: {
        flag: false,
        title: "年份",
        name: "在线数",
        value: year,
        data: yearArr,
      },
      alarmAnalysis: {
        currentDate: new Date(),
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
      },
    };
  },
  computed: {
    ...mapState(["token", "user"]),
  },
  created() {
    this.queryPoliceMonthDataFn();
    this.getPoliceNumByTypeFn();
  },
  methods: {
    formatter(type, val) {
      if (type === "year") {
        return `${val}年`;
      } else if (type === "month") {
        return `${val}月`;
      }
      return val;
    },
    alarmAnalysisOnConfirm(date) {
      this.alarmAnalysis.date = this.formatterDate(date);
      this.alarmAnalysis.show = false;
      this.getPoliceNumByTypeFn();
    },

    formatterDate(date) {
      let flag = date instanceof Array;
      if (!flag) {
        date = [date];
      }
      let year = date[0].getFullYear();
      let month = date[0].getMonth() + 1;
      if (month < 10) {
        month = "0" + month;
      }
      let str = year + "-" + month;
      return str;
    },
    changeValue(n) {
      console.log(n);

      if (n.name === "年份") {
        this.onlineNumber = {
          ...this.onlineNumber,
          ...n,
        };
        this.queryPoliceMonthDataFn();
        return;
      }
    },

    queryPoliceMonthDataFn() {
      let date = new Date();
      let lastMonth =
        this.onlineNumber.value == date.getFullYear()
          ? date.getMonth() + 1 > 10
            ? date.getMonth()
            : "0" + date.getMonth()
          : "12";
      queryPoliceMonthData({
        beginTime: this.onlineNumber.value + "-01",
        endTime: this.onlineNumber.value + "-" + lastMonth,
      })
        .then((res) => {
          if (res.rspMsg === "操作成功") {
            let data = res.data,
              xAxis = [];

            let series = [
              {
                type: "bar",
                param: "totalNum",
                barWidth: setSize(20),
                label: {
                  show: true,
                  position: "top",
                  textStyle: { color: "#006cff" },
                },
                itemStyle: {
                  color: "#5BB1FC",
                },
                data: [],
              },
            ];

            data.forEach((n) => {
              series[0].data.push(n.num);
              xAxis.push(n.month_time);
            });

            initLineChart({
              id: "online-number-chart",
              xAxis,
              series,
              options: {
                yAxisName: "个",
                top: setSize(60),
                axisLabel: (n) => {
                  let v = n.split(" ");
                  return v[0] + "\n" + v[1];
                },
                tooltip: {
                  formatter: (n) => {
                    let str = `报警日期: ${n[0].name} </br>  ${n[0].marker} 在线检测设备数: ${n[0].value}</br>`;
                    return str;
                  },
                },
              },
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getPoliceNumByTypeFn() {
      getPoliceNumByType({
        userId: this.user.id,
        type: 1,
        startTime: this.alarmAnalysis.date + "-01 00:00:00",
        endTime: this.alarmAnalysis.date + "-31 00:00:00",
        state: 3,
        num: 5,
      })
        .then((res) => {
          if (res.rspMsg === "操作成功") {
            let data = res.data,
              series = [];
            series = data.map((n) => {
              return {
                name: n.policeType,
                value: n.num,
              };
            });
            initPieChart({
              id: "alarm-analysis-chart",
              series,
              options: {
                label: true,
              },
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });

      getPoliceNumByType({
        userId: this.user.id,
        type: 2,
        startTime: this.alarmAnalysis.date + "-01 00:00:00",
        endTime: this.alarmAnalysis.date + "-31 00:00:00",
        state: 3,
        num: 15,
      })
        .then((res) => {
          if (res.rspMsg === "操作成功") {
            let data = res.data,
              xAxis = [],
              nameArr = [],
              series = {
                name: "",
                type: "bar",
                barWidth: setSize(29),
                showBackground: true,
                backgroundStyle: {
                  borderRadius: setSize(14),
                  color: "rgba(242, 244, 247, 1)",
                },
                itemStyle: {
                  borderRadius: setSize(14),
                  color: setColor(
                    "rgba(71, 222, 146, 1)",
                    "rgba(71, 222, 146, 0)",
                    1,
                    0,
                    0,
                    0
                  ),
                },
                data: [],
              };
            series.data = data.map((n) => {
              xAxis.push(n.deviceMac);
              nameArr.push(n.company);
              return n.num;
            });
            initTransverseBarChart({
              id: "alarm-analysis-chart1",
              series,
              xAxis,
              options: {
                nameArr,
              },
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style scoped lang="less">
#AlarmAnalysis {
  height: 100%;
}
</style>
