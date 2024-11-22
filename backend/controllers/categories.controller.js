import { readTxtFileAsJson } from "../helpers/convert.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await readTxtFileAsJson("categories.txt");
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories" });
  }
};
