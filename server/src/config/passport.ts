import passport from 'passport';
import passportLocal from 'passport-local';
import PassportJwt, { StrategyOptions } from "passport-jwt"
import User, { IUser }from '../models/userModel';
import { keys } from "./jwtConfig"

const LocalStrategy = passportLocal.Strategy;
const JwtStrategy = PassportJwt.Strategy;
const ExtractJwt = PassportJwt.ExtractJwt;
// e.g. jwtFromRequest, when assigining new object in opts using normal js way, it will always show type error.
// So defining an interface is prefered
// const opts: StrategyOptions = {jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()};
const opts: any = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

// User.createStrategy(), it set the default authenticate strategy, call by 'local'. it can be overriden
passport.use(new LocalStrategy({usernameField: 'email'}, User.authenticate()));
/* you could define a new authenticate strategy, called by 'local-login'
passport.use('local-login', new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
  //adding new authenticate function here
}));
*/
passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
  User.findById(jwt_payload.id)
      .then(user => {
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      })
      .catch(err => console.log(err));
  })
);

// it is called to stores the user id in req.session
passport.serializeUser(User.serializeUser());
// it is called to check to see if this user is saved in the database,  if it is found it assigns it to the request
passport.deserializeUser(User.deserializeUser());
