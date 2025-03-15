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
}, { timestamps: true });

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
`.trim()
      : `
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);
module.exports = User;
`.trim();
  } else if (answers.database === "MySQL" || answers.database === "PostgreSQL") {
    userModel = answers.language === "TypeScript"
      ? `
import { DataTypes, Model, Optional } from "sequelize";
import db from "../config/dbConfig";

interface UserAttributes {
  id: number;
  username: string;
  email: string;
  password: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserCreationAttributes> 
  implements UserAttributes {
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize: db.connection,
    modelName: "User",
    tableName: "users",
    timestamps: true
  }
);

export default User;
`.trim()
      : `
const { DataTypes, Model } = require("sequelize");
const db = require("../config/dbConfig");

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize: db.connection,
    modelName: "User",
    tableName: "users",
    timestamps: true
  }
);

module.exports = User;
`.trim();
  }

  // Ensure models directory exists
  await fs.ensureDir(path.join(projectPath, "src/models"));
  
  await fs.writeFile(
    path.join(projectPath, `src/models/User.${ext}`),
    userModel
  );
}