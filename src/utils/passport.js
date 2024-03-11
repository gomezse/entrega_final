
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GithubStrategy } from "passport-github2";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";
import { hashData, compareData } from "./utils.js";

import { usersManager } from "../dao/models/mongoose/UsersManager.js";

import config from "./config.js";

// LOCAL

passport.use(
  "signup",
  new LocalStrategy(
    { passReqToCallback: true, usernameField: "email" },
    async (req, email, password, done) => {
      const { first_name, last_name } = req.body;
      if (!first_name || !last_name || !email || !password) {
        return done(null, false);
      }
      try {
        const hashedPassword = await hashData(password);
        const createdUser = await usersManager.createOne({
          ...req.body,
          password: hashedPassword,
        });
        done(null, createdUser);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  "login",
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      if (!email || !password) {
        return done(null, false);
      }
      try {
        const user = await usersManager.findByEmail(email);
        if (!user) {
          return done(null, false);
        }

        const isPasswordValid = await compareData(password, user.password);
        if (!isPasswordValid) {
          return done(null, false);
        }
        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

// GIT

passport.use(
  new GithubStrategy(
    {
      clientID: "Iv1.95547a8d5e7ca361",
      clientSecret: "88a80637856a1083bffcebea11490c213cbf5690",
      callbackURL: "http://localhost:8080/api/sessions/callback",
      scope: ["user:email"]
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = (profile.emails && profile.emails.length > 0) ? profile.emails[0].value : null;
  
        if (!email) {
          return done(null, false, { message: 'No se proporcionó un correo electrónico.' });
        }
  
        const userDB = await usersManager.findByEmail(email);

        if (userDB) {
          if (userDB.isGitHub) {            
            return done(null, userDB);
          } else {            
            return done(null, userDB, { message: 'La cuenta ya existe pero no se registró a través de GitHub.' });
          }
        }


        const infoUser = {
          first_name: profile.username,
          last_name: profile.username,
          email: email,
          password: profile.id,
          isGithub: true,
        };
        
        const createdUser = await usersManager.createOne(infoUser);
        
        return done(null, createdUser);
      } catch (error) {
        return done(error);
      }
    }
  )
);
//GOOGLE

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: "1083132343292-qed9pr5e92ad2idicmf05m4fmm7sod71.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:8080/api/sessions/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      try {        
        const userDB = await usersManager.findByEmail(profile._json.email);
        
        // login
        if (userDB) {
          if (userDB.isGoogle) {
            return done(null, userDB);
          } else {
            return done(null, false);
          }
        }
        const hashedPassword = await hashData('12345');
        // signup
        const infoUser = {
          first_name: profile._json.given_name,
          last_name: profile._json.family_name,
          email: profile._json.email,
          password: hashedPassword,
          isGoogle: true,
        };
        const createdUser = await usersManager.createOne(infoUser);
        done(null, createdUser);
      } catch (error) {
        done(error);
      }
    }
  )
);

const fromCookies = (req) => {   
  return req.cookies.token;
};

// JWT
passport.use(
  "jwt",
  new JWTStrategy(
    {      
      jwtFromRequest: ExtractJwt.fromExtractors([fromCookies]),
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.secretKeyJWT,
    },
    async function (jwt_payload, done) {
      done(null, jwt_payload);
    }
  )
);

passport.serializeUser((user, done) => {
  // _id
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await usersManager.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
