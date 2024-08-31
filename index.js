const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const session = require("express-session");

const app = express();
const port = 2005;

const Content = require("./contentSchema");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

mongoose
  .connect(
    "mongodb+srv://saikameshwari71:Kameshwari2004@cluster0.a5gcveo.mongodb.net/dbmp?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

app.route("/store")
  .get((req, res) => {
    res.sendFile(path.join(__dirname, "miniregister.html"));
  })
  .post(async (req, res) => {
    const { fname, lname, email, mobile, username, password } = req.body;

    try {
      const existingUser = await Content.findOne({ username });
      if (existingUser) {
        return res.send("Username already exists");
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const newData = new Content({
        fname,
        lname,
        email,
        mobile,
        username,
        password: hashedPassword,
      });

      await newData.save();

      res.redirect("/login");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error occurred");
    }
  });

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  console.log("Login request received. Username:", username);

  try {
    const user = await Content.findOne({ username }).select("+password");

    if (!user) {
      console.log("User not found:", username);
      return res.send("User not found");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      console.log("Invalid password:", username);
      return res.send("Invalid password");
    }

    req.session.userId = user._id;
    res.redirect("/profile.html");
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).send("Error occurred");
  }
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "minilogin.html"));
});

app.get("/profile.html", (req, res) => {
  if (!req.session.userId) {
    return res.redirect("/login");
  }
  res.sendFile(path.join(__dirname, "profile.html"));
});

app.post("/profile.html", async (req, res) => {
  const { fullName, email, profileType, graduationYear, occupation, bio } = req.body;
  console.log(req.body);

  try {
    const existingUser = await Content.findOne({ email });
    if (existingUser) {
      return res.send("Email already exists");
    }

    const newData = new Content({
      fName: fullName,
      email,
      graduationYear,
      occupation,
      bio,
    });
    await newData.save();

    res.redirect("/profile.html");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error occurred");
  }
});

app.listen(port, () => {
  console.log("Server is running on port", port);
});
