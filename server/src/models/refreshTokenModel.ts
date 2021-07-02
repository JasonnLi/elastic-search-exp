import mongoose, { Schema, Document } from "mongoose";

export interface IRefreshToken extends Document {
    userId: String;
    token: String;
    expires: Date;
    created?:  Date;
    createdByIp?: String;
    revoked?: Date;
    revokedByIp?: String;
    replacedByToken?: String
}

const RefreshTokenSchema: Schema = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    token: { type: String, required: true },
    expires: { type: Date, required: true },
    created: { type: Date, default: Date.now },
    createdByIp: { type: String },
    revoked: { type: Date },
    revokedByIp: { type: String },
    replacedByToken: { type: String }
});

// virtual properties don’t get persisted in the database, commonly used in full name prop, which consists of fName and lName
RefreshTokenSchema.virtual('isExpired').get(function () {
    return Date.now() >= this.expires;
});

RefreshTokenSchema.virtual('isActive').get(function () {
    return !this.revoked && !this.isExpired;
});

RefreshTokenSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        // remove these props when object is serialized
        delete ret._id;
        delete ret.id;
        delete ret.userId;
    }
});

export default mongoose.model<IRefreshToken>('RefreshToken', RefreshTokenSchema);
