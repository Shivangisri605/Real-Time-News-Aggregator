// server.js (clean + improved)

const express = require("express");
const path = require("path");
const axios = require("axios");
require("dotenv").config();

const app = express();

// Use your API Key from .env file
const API_KEY = process.env.NEWS_API_KEY || "679b913ddb014617bcc93a0bb89ee1ee";

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Home → Top Headlines
app.get("/", async (req, res) => {
  try {
    const response = await axios.get(
      `https://newsapi.org/v2/top-headlines?country=in&apiKey=${API_KEY}`
    );

    res.render("index", { news: response.data.articles });
  } catch (error) {
    console.error("Error fetching news:", error.message);
    res.status(500).send("Error fetching news. Please try again later.");
  }
});

// Search News
app.get("/search", async (req, res) => {
  try {
    const searchTerm = req.query.search;

    if (!searchTerm || searchTerm.trim() === "") {
      return res.redirect("/");
    }

    const response = await axios.get(
      `https://newsapi.org/v2/everything?q=${searchTerm}&apiKey=${API_KEY}`
    );

    res.render("index", { news: response.data.articles });
  } catch (error) {
    console.error("Error fetching search results:", error.message);
    res.status(500).send("Error fetching search results. Try again.");
  }
});

// Sort by Date
app.get("/sort-by-date", async (req, res) => {
  try {
    const response = await axios.get(
      `https://newsapi.org/v2/top-headlines?country=in&apiKey=${API_KEY}`
    );

    const sorted = response.data.articles.sort(
      (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
    );

    res.render("index", { news: sorted });
  } catch (error) {
    console.error("Error sorting articles:", error.message);
    res.status(500).send("Error sorting articles.");
  }
});

// News by Specific Date
app.get("/news-by-date", async (req, res) => {
  try {
    const date = req.query.date;

    if (!date) return res.redirect("/");

    const response = await axios.get(
      `https://newsapi.org/v2/everything?q=*&from=${date}&to=${date}&sortBy=popularity&apiKey=${API_KEY}`
    );

    res.render("index", { news: response.data.articles });
  } catch (error) {
    console.error("Error fetching date news:", error.message);
    res.status(500).send("Error fetching date-wise news.");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
