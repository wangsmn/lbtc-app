import { post } from "@/utils/request.js";

const baseURL =
  process.env.NODE_ENV === "production" ? "http://zxjc.lbtc.cn:8888" : "/api";

// 登录
export const userLogin = (data) => post(`${baseURL}/user/login`, data);

// 查看接入单位
export const queryUserByUserId = (data) => post(`${baseURL}/user/queryUserByUserId`, data);

// 根据测点号查询实时数据接口
export const queryDeviceData = (data) => post(`${baseURL}/zx/queryDeviceData`, data);

// 查询每小时油烟数据的最大值和平均值
export const getDeviceDataMA = (data) => post(`${baseURL}/zx/getDeviceDataMA`, data);


// 在线监测设备历史数据查询
export const queryHistoryDataPage = (data) => post(`${baseURL}/zx/queryHistoryDataPage`, data);

// 查询每小时/每天/每月 各类型报警数量信息
export const queryPoliceNumType = (data) => post(`${baseURL}/zx/queryPoliceNumType`, data);


