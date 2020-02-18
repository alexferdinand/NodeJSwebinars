const passport = require('passport')
const Strategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const user = require('./models/user')
const User = new user

passport.use(new Strategy(function(username, password, done) {
  User.findOne(username, done).then(
    result => {
      if (!result) {
        return done(null, false)
      }
      if (!bcrypt.compareSync(password, result[0].password)) {
        return done(null, false);
      }

      const plainUser = JSON.parse(JSON.stringify(result[0]));
      delete plainUser.password;

      done(null, plainUser); // req.user
    },
    error => {
      console.log(error)
    }
  )
}))

passport.serializeUser((user, done) => {
  return done(null, user.users_id);
});

passport.deserializeUser((id, done) => {
  User.getById(id).then(
    result => {
      const plainUser = JSON.parse(JSON.stringify(result));
      delete plainUser.password;

      done(null, plainUser); // req.user
    },
    error => {
      console.log(error)
    }
  )


});

module.exports = {
  initialize: passport.initialize(),
  session: passport.session(),
  authenticate: passport.authenticate('local', {
    successRedirect: './tasks',
    failureRedirect: '/auth?error=1',
  }),
};