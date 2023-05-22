const express = require("express");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const cookieSession = require("cookie-session");
const { users, urlDatabase } = require("./helpers.js");
const { getUserByEmail, generateRandomString, urlsForUser} = require("./helpers.js");

const app = express();
const PORT = 8080; 

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(
  cookieSession({
    name: "session",
    keys: ["secret-key"],
    maxAge: 24 * 60 * 60 * 1000,
  })
);

app.get("/", (req, res) => {
  const userId = req.session.user_id;
  if (userId) {
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  const userID = req.session.user_id;
  if (!userID || !users[userID]) {
    res.render("urls_not_logged_in", {
      username: null,
    });
    return;
  }

  const userURLs = urlsForUser(userID);
  const templateVars = {
    urls: userURLs,
    username: users[userID].email,
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const userId = req.session.user_id;
  if (!userId) {
    res.redirect("/login");
    return;
  }
  const templateVars = {
    urls: urlDatabase,
    username: users[userId].email,
  };
  res.render("urls_new", templateVars);
});

app.get("/login", (req, res) => {
  const userId = req.session.user_id;
  if (userId) {
    res.redirect("/urls");
    return;
  }
  const templateVars = {
    username: null,
  };
  res.render("login", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const userID = req.session.user_id;
  const shortURL = req.params.id;
  if (!userID) {
    res.render("urls_error", {
      errorMessage: "You must be logged in to view this URL.",
    });
    return;
  }
  if (urlDatabase[shortURL].userID !== userID) {
    res.render("urls_error", {
      errorMessage: "You do not own this URL.",
    });
    return;
  }
  const templateVars = {
    id: shortURL,
    longURL: urlDatabase[shortURL].longURL,
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {
  const shortURL = req.params.id;
  const urlEntry = urlDatabase[shortURL];

  if (urlEntry) {
    const longURL = urlEntry.longURL;
    res.redirect(longURL);
  } else {
    res.status(404).send("Short URL not found");
  }
});

app.get("/register", (req, res) => {
  const userId = req.session.user_id;
  const user = users[userId];
  const templateVars = {
    username: user ? user.email : null,
  };
  res.render("register", templateVars);
});

app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
  delete urlDatabase[id];
  res.redirect("/urls");
});

app.post("/urls/:id/edit", (req, res) => {
  const userID = req.session.user_id;
  const shortURL = req.params.id;
  const newURL = req.body.newURL;

  if (!userID) {
    res.status(401).send("You must be logged in to edit URLs.");
    return;
  }

  if (!urlDatabase[shortURL]) {
    res.status(404).send("Short URL not found.");
    return;
  }

  if (urlDatabase[shortURL].userID !== userID) {
    res.status(403).send("You do not have permission to edit this URL.");
    return;
  }

  urlDatabase[shortURL].longURL = newURL;
  res.redirect("/urls");
});


app.post("/urls", (req, res) => {
  const userId = req.session.user_id;

  if (!userId) {
    res.status(401).send("You need to be logged in to shorten URLs.");
    return;
  }

  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    userID: userId,
  };

  res.redirect(`/urls/${shortURL}`); // Redirect to /urls/:id
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = getUserByEmail(email);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    res.status(403).send("Invalid email or password");
    return;
  }
  req.session.user_id = user.id;
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});


app.post("/register", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send("Email and password cannot be empty.");
    return;
  }
  const existingUser = getUserByEmail(email);
  if (existingUser) {
    res.status(400).send("Email already exists.");
    return;
  }

  const userId = generateRandomString();
  const hashedPassword = bcrypt.hashSync(password, 10); // Hash the password
  const newUser = {
    id: userId,
    email: email,
    password: hashedPassword,
  };

  users[userId] = newUser;
  req.session.user_id = userId;
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
