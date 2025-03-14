const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('./db');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'https://xceptions.tech/aximos/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      
      db.query("SELECT * FROM users WHERE google_id = ?", [profile.id], (err, results) => {
        if (err) return done(err);
        if (results.length > 0) {
          
          return done(null, results[0]);
        } else {
          
          const userData = {
            google_id: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
            role: 'user', 
          };
          db.query("INSERT INTO users SET ?", userData, (err, result) => {
            if (err) return done(err);
            userData.id = result.insertId;
            return done(null, userData);
          });
        }
      });
    }
  )
);

module.exports = passport;
