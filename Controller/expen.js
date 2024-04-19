const express = require("express");
const User = require("../Models/UserExpense");
const sequelize = require("sequelize");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { ObjectId } = require("mongoose");

const downloadurl = require("../Models/downloadUrl");

const User1 = require("../Models/user");
const Expense = require("../Models/UserExpense");

const AWS = require("aws-sdk");
const { ObjectID } = require("bson");

exports.getUser = async (req, res, next) => {
  console.log("bbbbbb", req.user._id, "bbbbbb");
  let limit_items = req.body.itemsPerPage || 2;

  let page = req.params.page || 1;

  let totalItems;
  Expense.count({ userId: req.user._id })
    .then((totalProducts) => {
      totalItems = totalProducts;
      return Expense.find({ userId: req.user._id })
        .skip((page - 1) * limit_items)
        .limit(limit_items);
    })
    .then((products) => {
      console.log("))))))))))))", products);
      res.status(200).json({
        products,
        success: true,
        data: {
          currentPage: page,
          hasNextPage: totalItems > page * limit_items,
          hasPreviousPage: page > 1,
          nextPage: +page + 1,
          previousPage: +page - 1,
          lastPage: Math.ceil(totalItems / limit_items),
        },
      });
    });
  //     let page = req.params.page || 1
  //     let limit_items = +(req.body.itemsPerPage) || 2 ;

  //     let totalItems

  //     try {
  //         let count = await Expense.find().count()
  //         totalItems = count ;
  // console.log(count,"mmmmmm")
  //         let products = await Expense.find({userId: req.user._id}).skip((page-1)*limit_items).limit(limit_items)
  //         console.log(products,"kkkkkkkkkk")

  //         res.status(200).json({ products,
  //                         data: {

  //                           currentPage: page,
  //                           hasNextPage:
  //                           totalItems > page * limit_items,
  //                           hasPreviousPage: page > 1,
  //                           nextPage: +page + 1,
  //                           previousPage: +page - 1,
  //                           lastPage: Math.ceil(totalItems / limit_items),
  //                         },
  //         })
  //     } catch (error) {
  //         res.status(500).json({message:'unable to get expwnse'})
  //     }
};

exports.getAllusersforPremimum = (req, res, next) => {
  User1.find({ attributes: ["id", "name", "email"] })
    .then((users) => {
      res.status(200).json({ users });
    })

    .catch((err) => {
      res.status(500).json({ err });
    });
};

exports.postExpensespreminm = (req, res, next) => {
  console.log(req.body, ">>>>");
  const vc = req.body.OBJ;

  const _id = ObjectID(vc);
  console.log(">>>.", _id);
  User.find({ userId: _id })
    .then((response) => {
      console.log(response);
      res.status(200).json({ response });
    })
    .catch((err) => {
      res.status(500).json({ err });
    });
};

exports.postAddExpense = async (req, res, next) => {
  console.log(">>>>>>>>>>>>>>>", req.body);
  try {
    const amt = req.body.Amount;
    const des = req.body.Description;
    const category = req.body.Category;

    const data = await User.create({
      amount: amt,
      description: des,
      category: category,
      userId: req.user._id,
    });

    res.status(201).json({ NewUser: data });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const expenseId = req.params.id;

    let expense = await User.findById(expenseId);
    // console.log(expense)
    if (!expense) {
      return res.status(404).json({ message: "expense not found" });
    }

    if (expense.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json("Not Allowed");
    }
    await Expense.findByIdAndRemove(expenseId);
    res.status(200).json({ message: "deleted sucessfully" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

function uploadtoS3(data, filename) {
  const BUCKET_NAME = process.env.BUCKET_NAME;
  const IAM_USER_KEY = process.env.IAM_USER_KEY;
  const IAM_SECRET_KEY = process.env.IAM_USER_SECRET;

  let s3Bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_SECRET_KEY,
  });

  //create bucket with parameter to upload
  //our bucket is already created in S3, so no need to create again

  var params = {
    Bucket: BUCKET_NAME,
    Key: filename,
    Body: data,
    ACL: "public-read", // to give public access to file
  };

  return new Promise((resolve, reject) => {
    s3Bucket.upload(params, (err, s3response) => {
      if (err) {
        console.log("something went wrong");
      } else {
        console.log(s3response);
        resolve(s3response.Location);
      }
    });
  });
}

exports.downloadExpense = async (req, res, next) => {
  User.find({ userId: req.user._id })
    .then(async (response) => {
      // console.log()
      const expenseStringify = JSON.stringify(response);

      const filename = "Expense.txt";

      const fileurl = await uploadtoS3(expenseStringify, filename);

      downloadurl.create({
        fileName: filename,
        fileUrl: fileurl,
        userId: req.user.id,
      });

      res.status(200).json({ fileurl, filename, sucess: true });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.downloadAllUrl = async (req, res, next) => {
  downloadurl
    .find({ where: { userId: req.user._id } })
    .then((urls) => {
      if (!urls) {
        res
          .status(404)
          .json({ message: "no urls found with this user", success: false });
      }
      res.status(200).json({ urls, success: true });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ err });
    });
};

// exports.editUser= async (req,res,next)=>{
//         // const id=req.params.id;
//         // console.log("vvvvvvvvvvvvvvvvvvvvvvvvvvvvvv")
//         //  console.log(req.body)
//         // const UpdatedAmount=req.body.Amount;
//         // const UpdatedDescription=req.body.Description;
//         // const UpdatedCategory=req.body.Category;

//         // const data= User.findByPk(id)
//         // .then(user=>{
//         //     user.Amount=UpdatedAmount;
//         //     user.Description=UpdatedDescription;
//         //     user.Category=UpdatedCategory;
//         //     user.save()
//         //     res.status(201).json({UpdatedUser:data})
//         // })
//         // .catch(err=>{
//         //     res.status(500).json({error:err})
//         // })
//         try{
//             const id=req.params.id;

//             const data=await User
//             .destroy({where:{id:id}})

//             res.status(200).json({message:"Successful"})
//         }

//         catch(err){
//             res.status(500).json({error:err})
//         }

// }
