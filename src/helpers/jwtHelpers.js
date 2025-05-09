import jwt from "jsonwebtoken";

const createToken = (payload, secret, expiresIn) => {
  return jwt.sign(payload, secret, { expiresIn });
};

const verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};

const createPasswordResetToken = (payload, secret, expiresIn) => {
  return jwt.sign(payload, secret, {
    expiresIn: expiresIn,
    algorithm: "HS256",
  });
};

export const jwtHelpers = {
  createToken,
  verifyToken,
  createPasswordResetToken,
};
