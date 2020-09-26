const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;
const cookieSession = require("cookie-session");
const routes = require("./routes");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

app.set('trust proxy', 1) // trust first proxy

app.use(cookieSession({
  name: 'session',
  secret: "I am a selkie"
}))

app.use(function (req, res, next) {
  // middleware function logs the cookie-session object on server receipt of HTTP request
  console.log(`request received by server: ${req.method} ${req.originalUrl}`);
  console.log("entire session object: " + JSON.stringify(req.session));
  next();
})

app.use(routes);

app.listen(PORT, function() {
  console.log(`API server now listening on PORT ${PORT}!`);
});
