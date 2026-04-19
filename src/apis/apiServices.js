import { publicAPI } from "./axiosInstance";

export const loginUser = async (data) => {
  const res = await publicAPI.post("/auth/login", data);
  return res.data;
};

export const getQueries = async () => {
  const res = await publicAPI.get("/query");
  return res.data;
};

export const getInterest = async () => {
  const res = await publicAPI.get("/interest");
  return res.data;
};
