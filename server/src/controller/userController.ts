import { Request, Response, Router } from "express";
import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { IDecodedToken } from "./authController";
import RefreshToken, {IRefreshToken} from "../models/refreshTokenModel"
import User from "../models/userModel";
// handling error message
const HTTP_INTERNAL_SERVER_ERROR = 500;
const HTTP_NOT_FOUND = 404;
const HTTP_BAD_REQUEST = 400;
// create http only cookie with refresh token that expires in 600 seconds
const cookieOptions = {
  httpOnly: true,
  expires: new Date(Date.now() + 600)
};

export class UserController {
  private router: Router;

  mount(parentRouter: Router) {
    this.router = express.Router();

    this.router.get("/", (req, res) => {
      res.render("index", { user: req.user });
    });

    this.router.get("/register", (req, res) => {
      res.render("register", {});
    });

    this.router.post("/register", this.registerUser);

    // local authenticate strategy does not work here when using JWT, thus a customised strategy is applied
    this.router.post("/login", this.userLogin);

    this.router.get("/login", this.getUser);

    this.router.get("/logout", this.userLogout);

    this.router.post("/refresh-token", this.refreshToken);

    parentRouter.use("/users", this.router);
  }

  private async registerUser(req: Request, res: Response) {
    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email.toLowerCase(),
      password: req.body.password,
    });
    User.register(newUser, req.body.password, (err) => {
      // handling the error that the user already exists
      if (err) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        return res.json({ err: err });
      } else {
        passport.authenticate("local")(req, res, () => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({ success: true, status: "Registration successfully!" });
        });
      }
    });
  };

  private async userLogin(req: Request, res: Response) {
    try {
      const email = req.body.email.toLowerCase();
      const password = req.body.password;
      const ipAddress = req.ip;
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ emailnotfound: "Email not found" });
      }
      user.validatePassword(password, async (err: any, isMatch: boolean) => {
        if (err) {
          throw err;
        } else if (isMatch) {
          // update the last login date
          const filter = { email: email };
          const update = { last_login_date: new Date(Date.now()) }; // changing Date.now() to date type
          const options = { new: true };
          await User.findOneAndUpdate(filter, update, options, function (error) {
            if (error) {
              console.log(error);
              return;
            }
          });
          const payload = { id: user.id, name: user.firstName };
          // generate jwt with setting of expiration after 600 secondes
          const jwtToken = jwt.sign(payload, process.env.KEYS, { expiresIn: 60 });
          // generate refreshToken and store in the db
          // crypto.randomBytes(40).toString('hex') could be used for generated random num as refresh token
          const refreshToken = jwt.sign(payload, process.env.REFRESH_KEYS, { expiresIn: 600 });
          const newRefreshToken = {
            userId: user.id,
            token: refreshToken,
            expires: new Date(Date.now() + 600),
            createdByIp: ipAddress,
          };
          await RefreshToken.create(newRefreshToken);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.cookie('refreshToken', refreshToken, cookieOptions);
          res.send({
            success: true,
            token: "Bearer " + jwtToken,
            refreshToken: "Bearer " + refreshToken,
            status: "You are successfully login!"
          })
        } else {
          res.statusCode = 400;
          return res.json({ passwordincorrect: "Password incorrect" });
        }
      })
    } catch (err) {
      return res.status(HTTP_INTERNAL_SERVER_ERROR).send({ message: err });
    }
  };

  private async refreshToken(req: Request, res: Response) {
    const token = req.cookies.refreshToken;
    const ipAddress = req.ip;

    if (token == null) {
      return res.sendStatus(401).json("No authentication token, authorization failed");
    }
    const refreshTokens = await RefreshToken.findOne({ token: token });
    if (refreshTokens == null) {
        return res.sendStatus(403).json("No authentication token, authorization failed");
    }
    jwt.verify(token, process.env.REFRESH_KEYS, async (err: any, decodedToken: IDecodedToken) => {
      if (err) {
        return res.sendStatus(401).json("Invalid token");
      }
      // update the refresh token and revoke the old one
      const updatedRefreshToken = jwt.sign({ id: decodedToken.id }, process.env.REFRESH_KEYS, { expiresIn: 600 });
      refreshTokens.revoked = new Date(Date.now());
      refreshTokens.revokedByIp = ipAddress;
      refreshTokens.replacedByToken = updatedRefreshToken;
      const newRefreshToken = {
        userId: decodedToken.id,
        token: updatedRefreshToken,
        expires: new Date(Date.now() + 600),
        createdByIp: ipAddress,
      };
      await RefreshToken.updateOne({ userId: decodedToken.id }, refreshTokens);
      await RefreshToken.create(newRefreshToken);
      // sign new token
      const jwtToken = jwt.sign(
        { id: decodedToken.id, name: decodedToken.name },
        process.env.KEYS,
        { expiresIn: 60 }
      )
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.send({
        success: true,
        token: "Bearer " + jwtToken,
        newRefreshToken: "Bearer " + updatedRefreshToken,
        status: "You are successfully refresh the token!"
      })
    })
  }

  // Not yet complete for this method
  private async getUser(req: Request, res: Response) {
    try {
      const query = {
        email: req.body.email
      };
      const user = await User.findById(req.body.id);
      if (!user) {
        return res.status(HTTP_NOT_FOUND).send({ message: "Not Found" });
      }
      return res.send(user);
    } catch (err) {
      res.status(HTTP_INTERNAL_SERVER_ERROR).send(err);
    }
  };

  private async userLogout(req: Request, res: Response) {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          return err;
        }
      });
      res.clearCookie("session-id");
      res.redirect("/");
    }
  };
}

/*
(error, token) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.send({
    success: true,
    token: "Bearer " + token,
    status: "You are successfully login!",
  });
}
*/
