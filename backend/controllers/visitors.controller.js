import { readTxtFileAsJson } from "../helpers/convert.js";

export const getVisitors = async (req, res) => {
  const { query } = req.query;
  try {
    const visitors = await readTxtFileAsJson("visitors.txt");

    const filteredVisitors = query
      ? visitors.filter((visitor) =>
          visitor.name.toLowerCase().includes(query.toLowerCase())
        )
      : visitors;
    res.json(filteredVisitors);
  } catch (error) {
    console.error("Error fetching visitors:", error);
    res.status(500).json({ message: "Error fetching visitors" });
  }
};
