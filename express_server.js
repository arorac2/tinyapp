const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require('cookie-parser');
app.use(cookieParser());

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


const users = {
    userRandomID: {
        id: "userRandomID",
        email: "user@example.com",
        password: "purple-monkey-dinosaur", 
    },
    user2RandomID: {
        id: "user2RandomID",
        email: "user2@example.com",
        password: "dishwasher-funk",
    },
  };

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

// app.get("/urls", (req, res) => {
//     const templateVars = { urls: urlDatabase, username: req.cookies["username"]};
//     res.render("urls_index", templateVars);
//   });

app.get("/urls", (req, res) => {
    const userId = req.cookies["user_id"];
    const user = users[userId];
    const templateVars = {
      urls: urlDatabase,
      username: user ? user.email : null,
    };
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

  app.post("/urls/:id/edit", (req, res) => {
    const id = req.params.id;
    const newURL = req.body.newURL;
    urlDatabase[id] = newURL; 
  
    res.redirect("/urls"); 
  });

  app.get("/login", (req, res) => {
    res.render("login");
  });


  app.post("/login", (req, res) => {
    const { email, password } = req.body;
    const user = getUserByEmail(email);
    
    if (!user || user.password !== password) {
      res.status(401).send("Invalid email or password");
      return;
    }
  
    res.cookie("user_id", user.id);
    res.redirect("/urls");
  });
  
//   app.get("/urls", (req, res) => {
//     const templateVars = {
//       username: "test",
//     };
//     res.render("urls_index", templateVars);
//   });

app.post("/logout", (req, res) => {
    res.clearCookie("user_id"); 
    res.redirect("/urls");
  });

  app.get("/register", (req, res) => {
    res.render("register");
  });

  app.post("/register", (req, res) => {
    const { email, password } = req.body;
  
    // Check if email or password are empty strings
    if (!email || !password) {
      res.status(400).send("Email and password cannot be empty.");
      return;
    }
  
    // Check if email already exists in users database
    const existingUser = getUserByEmail(email);
    if (existingUser) {
      res.status(400).send("Email already exists.");
      return;
    }

    const userId = generateRandomString();
    const newUser = {
      id: userId,
      email: email,
      password: password,
    };
  
    users[userId] = newUser;
    res.cookie("user_id", userId);
    res.redirect("/urls");
  });
  

  function getUserByEmail(email) {
    for (const userId in users) {
      const user = users[userId];
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }
  
  

app.post("/register", (req, res) => {
    const { email, password } = req.body; 
    const userId = generateRandomString(); 

    const newUser = {
      id: userId,
      email: email,
      password: password,
    };

    users[userId] = newUser;
  
    res.cookie("user_id", userId);
    res.redirect("/urls");
  });

