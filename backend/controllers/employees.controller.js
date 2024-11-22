import { readTxtFileAsJson } from "../helpers/convert.js";

export const getEmployees = async (req, res) => {
  try {
    const employees = await readTxtFileAsJson("librarians.txt");
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employees" });
  }
};
