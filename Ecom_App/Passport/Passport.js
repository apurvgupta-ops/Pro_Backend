const passport = require("passport");
const SocialAuth = require("../Models/socialLogin");
var GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.serializeUser(function (user, next) {
  next(null, user.id);
});

passport.deserializeUser(function (id, bext) {
  SocialAuth.findById(id, function (err, user) {
    next(err, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:4000/auth/google/callback",
    },
    (accessToken, refreshToken, profile, next) => {
      console.log("My Profile", profile._json.email);
      SocialAuth.findOne({ email: profile._json.email }).then((user) => {
        if (user) {
          console.log("user is already exits in db", user);
          next(null, user);
        } else {
          SocialAuth.create({
            name: profile.displayName,
            googleId: profile.id,
            email: profile._json.email,
          })
            .then((user) => {
              console.log("user created successfully", user);
              next(null, user);
            })
            .catch((err) => console.log(err));
        }
      });
      //   next();
    }
  )
);
