import fs from "fs-extra";
import path from "path";

export async function generateUserModel(answers, projectPath, ext) {
  let userModel = "";

  if (answers.database === "MongoDB") {
    userModel = answers.language === "TypeScript"
      ? `
import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
`
      : `
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
`;
  } else if (answers.database === "MySQL" || answers.database === "PosgreSQL") {
    userModel = answers.language === "TypeScript"
      ? `
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/dbConfig";

class User extends Model {
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
}

User.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    username: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
  },
  {
    sequelize,
    tableName: "users",
  }
);

export default User;
`
      : `
const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/dbConfig");

class User extends Model {}

User.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    username: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
  },
  {
    sequelize,
    tableName: "users",
  }
);

module.exports = User;
`;
  }

  await fs.writeFile(path.join(projectPath, `src/models/User.${ext}`), userModel);
}
