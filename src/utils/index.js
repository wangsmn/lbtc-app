import * as echarts from "echarts";
// import "echarts-liquidfill";
// import "echarts-wordcloud";

export const setSize = (num) => {
  var fontSize = document.documentElement.style.fontSize.split("px")[0];
  if (fontSize) {
    const scale = document.documentElement.clientWidth / 750;
    return scale * num;
  } else {
    return num;
  }
};

export const setColor = (a, b, x1 = 0, y1 = 0, x2 = 0, y2 = 1) => {
  return new echarts.graphic.LinearGradient(x1, y1, x2, y2, [
    {
      offset: 0,
      color: a,
    },
    {
      offset: 1,
      color: b,
    },
  ]);
};

const rand = () => (Math.random() * 26 + 10).toFixed(0);
export const creatId = () => {
  const d = new Date().getTime();
  return `chart${d.toString(rand())}${Math.random().toString(rand()).slice(2)}`;
};

export const initLineChart = (data, callBack) => {
  let options = data.options || {};
  const font = {
    color: "#8F9FB3",
    fontSize: setSize(20),
    fontweight: 400,
  };

  let myChart = echarts.getInstanceByDom(document.getElementById(data.id));
  if (myChart == null) {
    myChart = echarts.init(document.getElementById(data.id));
  }
  let option = {
    color: options.color || [
      "#5BB1FC",
      "#FFB461",
      "#7B77F2",
      "#006cff",
      "#5b5b5b",
      "#6ec6c9",
    ],
    title: options.title,
    grid: {
      left: options.left || "4%",
      bottom: options.bottom || setSize(10),
      right: options.right || "1%",
      top: options.top || setSize(140),
      containLabel: true,
    },
    legend: {
      top: 0,
      left: "center",
      icon: "rect",
      itemGap: setSize(20),
      itemWidth: setSize(18),
      itemHeight: setSize(18),
      textStyle: {
        ...font,
      },
      ...options.legend,
    },
    tooltip: {
      trigger: "axis",
      textStyle: {
        ...font,
      },
    },
    xAxis: {
      type: "category",
      data: data.xAxis,
      name: options.xAxisName,
      nameTextStyle: {
        verticalAlign: "bottom",
        padding: [0, 0, setSize(-16), 0],
      },
      axisLabel: {
        ...font,
        formatter: options.axisLabel,
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: "#8F9FB3",
        },
      },
      axisTick: {
        show: false,
      },
    },
    yAxis: [
      {
        type: "value",
        name: options.yAxisName,
        nameGap: setSize(26),
        nameTextStyle: {
          ...font,
          padding: [0, setSize(70), 0, 0],
        },
        axisLabel: {
          ...font,
          formatter: (n) => {
            return n;
          },
        },
        splitLine: {
          lineStyle: {
            width: 1,
            type: "dotted",
            color: "rgba(143, 159, 179, .3)",
          },
        },
      },
      {
        type: "value",
        name: options.unit1,
        nameGap: setSize(36),
        nameTextStyle: {
          ...font,
          padding: [0, 0, 0, setSize(70)],
        },
        axisLabel: {
          ...font,
          formatter: (n) => {
            return n;
          },
        },
        splitLine: {
          lineStyle: {
            width: 1,
            type: "dotted",
            color: "rgba(143, 159, 179, .3)",
          },
        },
      },
    ],
    series: data.series,
  };
  myChart.setOption(option, true);

  window.addEventListener("resize", () => {
    myChart.setOption(option, true);
    myChart.resize();
  });

  if (callBack) {
    myChart.on("legendselectchanged", (params) => {
      callBack(params.name);
    });
  }
};

