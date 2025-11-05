import Official, { IOfficial } from "../../model/Official";

export const getAllOfficials = (): Promise<IOfficial[]> => {
  return Official.find().lean<IOfficial[]>();
}