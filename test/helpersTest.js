const { assert } = require('chai');
const { getUserByEmail } = require('../helpers.js');


const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};


describe('getUserByEmail', function() {
    it('should return a user object when provided with an existing email', function() {
      const email = "user@example.com";
      const user = getUserByEmail(email, testUsers);
      assert.isObject(user);
    });
  
    it('should return undefined when provided with a non-existent email', function() {
      const email = "nonexistent@example.com";
      const user = getUserByEmail(email, testUsers);
      assert.isUndefined(user);
    });
  });