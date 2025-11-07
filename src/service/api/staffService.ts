import Staff, { IStaff } from "../../model/Staff";

export const getStaffByFarm = async (farmId: string): Promise<IStaff[]> => {
  return await Staff.find({ farm: farmId }).populate("skills").lean<IStaff[]>();
}