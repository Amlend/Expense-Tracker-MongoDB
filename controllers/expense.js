 
const sequelize = require('../util/database');

const Expense = require('../models/expense');
const User = require('../models/Users');
const File = require('../models/fileData');
const s3Services = require('../services/s3service');

const postAddExpense = async (req,res,next)=>{
    
    const amount = req.body.amt;
    const description = req.body.description;
    const category = req.body.category;
    const userId = req.user._id;
   try{
        const exp = await Expense({
        amount: amount,
        description: description,
        category: category,
        userId: userId,
    })
    const result = await exp.save();
    req.user.addExpense(result);
            const expense = Number(req.user.totalExpense) + Number(amount);
            User.updateOne({_id : userId},
                {totalExpense: expense}
                 )
                 .then(async()=>{
                console.log("Expense updated");  
            })
            .catch(async (err) => {
                console.log(err);
            })
            res.status(200).json({
            success: true,
            message:"Successfully added expense ",
            expense:result
            })
   
   }
    catch(err) { 
        console.log(err)}
}

const getAllExpense = async (req,res,next) => {
   
    const showItem = Number(req.header('Showitem')) || 10;
    try {
        const page = +req.query.page || 1;
        const LIST_PER_PAGE =showItem;
        const expenses = await Expense.find({userId : req.user._id})
            .skip((page-1) * LIST_PER_PAGE)
            .limit( LIST_PER_PAGE)

        let totalItems = await Expense.countDocuments({userId : req.user._id});
        console.log("GET CALL");
        return res.status(200).json({
            expenseData: expenses,
            currentPage: page,
            hasNextPage: LIST_PER_PAGE*page < totalItems,
            nextPage: page + 1,
            hasPreviousPage: page - 1,
            lastPage: Math.ceil(totalItems/ LIST_PER_PAGE) 
    });
    }
    catch(err) { console.log(err)}
};

const deleteExpenseById = async (req,res,next) =>{
    
    const exId = req.params.expenseId;
    if(exId == undefined || exId.length === 0)
    {      
            res.status(400).json({
            error : {
            success: false,
            message:"No such item exists"
            }
        })
    }
    try{
        
        const deleteExpense = await Expense.findOne({_id:exId}) 
        await Expense.deleteOne({_id:exId})
            const verifiedExpense = Number(req.user.totalExpense) - Number(deleteExpense.amount);
             req.user.deleteExpense(exId);
            User.updateOne({id : req.user._id},
                {totalExpense : verifiedExpense})
                .then(async()=>{
                    console.log("totalExpense updated after Deletion");  
                })
                .catch(async (err) => {
                    console.log(err);
                })
          
        res.status(200).json({
        success: true,
        message:"Successfully deleted "
})
    }
    catch(err){console.log(err)}
}

const downloadFile = async(req, res, next) => {

    const userId = req.user._id;
    const isPremium = Boolean(req.user.isPremium);
    try{
            if(isPremium === false)
            {
                return res.status(401).json({
                    error : {
                        success: false,
                        message: "Unauthorised" 
                    }
                })
            }
            else {
                const user = User.find({_id:userId})
                user.populate('expenses.items.expenseId')
                .exec()
                .then(user => {
                    const expenses = user.expenses.items;
                    console.log(expenses);
                    const stringifiedExpenseData = JSON.stringify(expenses);
                    const filename = `Expense${userId}/${new Date()}.text`;
    
                })
                // console.log(expenses);
                // const stringifiedExpenseData = JSON.stringify(expenses);
                // const filename = `Expense${userId}/${new Date()}.text`;
              //  const fileUrl = await s3Services.uploadToS3(stringifiedExpenseData,filename);
             
             req.user.addFile('file');
            //   await File.create({
            //         fileUrl: fileUrl
            //     })
                res.status(200).json({
                    fileUrl, 
                    success : true,
                    message : "File download successful"
                })
            }
    }
    catch(err){
      console.log(err);
    }
}

const fileHistory = async(req, res,next) => {
    
    const isPremium = Boolean(req.user.isPremium);
    try {
        if(isPremium === true){
        User.find({_id : req.user._id})
        .populate('fileData.items')
        .exec()
        .then((file) => {
            console.log("GET CALL");
            const fileData = file[0].fileData.items;
            //console.log(file);
            return res.status(200).json({
                fileData,
                success: true,
                message: "File data retrived"
            });
        })
           
        }

        else
        {
            res.status(401).json({
                error:{
                    success: false,
                    message:"Unauthorised"
                }
            })
        }
        }
        catch(err) { console.log(err)}

}


module.exports = {
    postAddExpense,
    getAllExpense,
    deleteExpenseById,
    downloadFile,
    fileHistory
}