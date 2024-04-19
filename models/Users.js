const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
 name: {
       type : String,
       required : true
 },
 email: {
        type: String,
        required : true
 },
 password: {
        type: String,
       required : true
 },
 isPremium: {
       type: Boolean
},
totalExpense: {
       type: Number,
       default: 0,
 },
expenses: {
       items : [{
         expenseId : {type: Schema.Types.ObjectId, ref:'Expense', required: true }
       }]
},
fileData: {
       items : [{
          fileUrl : {type: String}
      }]
}
});

userSchema.methods.addExpense = function (expense){
       const updatedExpensesItems = [...this.expenses.items];
       updatedExpensesItems.push({expenseId : expense._id});
       const updatedExpense = {items: updatedExpensesItems};
       this.expenses = updatedExpense;
       return this.save();

}

userSchema.methods.deleteExpense = function(expenseId) {
       const updatedExpensesItems = this.expenses.items.filter(item => {
       return item.expenseId.toString() !== expenseId.toString();
           });
   
           this.expenses.items = updatedExpensesItems;
           return this.save();
   }

userSchema.methods.addFile = function (fileUrl) {

       const updatedFileItems = [...this.fileData.items];
       updatedFileItems.push(fileUrl);
       const updatedFile = {items: updatedFileItems };
       this.fileData = updatedFile;
       return this.save();

}

module.exports = mongoose.model('User',userSchema);