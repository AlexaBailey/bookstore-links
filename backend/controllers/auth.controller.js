// // import bcrypt from "bcrypt";
// // import _ from "lodash";
// // import jwt from "jsonwebtoken";
// // import dotenv from "dotenv";
// // import { readTxtFileAsJson, saveJsonToTxtFile } from "../helpers/convert.js";

// // dotenv.config();

// // const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10;
// // const JWT_SECRET = process.env.JWT_SECRET || "secret";

// // export const registerLibrarian = async (req, res) => {
// //   const { username, password, name, surname, schedule, experience, section } =
// //     req.body;

// //   try {
// //     if (
// //       !username ||
// //       !password ||
// //       !name ||
// //       !surname ||
// //       !schedule ||
// //       !experience ||
// //       !section
// //     ) {
// //       return res.status(400).json({ message: "All fields are required." });
// //     }

// //     const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

// //     const librarians = await readTxtFileAsJson("librarians.txt");
// //     const users = await readTxtFileAsJson("users.txt");

// //     if (_.find(users, { username })) {
// //       return res.status(400).json({ message: "Username already exists." });
// //     }

// //     const newLibrarianId = librarians.length
// //       ? Number(_.maxBy(librarians, "id").id) + 1
// //       : 1;
// //     const newUserId = users.length ? Number(_.maxBy(users, "id").id) + 1 : 1;

// //     const newLibrarian = {
// //       id: newLibrarianId.toString(),
// //       name,
// //       surname,
// //       section,
// //       experience,
// //       userId: newUserId.toString(),
// //     };

// //     const newUser = {
// //       id: newUserId.toString(),
// //       username,
// //       password: hashedPassword,
// //     };

// //     const updatedLibrarians = [...librarians, newLibrarian];
// //     await saveJsonToTxtFile("librarians.txt", updatedLibrarians);

// //     const updatedUsers = [...users, newUser];
// //     await saveJsonToTxtFile("users.txt", updatedUsers);

// //     const librarianSchedules = await readTxtFileAsJson(
// //       "librarian_schedule.txt"
// //     );
// //     const newSchedule = {
// //       librarianId: newLibrarianId.toString(),
// //       schedule: Array.isArray(schedule) ? schedule.join("|") : schedule,
// //     };

// //     const updatedSchedules = [...librarianSchedules, newSchedule];
// //     await saveJsonToTxtFile("librarian_schedule.txt", updatedSchedules);

// //     res.status(201).json({ message: "Librarian registered successfully." });
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ message: "Error registering librarian." });
// //   }
// // };

// // export const loginLibrarian = async (req, res) => {
// //   const { username, password } = req.body;

// //   try {
// //     if (!username || !password) {
// //       return res
// //         .status(400)
// //         .json({ message: "Username and password are required." });
// //     }

// //     const users = await readTxtFileAsJson("users.txt");
// //     const librarians = await readTxtFileAsJson("librarians.txt");

// //     const user = users.find((u) => u.username === username);

// //     if (!user) {
// //       return res.status(401).json({ message: "Invalid username or password." });
// //     }

// //     const isPasswordValid = await bcrypt.compare(password, user.password);

// //     if (!isPasswordValid) {
// //       return res.status(401).json({ message: "Invalid username or password." });
// //     }

// //     const librarian = librarians.find((l) => l.userId === user.id);

// //     if (!librarian) {
// //       return res.status(404).json({ message: "Librarian details not found." });
// //     }

// //     const token = jwt.sign(
// //       {
// //         user: {
// //           id: librarian.id,
// //           userId: await new Link(librarian.userId).resolveLink().id,
// //           rowNumber: librarian.rowNumber,
// //         },
// //       },
// //       JWT_SECRET,
// //       { expiresIn: "1d" }
// //     );

// //     res.status(200).json({
// //       message: "Login successful.",
// //       token,
// //       librarian: {
// //         id: librarian.id,
// //         rowNumber: librarian.rowNumber,
// //         name: librarian.name,
// //         surname: librarian.surname,
// //         section: librarian.section,
// //         experience: librarian.experience,
// //       },
// //     });
// //   } catch (error) {
// //     res.status(500).json({ message: "Error logging in." });
// //   }
// // };
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import Link from "../helpers/Link.class.js";

// export const loginLibrarian = async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     if (!username || !password) {
//       return res
//         .status(400)
//         .json({ message: "Username and password are required." });
//     }

//     // Load all users and find the user by username
//     const users = await readTxtFileAsJson("users.txt");
//     const userRow = users.find((u) => u.username === username);

//     if (!userRow) {
//       return res.status(401).json({ message: "Invalid username or password." });
//     }

//     // Resolve the user object using the Link class
//     const user = await new Link(
//       `\${users/${userRow.rowNumber}/id}`
//     ).resolveLink();

//     // Validate the password
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({ message: "Invalid username or password." });
//     }

