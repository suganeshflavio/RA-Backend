import { findUserByEmail } from "../repositories/user.repository";
import { comparePassword } from "../utils/bcrypt";
import { generateToken } from "../utils/jwt";

export const loginUser = async (
  email: string,
  password: string
) => {

  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error("Invalid Credentials");
  }

  const isMatch = await comparePassword(
    password,
    user.password,

  );

  if (!isMatch) {
    throw new Error("Invalid Credentials");
  }

  const token = generateToken({
    userId: user.id,
    role: user.role,
    sessionToken: user.sessionToken,
  });

  return {
    token,
    user,
  };
};