export const initScatterChart = (data, callBack) => {
  let options = data.options || {};
  const font = {
    color: "#8F9FB3",
    fontSize: setSize(29),
    fontweight: 400,
  };

  let myChart = echarts.getInstanceByDom(document.getElementById(data.id));
  if (myChart == null) {
    myChart = echarts.init(document.getElementById(data.id));
  }
  let option = {
    color: options.color || [
      "rgba(91, 177, 252, 1)",
      "rgba(255, 180, 97, 1)",
      "rgba(248, 97, 97, 1)",
      "#006cff",
      "#5b5b5b",
      "#6ec6c9",
    ],
    title: options.title,
    grid: {
      left: options.left || "2%",
      bottom: options.bottom || setSize(10),
      right: options.right || "4%",
      top: options.top || setSize(100),
      containLabel: true,
    },
    legend: {
      top: 0,
      left: "center",
      icon: "circle",
      itemGap: setSize(35),
      itemWidth: setSize(23),
      itemHeight: setSize(23),
      textStyle: {
        ...font,
      },
      ...options.legend,
    },
    tooltip: {
      trigger: "axis",
      textStyle: {
        ...font,
      },
      formatter: (n) => {
        let str = "";
        n.forEach((item) => {
          str += `<p style="line-height: 2">${item.value[3]}</p><p style="line-height: 1.5">${item.marker}搜索指数: ${item.axisValue}</p><p style="line-height: 1.5">${item.marker}购买指数: ${item.value[1]}</p>`;
        });

        return str;
      },
    },
    xAxis: {
      type: "value",
      name: options.xAxisName,
      nameTextStyle: {
        ...font,
        verticalAlign: "bottom",
        padding: [0, 0, setSize(10), setSize(-150)],
      },
      max: options.xmax,
      axisLabel: {
        ...font,
        formatter: options.axisLabel,
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: "#8F9FB3",
        },
      },
      splitLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
    },
    yAxis: [
      {
        type: "value",
        name: options.unit,
        nameGap: setSize(16),
        nameTextStyle: {
          ...font,
          padding: [0, setSize(-110), 0, 0],
        },
        max: options.ymax,
        axisLabel: {
          ...font,
          formatter: (n) => {
            return n;
          },
        },
        splitLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
      },
    ],
    series: data.series,
  };
  myChart.setOption(option, true);

  window.addEventListener("resize", () => {
    myChart.setOption(option, true);
    myChart.resize();
  });

  if (callBack) {
    myChart.on("legendselectchanged", (params) => {
      callBack(params.name);
    });
  }
};

export const initBarChart = (data) => {
  let options = data.options || {};
  const font = {
    color: "rgba(102, 102, 102, 1)",
    fontSize: setSize(35),
    fontweight: 400,
  };
  let myChart = echarts.getInstanceByDom(document.getElementById(data.id));
  if (myChart == null) {
    myChart = echarts.init(document.getElementById(data.id));
  }
  let option = {
    color: options.color || [
      "#5BB1FC",
      "#FFB461",
      "#7B77F2",
      "#006cff",
      "#5b5b5b",
      "#6ec6c9",
    ],
    title: options.title,
    grid: {
      left: options.left || "2%",
      bottom: options.bottom || setSize(10),
      right: options.right || "1%",
      top: options.top || setSize(80),
      containLabel: true,
    },
    legend: {
      top: 0,
      left: "center",
      icon: "rect",
      itemGap: setSize(35),
      itemWidth: setSize(23),
      itemHeight: setSize(23),
      textStyle: {
        ...font,
      },
      ...options.legend,
    },
    tooltip: {
      trigger: "axis",
      textStyle: {
        ...font,
      },
    },
    xAxis: {
      type: "value",
      name: options.xAxisName,
      nameTextStyle: {
        verticalAlign: "bottom",
        padding: [0, 0, setSize(-16), 0],
      },
      axisLabel: {
        ...font,
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: false,
      },
    },
    yAxis: [
      {
        type: "category",
        name: options.unit,
        nameGap: setSize(36),
        nameTextStyle: {
          ...font,
          padding: [0, setSize(70), 0, 0],
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          ...font,
          formatter: (n) => {
            return n;
          },
        },
        axisLine: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        data: data.xAxis,
      },
    ],
    series: data.series,
  };
  myChart.setOption(option, true);
  window.addEventListener("resize", () => {
    myChart.setOption(option, true);
    myChart.resize();
  });
};

