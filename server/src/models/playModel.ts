import mongoose, { Schema, Document } from 'mongoose';

export interface IPlay extends Document {
    Dataline: Number;
    Play: String;
    PlayerLinenumber: Number;
    ActSceneLine: String;
    Player: String;
    PlayerLine: String
};

const UserSchema: Schema = new Schema({
    Dataline: {type: Number, required: true},
    Play: {type: String, required: true},
    PlayerLinenumber: {type: Number},
    ActSceneLine: {type: String},
    Player: {type: String},
    PlayerLine: {type: String}
});

// Export the model and return your IUser interface
export default mongoose.model<IPlay>('Play', UserSchema);
