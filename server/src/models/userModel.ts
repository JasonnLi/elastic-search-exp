import mongoose, {
  Schema,
  Document,
  PassportLocalModel,
} from "mongoose";
import * as bcrypt from "bcrypt";
import passportLocalMongoose from "passport-local-mongoose";

// Factor is to define the complexity of the encrypted password, by default is 10
let SALT_WORK_FACTOR = 10;

export interface IUser extends Document {
  validatePassword: any;
  userId: String;
  firstName: String;
  lastName: String;
  email: String;
  password: String;
  last_login_date: Date;
}

const UserSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    last_login_date: { type: Date, default: Date.now() },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

UserSchema.pre("save", async function (next) {
  let user: any = this;

  if (!user.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    user.password = await bcrypt.hash(user.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

UserSchema.methods.validatePassword = function (candidatePassword: string, next: any) {
  bcrypt.compare(candidatePassword, this.password)
        .then((isMatch) => {
          next(null, isMatch)
        })
        .catch((err) => {
          return next(err)
        })
};

// Passport-Local Mongoose will add hash and salt field to your userDB
UserSchema.plugin(passportLocalMongoose, { usernameField: "email" });

export default mongoose.model<IUser>("User", UserSchema) as PassportLocalModel<
  IUser
>;