export const initTransverseBarChart = (data, callBack) => {
  let options = data.options || {};
  const font = {
    color: "rgba(102, 102, 102, 1)",
    fontSize: setSize(35),
    fontweight: 400,
  };

  const circle = {
    color: "#fff",
    width: setSize(40),
    height: setSize(40),
    lineHeight: setSize(130),
    fontSize: setSize(29),
    align: "center",
    verticalAlign: "top",
    borderRadius: setSize(40),
  };
  let myChart = echarts.getInstanceByDom(document.getElementById(data.id));
  if (myChart == null) {
    myChart = echarts.init(document.getElementById(data.id));
  }

  let option = {
    color: options.color || [
      "#5BB1FC",
      "#FFB461",
      "#7B77F2",
      "#006cff",
      "#5b5b5b",
      "#6ec6c9",
    ],
    title: options.title,
    grid: {
      left: options.left || "2%",
      bottom: options.bottom || setSize(10),
      right: options.right || "2%",
      top: options.top || setSize(20),
    },
    legend: {
      top: 0,
      left: "center",
      icon: "rect",
      itemGap: setSize(35),
      itemWidth: setSize(23),
      itemHeight: setSize(23),
      textStyle: {
        ...font,
      },
      ...options.legend,
    },
    tooltip: {
      trigger: "axis",
      textStyle: {
        ...font,
      },
    },
    xAxis: {
      type: "value",
      name: options.xAxisName,
      nameTextStyle: {
        verticalAlign: "bottom",
        padding: [0, 0, setSize(-16), 0],
      },
      axisLabel: {
        ...font,
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: false,
      },
    },
    yAxis: [
      {
        type: "category",
        inverse: true,
        offset: setSize(-20),
        position: "left",
        nameTextStyle: {
          ...font,
          padding: [0, setSize(70), 0, 0],
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          align: "left",
          formatter: (n, index) => {
            if (options.hideNum) {
              return `{text|${n}}`;
            }
            let idx = index + 1;
            if (idx <= 5) {
              return `{nt${idx}|${idx}}{text|${n}}`;
            } else {
              return `{nt|${idx}}{text|${n}}`;
            }
          },
          rich: {
            text: {
              color: "rgba(102, 102, 102, 1)",
              align: "left",
              height: setSize(40),
              fontSize: setSize(35),
              padding: [setSize(-90), 0, 0, setSize(17)],
            },
            nt1: {
              backgroundColor: "rgba(248, 97, 97, 1)",
              ...circle,
            },
            nt2: {
              backgroundColor: "rgba(251, 205, 80, 1)",
              ...circle,
            },
            nt3: {
              backgroundColor: "rgba(71, 222, 146, 1)",
              ...circle,
            },
            nt4: {
              backgroundColor: "rgba(24, 239, 242, 1)",
              ...circle,
            },
            nt5: {
              backgroundColor: "rgba(60, 128, 242, 1)",
              ...circle,
            },
            nt: {
              backgroundColor: "rgba(122, 118, 241, 1)",
              ...circle,
            },
          },
        },
        axisLine: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        data: data.xAxis,
      },
      {
        type: "category",
        nameGap: setSize(36),
        inverse: true,
        offset: options.unit ? setSize(-470) : setSize(-430),
        axisTick: {
          show: false,
        },
        axisLabel: {
          formatter: (n) => {
            return `{num|${n}}{unit|${options.unit || ""}}`;
          },
          rich: {
            num: {
              color: "rgba(60, 128, 242, 1)",
              align: "right",
              width: setSize(400),
              verticalAlign: "top",
              lineHeight: setSize(130),
              fontSize: setSize(35),
            },
            unit: {
              color: "rgba(143, 159, 179, 1)",
              align: "right",
              verticalAlign: "top",
              lineHeight: setSize(130),
              fontSize: setSize(30),
              padding: [0, 0, 0, setSize(13)],
            },
          },
        },
        axisLine: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        data: data.series.data,
      },
    ],
    series: data.series,
  };
  myChart.setOption(option, true);
  window.addEventListener("resize", () => {
    myChart.setOption(option, true);
    myChart.resize();
  });
  if (callBack) {
    myChart.on("click", (params) => {
      callBack(params);
    });
  }
};

