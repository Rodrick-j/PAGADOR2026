import { AuthUser } from "../../base/types/AuthUser";
import jwt from "jsonwebtoken";

export const SECRET = process.env.JWT_SECRET || "gobierno_autonomo_departamental_oruro";
const ISSUER = process.env.JWT_ISSUER || "http://localhost:3000"; 

export const signToken = (user: AuthUser, options?: jwt.SignOptions): string => {
    const payload = {
        ...user,
        sub: user.uid, // estándar JWT
    };

    return jwt.sign(payload, SECRET, {
        expiresIn: "7d",
        issuer: ISSUER,
        ...(options || {}),
    });
};

export const verifyToken = (token: string): AuthUser => {
    return jwt.verify(token, SECRET) as AuthUser;
};
