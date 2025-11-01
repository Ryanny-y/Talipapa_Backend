import Admin, { IAdmin } from "../../model/Admin";
import { CustomError } from "../../error/CustomError";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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
    if (error instanceof CustomError) {
      throw error;
    }

    throw new CustomError(500, error.message || "Internal Server Error");
  }
};

export const loginAdmin = async (credentials: {
  username: string;
  password: string;
}) => {
  const { username, password } = credentials;

  try {
    if (!username || !password)
      throw new CustomError(400, "Username and Password are required!");

    const foundUser = await Admin.findOne({ username }).exec();
    if (!foundUser)
      throw new CustomError(401, "Username or Password is incorrect.");

    const match: boolean = await bcrypt.compare(password, foundUser.password);
    if (match) {
      const roles = Object.values(foundUser.roles);

      const accessToken = jwt.sign(
        {
          userInfo: {
            _id: foundUser._id,
            username: foundUser.username,
            roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET as string,
        { expiresIn: "15m" }
      );
      const refreshToken = jwt.sign(
        { username: foundUser.username },
        process.env.REFRESH_TOKEN_SECRET as string,
        { expiresIn: "7d" }
      );

      foundUser.refreshToken = refreshToken;
      await foundUser.save();

      return {
        userData: {
          username: foundUser.username,
          _id: foundUser._id,
          roles: foundUser.roles,
        },
        accessToken,
        refreshToken,
      };
    } else {
      throw new CustomError(401, "Username or Password is incorrect.");
    }
  } catch (error) {
    throw error;
  }
};

export const refreshTokenService = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new CustomError(401, "Refresh token required");
  }

  const foundUser = await Admin.findOne({ refreshToken });
  if (!foundUser) {
    throw new CustomError(403, "Invalid refresh token");
  }

  return new Promise<{ userData: any; accessToken: string }>((resolve, reject) => {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string,
      (err, decoded: any) => {
        if (err || decoded.username !== foundUser.username) {
          return reject(new CustomError(403, 'Invalid refresh token'));
        }

        const roles = Object.values(foundUser.roles);
        const accessToken = jwt.sign(
          {
            userInfo: {
              username: foundUser.username,
              roles,
            },
          },
          process.env.ACCESS_TOKEN_SECRET as string,
          { expiresIn: '15m' }
        );

        resolve({
          userData: {
            username: foundUser.username,
          },
          accessToken: accessToken,
        });
      }
    );
  });
};
