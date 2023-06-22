import http from "k6/http";
import { check } from "k6";

export const options = {
  scenarios: {
    open_model: {
      executor: "constant-arrival-rate",
      rate: 1,
      timeUnit: __ENV.TIME_UNIT, // timeUnitごとにrate回のリクエストを投げる
      duration: __ENV.DURATION, // 負荷継続時間
      preAllocatedVUs: 1000, // Virtual Users. 同時並列リクエスト可能数
    },
  },
};

export default function () {
  const params = {
    headers: {
      "x-custom-header": "1",
    },
  };

  const res = http.get(`http://proxy-nginx:8080${__ENV.TARGET_PATH}`, params);
  check(res, {
    "is status 200": (r) => r.status === 200,
    "is status 429": (r) => r.status === 429,
    "is other status": (r) => r.status !== 429 && r.status !== 200,
  });
}