//     // Load librarians and find the librarian linked to the user
//     const librarians = await readTxtFileAsJson("librarians.txt");
//     const librarianRow = librarians.find(
//       (l) => l.userId === `\${users/${user.rowNumber}/id}`
//     );

//     if (!librarianRow) {
//       return res.status(404).json({ message: "Librarian details not found." });
//     }

//     // Resolve the librarian object
//     const librarian = await new Link(
//       `\${librarians/${librarianRow.rowNumber}/id}`
//     ).resolveLink();

//     // Generate JWT token
//     const token = jwt.sign(
//       {
//         user: {
//           id: librarian.id,
//           userId: librarian.userId,
//           rowNumber: librarian.rowNumber,
//         },
//       },
//       JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     // Return successful response
//     res.status(200).json({
//       message: "Login successful.",
//       token,
//       librarian: {
//         id: librarian.id,
//         rowNumber: librarian.rowNumber,
//         name: librarian.name,
//         surname: librarian.surname,
//         section: librarian.section,
//         experience: librarian.experience,
//       },
//     });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error logging in.", error: error.message });
//   }
// };

// export const verifyToken = (req, res) => {
//   const token = req.headers.authorization?.split(" ")[1];

//   if (!token) {
//     return res
//       .status(401)
//       .json({ message: "Access denied. No token provided." });
//   }

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     res.status(200).json({ user: decoded.user });
//   } catch (error) {
//     res.status(401).json({ message: "Invalid or expired token." });
//   }
// };

// export const registerLibrarian = async (req, res) => {
//   const { username, password, name, surname, section, experience } = req.body;

//   try {
//     if (
//       !username ||
//       !password ||
//       !name ||
//       !surname ||
//       !section ||
//       !experience
//     ) {
//       return res.status(400).json({ message: "All fields are required." });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Add new user to the users table
//     const users = await readTxtFileAsJson("users.txt");
//     const newUserId = users.length + 1;
//     const newUserRow = {
//       rowNumber: newUserId,
//       id: newUserId,
//       username,
//       password: hashedPassword,
//     };
//     users.push(newUserRow);
//     await saveJsonToTxtFile("users.txt", users);

//     // Add new librarian to the librarians table
//     const librarians = await readTxtFileAsJson("librarians.txt");
//     const newLibrarianId = librarians.length + 1;
//     const newLibrarianRow = {
//       rowNumber: newLibrarianId,
//       id: newLibrarianId,
//       name,
//       surname,
//       section,
//       experience,
//       userId: `\${users/${newUserId}/id}`,
//     };
//     librarians.push(newLibrarianRow);
//     await saveJsonToTxtFile("librarians.txt", librarians);

//     res.status(201).json({ message: "Librarian registered successfully." });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error registering librarian.", error: error.message });
//   }
// };
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { readTxtFileAsJson, saveJsonToTxtFile } from "../helpers/convert.js";
import Link from "../helpers/Link.class.js";

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

    const users = await readTxtFileAsJson("users.txt");
    const librarians = await readTxtFileAsJson("librarians.txt");

    if (users.some((user) => user.username === username)) {
      return res.status(400).json({ message: "Username already exists." });
    }

    const newUserId = users.length + 1;
    const newUser = {
      rowNumber: newUserId,
      id: newUserId,
      username,
      password: hashedPassword,
    };

    users.push(newUser);
    await saveJsonToTxtFile("users.txt", users);

    const newLibrarianId = librarians.length + 1;
    const newLibrarian = {
      rowNumber: newLibrarianId,
      id: newLibrarianId,
      name,
      surname,
      section,
      experience,
      userId: Link.formatLink("users", newUserId),
    };

    librarians.push(newLibrarian);
    await saveJsonToTxtFile("librarians.txt", librarians);

    const librarianSchedules = await readTxtFileAsJson(
      "librarian_schedule.txt"
    );
    const newSchedule = {
      librarianId: Link.formatLink("librarians", newLibrarianId),
      schedule: Array.isArray(schedule) ? schedule.join("|") : schedule,
    };

    librarianSchedules.push(newSchedule);
    await saveJsonToTxtFile("librarian_schedule.txt", librarianSchedules);

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
    const userRow = users.find((user) => user.username === username);

    if (!userRow) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    const user = await Link.formatLinkById("users", userRow.id);
    const isPasswordValid = await bcrypt.compare(password, userRow.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password." });
    }
    const librarians = await readTxtFileAsJson("librarians.txt");
    const librarianRow = librarians.find((l) => l.userId === user);

    if (!librarianRow) {
      return res.status(404).json({ message: "Librarian details not found." });
    }
    const token = jwt.sign(
      {
        user: {
          id: librarianRow.id,
          userId: user,
          rowNumber: librarianRow.rowNumber,
        },
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful.",
      token,
      librarian: {
        id: librarianRow.id,
        rowNumber: librarianRow.rowNumber,
        name: librarianRow.name,
        surname: librarianRow.surname,
        section: librarianRow.section,
        experience: librarianRow.experience,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in." });
  }
};
