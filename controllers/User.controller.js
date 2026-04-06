import { accessTokenGenerated, refreshTokenGenerated } from "../middleware/auth.middleware.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, dept_id } = req.body;
    console.log("req.body", req.body);
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "required fileds are empty" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "user is already existing" });
    }
    const saltRounds = 10;
    const hashPassword = bcrypt.hashSync(password, saltRounds);

    const createUser = await User.create({
      name,
      email,
      password: hashPassword,
      role,
      dept_id,
    });
    return res
      .status(200)
      .json({ message: "user create sucessfully", data: createUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Required fields are empty" });
    }

    const findUser = await User.findOne({ where: { email } });

    if (!findUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const checkPassword = await bcrypt.compare(password, findUser.password);

    if (!checkPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const accessToken = accessTokenGenerated(findUser);
    const refreshToken = refreshTokenGenerated(findUser);

    await User.update(
      { refreshToken: refreshToken },
      { where: { id: findUser.id } },
    );

    return res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        id: findUser.id,
        email: findUser.email,
        role: findUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
