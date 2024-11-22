import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import routes from "./routes/index.js";
import { convertJsonToTxt } from "./helpers/convert.js";

const app = express();
const PORT = 5000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(bodyParser.json());

// (async () => {
//   const filesToConvert = [
//     { json: "books.json", txt: "books.txt" },
//     { json: "book_category.json", txt: "book_category.txt" },
//     { json: "categories.json", txt: "categories.txt" },
//     { json: "borrowed_books.json", txt: "borrowed_books.txt" },
//     { json: "visitors.json", txt: "visitors.txt" },
//     { json: "librarian_schedule.json", txt: "librarian_schedule.txt" },

//     { json: "librarians.json", txt: "librarians.txt" },
//     { json: "users.json", txt: "users.txt" },
//   ];

//   for (const file of filesToConvert) {
//     await convertJsonToTxt(file.json, file.txt);
//   }
// })();

app.use("/books", routes.booksRoutes);
app.use("/categories", routes.categoriesRoutes);
app.use("/visitors", routes.visitorsRoutes);
app.use("/librarians", routes.librariansRoute);
app.use("/auth", routes.authRoute);

app.get("/", (req, res) => {
  res.send("Welcome to the Bookstore API");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
