const express = require("express");
const router = express.Router({ strict: true });

const user = require('../controllers/user.controller')

router
  .get("/", user.getAll)
  .get("/:id", user.getOne)
  .post("/", user.create)
  .post('/login', user.login)
  .post('/auth/:code', user.authenticate)
  .patch("/:id", user.update)
  .delete('/all', user.deleteAll)
  .delete("/:id", user.deleteOne);

module.exports = router;
