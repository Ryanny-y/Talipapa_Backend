import Admin, { IAdmin } from "../../model/Admin";
import { CustomError } from "../../error/CustomError";
import bcrypt from "bcrypt";
import { createAdminBody } from "../../types/requestTypes";

export const createAdmin = async (
  userData: createAdminBody
): Promise<IAdmin> => {
  try {
    const { username, email, contactNumber, roles, password } = userData;

    // Move all validation inside try block
    if (!username || !email || !contactNumber || !roles || !password) {
      throw new CustomError(400, "All Fields are required");
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      throw new CustomError(400, "Invalid Email Format!");
    }

    if (contactNumber.length !== 11) {
      throw new CustomError(400, "Invalid Contact Number!");
    }

    if (!Array.isArray(roles) || roles.length === 0) {
      throw new CustomError(400, "At least one role is required!");
    }

    const validRoles = ["ADMIN", "SUPER_ADMIN"];
    if (roles.some((role) => !validRoles.includes(role))) {
      throw new CustomError(400, "Invalid role(s) provided!");
    }

    const foundAdmin = await Admin.findOne({ username }).lean();
    if (foundAdmin) {
      throw new CustomError(
        409,
        `Admin with username: ${username} already exists`
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await Admin.create({
      username,
      email,
      contactNumber,
      roles: roles,
      password: hashedPassword,
    });

    return newAdmin;
  } catch (error: any) {
    // If it's already a CustomError, re-throw it
    if (error instanceof CustomError) {
      throw error;
    }
    
    // For other errors, throw as CustomError
    throw new CustomError(500, error.message || "Internal Server Error");
  }
};