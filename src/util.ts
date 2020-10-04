import { DataItemType } from "./type";

export const isValid = (data: any): data is DataItemType => {
  if (!(data.name && typeof data.name === "string")) {
    return false;
  }
  if (!(data.age && typeof data.age === "number")) {
    return false;
  }
  return true;
};

export const toNumber = (data: any) => {
  try {
    return Number(data);
  } catch (e) {
    throw new Error("invalid convert");
  }
};
