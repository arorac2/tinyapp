const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

function generateRandomString() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters[randomIndex];
    }
    return randomString;
  }

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
  });

app.get("/hello", (req, res) => {
    res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
    const templateVars = { urls: urlDatabase };
    res.render("urls_index", templateVars);
  });

  app.get("/urls/:id", (req, res) => {
    const templateVars = { id: req.params.id, longURL: "http://www.lighthouselabs.ca" };
    res.render("urls_show", templateVars);
  });

  app.get("/urls/new", (req, res) => {
    res.render("urls_new");
  });

  app.use(express.urlencoded({ extended: true }));

  app.post("/urls", (req, res) => {
    const shortURL = generateRandomString(); 
    urlDatabase[shortURL] = req.body.longURL; 
    const response = { shortURL }; 
    res.status(200).json(response); 
  });

  app.get("/u/:id", (req, res) => {
    const shortURL = req.params.id; 
    const longURL = urlDatabase[shortURL]; 
    if (longURL) {
      res.redirect(longURL); // Redirect to the long URL
    } else {
      res.status(404).send("Short URL not found"); 
    }
  });
  app.post("/urls/:id/delete", (req, res) => {
    const id = req.params.id; 
    delete urlDatabase[id]; 
    res.redirect("/urls"); 
  });