import Farm from "../../model/Farm";

export const getFarm = async () => {
  return await Farm.find().lean();
};