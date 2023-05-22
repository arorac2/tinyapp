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
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};

/* 
* Function searches for user object based on email provided
* Parameter(s): email - checks if current user matches the email
* Returns: User object that matches the provided email. If no provided email found
* it returns null. 
*/ 

function getUserByEmail(email) {
  for (const userId in users) {
    const user = users[userId];
    if (user.email === email) {
      return user;
    }
  }
  return null;
}

/* 
* Generates a random string of length 6, using a combination of uppercase and lowercase
* letters 
* Parameter(s): none
* Returns: randomString - A randomly generated strong of length 6
*/
function generateRandomString() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomString = "";
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters[randomIndex];
  }
  return randomString;
}

/* 
* Retrieves the URLs associated with the specific user. 
* Parameter(s): userID - a string representation of the user we are retrieving
* Returns: userURLs - an object which contains the urls of the associated user
*/
function urlsForUser(userID) {
  const userURLs = {};
  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === userID) {
      userURLs[shortURL] = urlDatabase[shortURL];
    }
  }
  return userURLs;
}

module.exports = {
  getUserByEmail,
  generateRandomString,
  urlsForUser,
  users,
  urlDatabase,
};
