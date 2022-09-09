import { post } from "@/utils/request.js";

const baseURL = "/api";
// process.env.NODE_ENV === "production" ? "http://zxjc.lbtc.cn:8888" : "/api";

console.log(baseURL);
// 登录
export const userLogin = (data) => post(`${baseURL}/user/login`, data);

// 查看接入单位
export const queryUserByUserId = (data) =>
  post(`${baseURL}/user/queryUserByUserId`, data);

// 根据测点号查询实时数据接口
export const queryDeviceData = (data) =>
  post(`${baseURL}/zx/queryDeviceData`, data);

// 查询每小时油烟数据的最大值和平均值
export const getDeviceDataMA = (data) =>
  post(`${baseURL}/zx/getDeviceDataMA`, data);

// 在线监测设备历史数据查询
export const queryHistoryDataPage = (data) =>
  post(`${baseURL}/zx/queryHistoryDataPage`, data);

// 查询各类型某月每天报警数量(折线图)
export const queryPoliceTypeNum = (data) =>
  post(`${baseURL}/zx/queryPoliceTypeNum`, data);

// 查询特定在线检测设备某段时间的详细超标详情
export const queryPoliceData = (data) =>
  post(`${baseURL}/police/queryPoliceData`, data);

// 查询一段时间内每月超标的在线设备数
export const queryPoliceMonthData = (data) =>
  post(`${baseURL}/police/queryPoliceMonthData`, data);

export const getPoliceNumByType = (data) =>
  post(`${baseURL}/zx/getPoliceNumByType`, data);

// 查询权限下各区域在线监测设备、单位数量接口
export const queryZxDeviceNumByUserId = (data) =>
  post(`${baseURL}/zx/queryZxDeviceNumByUserId`, data);