export const initPieChart = (data, callBack) => {
  let options = data.options || {};
  const font = {
    color: "#8F9FB3",
    fontSize: setSize(29),
    fontweight: 400,
  };
  let myChart = echarts.getInstanceByDom(document.getElementById(data.id));
  if (myChart == null) {
    myChart = echarts.init(document.getElementById(data.id));
  }

  let option = {
    color: options.color || [
      "rgba(11, 139, 251, 1)",
      "rgba(108, 208, 255, 1)",
      "rgba(71, 222, 146, 1)",
      "rgba(255, 180, 97, 1)",
      "rgba(122, 118, 241, 1)",
    ],
    title: [
      {
        left: "center",
        top: options.top || "38%",
        z: 99,
        text: options.total.value + (options.total.unit || ""),
        itemGap: setSize(8),
        textStyle: {
          color: "rgba(60, 128, 242, 1)",
          fontSize: setSize(69),
        },
        subtext: options.total.name,
        subtextStyle: {
          color: "rgba(102, 102, 102, 1)",
          fontSize: setSize(35),
          lineHeight: setSize(40),
        },
      },
    ],
    tooltip: {
      trigger: "item",
      textStyle: {
        ...font,
      },
    },
    series: [
      {
        type: "pie",
        radius: options.radius || ["50%", "72%"],
        center: ["50%", "50%"],
        data: data.series,
        showEmptyCircle: true,
        label: {
          show: options.label,
        },
      },
    ],
  };
  myChart.setOption(option, true);
  callBack(myChart);
  window.addEventListener("resize", () => {
    myChart.setOption(option, true);
    myChart.resize();
  });
};

export const initGaugeChart = (data) => {
  let options = data.options || {};
  const font = {
    color: "rgba(143, 159, 179, 1)",
    fontSize: setSize(29),
    fontweight: 400,
  };

  let myChart = echarts.getInstanceByDom(document.getElementById(data.id));
  if (myChart == null) {
    myChart = echarts.init(document.getElementById(data.id));
  }

  let value = 0;
  if (options.pie) {
    value = data.value >= options.max ? options.max : data.value;
  }
  let option = {
    title: [
      {
        text: data.value,
        top: "40%",
        left: "center",
        itemGap: setSize(6),
        textStyle: {
          fontSize: setSize(80),
          color: "rgba(60, 128, 242, 1)",
          fontWeight: "bold",
        },
        subtext: options.unit,
        subtextStyle: {
          fontSize: setSize(29),
          color: "rgba(102, 102, 102, 1)",
        },
      },
      {
        show: options.pie,
        text: "Y辐射空气吸收\n剂量率均值",
        top: "64%",
        left: "center",
        textStyle: {
          fontSize: setSize(35),
          color: "rgba(102, 102, 102, 1)",
        },
      },
    ],
    series: [
      {
        type: "gauge",
        radius: "88%",
        center: ["50%", "60%"],
        min: options.max ? 50 : 0,
        max: options.max || 300,
        splitNumber: 6,
        startAngle: 210,
        endAngle: -30,
        axisLine: {
          lineStyle: {
            color: [[1, "rgba(80, 144, 255, 1)"]],
            width: 1,
          },
        },
        pointer: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        detail: {
          show: false,
        },
        data: [
          {
            value: data.value,
          },
        ],
      },
      {
        type: "gauge",
        radius: "80%",
        center: ["50%", "60%"],
        min: options.max ? 50 : 0,
        max: options.max || 300,
        splitNumber: options.splitNumber || 6,
        startAngle: 210,
        endAngle: -30,
        axisLine: {
          lineStyle: {
            width: setSize(50),
            color: [
              [1 / 6, "rgba(98, 240, 98, 1)"],
              [2 / 6, "rgba(246, 227, 65, 1)"],
              [3 / 6, "rgba(236, 134, 35, 1)"],
              [4 / 6, "rgba(226, 91, 38, 1)"],
              [5 / 6, "rgba(208, 56, 56, 1)"],
              [1, "rgba(208, 19, 50, 1)"],
            ],
          },
        },
        pointer: {
          show: !options.pie || false,
          // offsetCenter: ["-20%", 0],
          length: "70%",
          itemStyle: {
            color: "rgba(204, 204, 204, 1)",
          },
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          // show: false,
          distance: setSize(-90),
          length: setSize(16),
          lineStyle: {
            color: "rgba(80, 144, 255, 1)",
            width: 1,
          },
        },
        axisLabel: {
          ...font,
          distance: setSize(-10),
        },
        detail: {
          valueAnimation: true,
          formatter: () => {
            return data.label;
          },
          color: options.color || "inherit",
          fontSize: setSize(40),
          backgroundColor: "rgba(240, 240, 240, 1)",
          borderRadius: setSize(14),
          // padding: [setSize(13), setSize(50)]
          width: setSize(140),
          height: setSize(58),
          offsetCenter: [0, "72%"],
        },
        data: [
          {
            value: data.value,
          },
        ],
      },
    ],
  };

  if (options.pie) {
    option.series[1].axisLine.lineStyle.color = [
      [
        (value - 50) / (options.max - 50),
        new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          {
            offset: 0,
            color: "rgba(72, 167, 73, 1)",
          },
          {
            offset: (value - 50) / (options.max - 50) > 0.5 ? 0.5 : 1,
            color: "rgba(254, 196, 88, 1)",
          },
          {
            offset: 1,
            color: "rgba(232, 82, 83, 1)",
          },
        ]),
      ],
      [1, "rgba(229, 229, 229, 1)"],
    ];
  }

  myChart.setOption(option, true);

  window.addEventListener("resize", () => {
    myChart.setOption(option, true);
    myChart.resize();
  });
};

