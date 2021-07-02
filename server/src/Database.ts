import mongoose from 'mongoose';

export class Database {
  connect(connString: string) {
    if (!connString) {
      throw new Error("No connection string specified");
    }

    return new Promise((resolve, reject) => {
      mongoose
        .connect(connString, { useNewUrlParser: true })
        .then(() => {
          console.log(`Successfully connected to ${connString}`);
          resolve();
        })
        .catch((error) => {
          console.error("Error connecting to database: ", error);
          reject(error);
          return process.exit(1);
        });
    });
    mongoose.connection.on("disconnected", this.connect);
  }
}
