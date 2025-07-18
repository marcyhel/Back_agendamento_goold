import jwt, { SignOptions } from "jsonwebtoken";

export const generateJWT = async (
  payload: string | object | Buffer,
  secretKey: string,
  expiresIn: number = 1000000
): Promise<string> => {
  try {
    const options: SignOptions = {
      expiresIn,
    };

    const token = jwt.sign(payload, secretKey, options);
    return token;
  } catch (error: any) {
    throw new Error(error.message);
  }
};


export const verifyJWT = async (
  token: string,
  secretKey: string
): Promise<jwt.JwtPayload> => {
  try {
    const cleanedToken = token.replace("Bearer ", "");
    const data = jwt.verify(cleanedToken, secretKey);

    if (typeof data === "string") {
      throw new Error("Invalid token payload");
    }

    return data as jwt.JwtPayload;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
