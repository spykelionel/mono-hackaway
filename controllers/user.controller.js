const bcrypt = require("bcrypt");
const User = require("../models/User");
const axios = require("axios").default;
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, `./uploads`);
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "_" + file.originalname);
  },
});

const uploads = multer({ storage });

module.exports = {
  upload: uploads.single("avatar"),
  create: async (req, res) => {
    User?.exists({ email: req.body.email })
      .then(async (result) => {
        if (!result) {
          try {
            bcrypt.hash(req.body.password, 10, async (err, hash) => {
              if (err) {
                console.log(req.body);
                return res.status(500).json({
                  status: err.name,
                  message: err.message,
                });
              }
              const user = new User({
                ...req.body,
                password: hash,
                avatar: req?.file?.path ?? "none",
              });
              await user
                .save()
                .then((result) => {
                  return res.status(201).send(result);
                })
                .catch((err) => {
                  return res.status(501).send(err);
                });
            });
          } catch (error) {
            console.log(error);
          }
        } else {
          res.status(409).json({
            message: "Resource Exist",
          });
        }
      })
      .catch((err) => console.error(err));
  },

  getAll: async (req, res, next) => {
    await User.find({})
      .lean()
      .then((result) => res.status(200).send(result))
      .catch((err) => res.status(503).send(err));
  },

  getOne: async (req, res) => {
    try {
      await User.findOne({ _id: req.params.id })
        .lean()
        .then((result) => {
          if (result) {
            return res.status(200).json({ ...result });
          }
          return res.status(404).json({
            message: "User Not found",
          });
        })
        .catch((err) => {
          return res.status(501).json({
            ...err,
            info: "Server Error",
          });
        });
    } catch (error) {
      new Error(error);
      res.status(501).json({
        ...error,
        info: "Server Error. Error getting the user",
      });
    }
  },

  deleteOne: async (req, res) => {
    await User.deleteOne({ _id: req.params.id })
      .then((result) => {
        if (result) {
          res.status(200).send(result);
        }
        res.status(404).json({
          message: "User Not found",
        });
      })
      .catch((err) =>
        res.status(501).json({
          ...err,
          message: "Not found",
        })
      );
  },

  deleteAll: async (req, res) => {
    await User.deleteMany({})
      .then((result) =>
        res.status(200).send({ ...result, info: "deleted all Users" })
      )
      .catch((err) =>
        res.status(404).json({
          ...err,
          message: "Not found",
        })
      );
  },

  update: async (req, res) => {
    User?.exists({ _id: req.params.id })
      .then(async (result) => {
        if (result) {
          try {
            await User.updateOne(
              { _id: req.params.id },
              {
                $set: req.body,
              }
            )
              .then((result) =>
                res.status(201).send({
                  ...result,
                  info: "successfully updated User",
                })
              )
              .catch((err) => res.status(409).send(err));
          } catch (error) {
            console.log(error);
          }
        } else {
          res.status(404).json({
            info: { message: "Resource Doesn't Exist", valid: false },
          });
        }
      })
      .catch((err) => console.error(err));
  },
  authenticate: async (req, res) => {
    const options = {
      method: "POST",
      url: "https://api.withmono.com/account/auth",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        'mono-sec-key': req.headers['mono-sec-key'],
      },
      data: { code: req.params.code },
    };

    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
          return res.status(400).json(response.data)

      })
      .catch(function (error) {
        console.log(req.headers['mono-sec-key'])
        return res.status(400).json({message:error.message, code:error.status})
      });
      console.log(req.headers['mono-sec-key'])
  },
  login: require("../auth/auth").login,
};
