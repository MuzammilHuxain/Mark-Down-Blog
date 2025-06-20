require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const session = require('express-session');
const Article = require("./models/article");
const articleRouter = require("./routes/articles");
const authRouter = require("./routes/auth");
const methodOverride = require("method-override");

const app = express();
consloe.log("hi");
const PORT = process.env.PORT || 3000;
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log("Error connecting to database", err);
  });

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));

// Authentication middleware
const requireAuth = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        res.redirect('/auth/login');
    }
};

// Routes
app.use("/auth", authRouter);
app.use("/articles", requireAuth, articleRouter);

app.get("/", requireAuth, async (req, res) => {
    const articles = await Article.find().sort({ createdAt: "desc" });
    res.render("articles/index", { articles: articles });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
