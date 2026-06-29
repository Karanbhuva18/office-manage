import {
  accessTokenGenerated,
  refreshTokenGenerated,
} from "../middleware/auth.middleware.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import Attendance from "../models/Attendance.js";
import { Op } from "sequelize";

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, dept_id } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "required fileds are empty" });
    }

    const existingUser = await User.findOne({ where: { email } });
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

export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, name, email } = req.query;
    const offset = (page - 1) * limit;
    let whereClause = {};
    if (name) {
      whereClause.name = {
        [Op.like]: `%${name}%`,
      };
    }
    if (email) {
      whereClause.email = {
        [Op.like]: `%${email}%`,
      };
    }
    const { count, rows: users } = await User.findAndCountAll({
      where: whereClause,
      offset,
      limit: parseInt(limit),
      attributes: { exclude: ["password", "refreshToken"] },
    });
    const totalPages = Math.ceil(count / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;
    return res.status(200).json({
      message: "Users retrieved successfully",
      data: users,
      total: count,
      pagination: {
        currentPage: page,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "User id is required" });
    }
    const findUser = await User.findByPk(id);
    if (!findUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const deleteUser = await User.destroy({ where: { id } });
    if (deleteUser) {
      return res.status(200).json({ message: "User deleted successfully" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role, dept_id } = req.body;
    if (!id) {
      return res.status(400).json({ message: "User id is required" });
    }
    const findUser = await User.findByPk(id);
    if (!findUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const saltRounds = 10;
    const hashPassword = bcrypt.hashSync(password, saltRounds);
    const updateUser = await User.update(
      { name, email, password: hashPassword, role, dept_id },
      { where: { id } },
    );
    return res
      .status(200)
      .json({ message: "User updated successfully", data: updateUser });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const markAttendance = async (req, res) => {
  try {
    const { time } = req.body;
    const u_id = req.user.id;
    if (!u_id || !time) {
      return res.status(400).json({
        message: "u_id and time are required",
      });
    }
    console.log("time", time);
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const attendance = await Attendance.findOne({
      where: {
        u_id,
        date: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
    });
    console.log("attendance", attendance);
    if (!attendance) {
      const newAttendance = await Attendance.create({
        u_id,
        date: new Date(),
        check_in: time,
      });

      return res.status(201).json({
        message: "Check-in marked successfully",
        data: newAttendance,
      });
    }

    if (attendance.check_in && !attendance.check_out) {
      // Convert HH:MM:SS into seconds
      const convertToSeconds = (time) => {
        const [hours, minutes, seconds] = time.split(":").map(Number);

        return hours * 3600 + minutes * 60 + seconds;
      };

      const checkInSeconds = convertToSeconds(attendance.check_in);

      const checkOutSeconds = convertToSeconds(time);

      const diffSeconds = checkOutSeconds - checkInSeconds;

      const totalHours = Math.floor(diffSeconds / 3600);

      attendance.check_out = time;
      attendance.total_hours = totalHours;

      await attendance.save();

      return res.status(200).json({
        message: "Check-out marked successfully",
        data: attendance,
      });
    }

    return res.status(400).json({
      message: "Attendance already completed for today",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAttendance = async (req, res) => {
  try {
    let { page = 1, limit = 10, date } = req.query;

    page = Number(page);
    limit = Number(limit);

    const offset = (page - 1) * limit;

    // Default = today
    const selectedDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Get users
    const { count, rows: users } = await User.findAndCountAll({
      offset,
      limit,
      order: [["id", "ASC"]],
    });

    const attendanceRecords = await Attendance.findAll({
      where: {
        date: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
    });

    const attendanceMap = {};

    attendanceRecords.forEach((record) => {
      attendanceMap[record.u_id] = record;
    });

    // Merge users with attendance
    const data = users.map((user) => {
      const attendance = attendanceMap[user.id];

      return {
        id: attendance?.id || null,
        u_id: user.id,
        name: user.name,
        date: selectedDate,

        check_in: attendance?.check_in || null,
        check_out: attendance?.check_out || null,
        total_hours: attendance?.total_hours || null,
      };
    });

    return res.status(200).json({
      message: "Attendance records retrieved successfully",
      data,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        hasNextPage: offset + users.length < count,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
