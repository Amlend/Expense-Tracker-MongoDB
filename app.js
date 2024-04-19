const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const fs = require("fs");
require("dotenv").config();

const bodyParser = require("body-parser");
const sequelize = require("./util/database");

const mongoose = require("mongoose");

const User = require("./models/Users");
const Expense = require("./models/expense");
const Order = require("./models/order");
const ForgetPwd = require("./models/forgetPassword");
const File = require("./models/fileData");

const app = express();

const expenseRoutes = require("./routes/expense");
const passwordRoutes = require("./routes/password");
const premiumRoutes = require("./routes/premium");
const purchaseRoutes = require("./routes/purchase");
const userRoutes = require("./routes/user");

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);
app.use(cors());
app.use(morgan("combined", { stream: accessLogStream }));

app.use(bodyParser.json({ extended: false }));
app.use(expenseRoutes);
app.use(passwordRoutes);
app.use(premiumRoutes);
app.use(purchaseRoutes);
app.use(userRoutes);

app.use((req, res) => {
  res.sendFile(path.join(__dirname, `${req.url}`));
});

// User.hasMany(Expense);
// Expense.belongsTo(User,{constraints: true, onDelete: 'CASCADE'});

// User.hasMany(Order);
// Order.belongsTo(User,{constraints: true, onDelete: 'CASCADE'});

// User.hasMany(ForgetPwd);
// ForgetPwd.belongsTo(User,{constraints: true, onDelete: 'CASCADE'});

// User.hasMany(File);
// File.belongsTo(User,{constraints: true, onDelete: 'CASCADE'});

mongoose
  .connect(
    "mongodb+srv://amlend:riverdale@cluster0.gxjlxqy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
