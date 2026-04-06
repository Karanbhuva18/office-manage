import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
export const accessTokenGenerated = (user) => {
  try {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" },
    );
  } catch (error) {
    throw new Error(error.message);
  }
};

export const refreshTokenGenerated = (user) => {
  try {
    return jwt.sign(
      {
        id: user.id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "2d" },
    );
  } catch (error) {
    throw new Error(error.message);
  }
};

export const userLoginCheck = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Auth token missing" });
    }

    const accessToken = authHeader.split(" ")[1];

    if (!accessToken) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

    req.user = decoded;

    // 🔹 Continue
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const userRole = (roles) => {
  return (req, res, next) => {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const validRole = roles.includes(user.role);

      if (validRole) {
        return next();
      } else {
        return res.status(403).json({ message: "Invalid role" });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
};
