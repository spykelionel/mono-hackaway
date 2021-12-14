const express = require("express");
const router = express.Router({ strict: true });
const auth = require('../auth/verify')
const user = require('../controllers/user.controller')

router
  .get("/", auth,user.getAll)
  .get("/:id",auth, user.getOne)
  .post("/", user.upload, user.create)
  .post('/login', user.login)
  .post('/auth/:code',auth, user.authenticate)
  .patch("/:id", auth,user.update)
  // .delete('/all',auth, user.deleteAll)
  // .delete("/:id", auth,user.deleteOne);

module.exports = router;
