import bcrypt from "bcrypt";
import _ from "lodash";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { readTxtFileAsJson, saveJsonToTxtFile } from "../helpers/convert.js";

dotenv.config();

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10;
const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const registerLibrarian = async (req, res) => {
  const { username, password, name, surname, schedule, experience, section } =
    req.body;

  try {
    if (
      !username ||
      !password ||
      !name ||
      !surname ||
      !schedule ||
      !experience ||
      !section
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const librarians = await readTxtFileAsJson("librarians.txt");
    const users = await readTxtFileAsJson("users.txt");

    if (_.find(users, { username })) {
      return res.status(400).json({ message: "Username already exists." });
    }

    const newLibrarianId = librarians.length
      ? Number(_.maxBy(librarians, "id").id) + 1
      : 1;
    const newUserId = users.length ? Number(_.maxBy(users, "id").id) + 1 : 1;

    const newLibrarian = {
      id: newLibrarianId.toString(),
      name,
      surname,
      section,
      experience,
      userId: newUserId.toString(),
    };

    const newUser = {
      id: newUserId.toString(),
      username,
      password: hashedPassword,
    };

    const updatedLibrarians = [...librarians, newLibrarian];
    await saveJsonToTxtFile("librarians.txt", updatedLibrarians);

    const updatedUsers = [...users, newUser];
    await saveJsonToTxtFile("users.txt", updatedUsers);

    const librarianSchedules = await readTxtFileAsJson(
      "librarian_schedule.txt"
    );
    const newSchedule = {
      librarianId: newLibrarianId.toString(),
      schedule: Array.isArray(schedule) ? schedule.join("|") : schedule,
    };

    const updatedSchedules = [...librarianSchedules, newSchedule];
    await saveJsonToTxtFile("librarian_schedule.txt", updatedSchedules);

    res.status(201).json({ message: "Librarian registered successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering librarian." });
  }
};

export const loginLibrarian = async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required." });
    }

    const users = await readTxtFileAsJson("users.txt");
    const librarians = await readTxtFileAsJson("librarians.txt");

    const user = users.find((u) => u.username === username);

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    const librarian = librarians.find((l) => l.userId === user.id);

    if (!librarian) {
      return res.status(404).json({ message: "Librarian details not found." });
    }

    const token = jwt.sign(
      { id: librarian.id, userId: librarian.userId },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful.",
      token,
      librarian: {
        id: librarian.id,
        name: librarian.name,
        surname: librarian.surname,
        section: librarian.section,
        experience: librarian.experience,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in." });
  }
};