// export const initLiquidfillChart = (data) => {
//   const font = {
//     color: "rgba(255, 255, 255, 1)",
//     fontSize: setSize(80),
//     fontweight: 400,
//   };

//   let myChart = echarts.getInstanceByDom(document.getElementById(data.id));
//   if (myChart == null) {
//     myChart = echarts.init(document.getElementById(data.id));
//   }
//   let option = {
//     title: {
//       text: "水质指数",
//       bottom: "30%",
//       left: "center",
//       textStyle: {
//         fontSize: setSize(35),
//         color: "rgba(255, 255, 255, 1)",
//       },
//     },
//     series: [
//       {
//         type: "liquidFill",
//         radius: "80%",
//         data: [0.28],
//         label: {
//           color: "#fff",
//           insideColor: "transparent",
//           formatter: () => {
//             return data.value;
//           },
//           textStyle: {
//             ...font,
//             fontWeight: "bold",
//           },
//         },
//         outline: {
//           show: true,
//           borderDistance: 5,
//           itemStyle: {
//             borderColor: "rgba(230, 230, 230, 1)",
//             borderWidth: 1,
//           },
//         },
//         itemStyle: {
//           color: setColor("rgba(69, 159, 247, 1)", "rgba(39, 201, 250, 1)"),
//         },
//         backgroundStyle: {
//           color: "rgba(225, 247, 255, 1)",
//         },
//       },
//     ],
//   };

//   myChart.setOption(option, true);

//   window.addEventListener("resize", () => {
//     myChart.setOption(option, true);
//     myChart.resize();
//   });
// };

// export const initWordcloudChart = (data) => {
//   let myChart = echarts.getInstanceByDom(document.getElementById(data.id));
//   if (myChart == null) {
//     myChart = echarts.init(document.getElementById(data.id));
//   }
//   let option = {
//     tooltip: {
//       show: true,
//       formatter: "{b}: {c}",
//       textStyle: {
//         fontSize: setSize(40),
//       },
//     },
//     series: [
//       {
//         type: "wordCloud",
//         rotationRange: [0, 0],
//         shape: "pentagon ",
//         textPadding: 0,
//         autoSize: {
//           enable: true,
//           minSize: setSize(12),
//         },
//         sizeRange: [setSize(30), setSize(60)],
//         width: "100%",
//         height: "100%",
//         left: "center",
//         gridSize: setSize(80),
//         drawOutOfBound: false,
//         textStyle: {
//           backgroundColor: "rgba(60, 128, 242, 1)",
//           color: "#fff",
//           padding: [setSize(20), setSize(30)],
//           borderRadius: [0, 28, 28, 28],
//         },
//         data: data.data,
//       },
//     ],
//   };

//   myChart.setOption(option, true);

//   window.addEventListener("resize", () => {
//     myChart.setOption(option, true);
//     myChart.resize();
//   });
// };
