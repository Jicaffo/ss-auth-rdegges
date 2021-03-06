const path = require("path");

const express = require("express");
const mongoose = require("mongoose");
const sessions = require("client-sessions");
const csurf = require("csurf");

const auth = require("./auth");
const authRoutes = require("./routes/authRoutes");
const mainRoutes = require("./routes/mainRoutes");
const settings = require("./settings");

let app = express();

// init
mongoose.connect("mongodb://localhost/ss-auth");

// settings
app.set("view engine", "pug");
app.set("staticDir", path.join(__dirname, "static"));

// middleware
app.use("/static", express.static(app.get("staticDir")));
app.use(sessions({
  cookieName: "session",
  secret: settings.SESSION_SECRET_KEY,
  duration: settings.SESSION_DURATION,
  activeDuration: settings.SESSION_EXTENSION_DURATION,
  cookie: {
    httpOnly: true,
    ephemeral: settings.SESSION_EPHEMERAL_COOKIES,
    secure: settings.SESSION_SECURE_COOKIES
  }
}));
app.use(express.urlencoded({ extended: false }));
app.use(csurf());
app.use(auth.loadUserFromSession);

// routes
app.use(authRoutes);
app.use(mainRoutes);

// error handling
app.use((err, req, res, next) => {
  res.status(500).send("Something broke :( Please try again.");
});

app.listen(3000);
