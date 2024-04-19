

const ulTag = document.getElementById('expense-list');
const ldTag = document.getElementById('leaderboard-user');
const premiumTag = document.getElementById('premium-user');
const fileHistoryTag = document.getElementById('file-history');
const pagination = document.getElementById('pagination');
const premiumBtn = document.getElementById('rzp-btn');
const leaderBoardBtn = document.createElement('button');
const addExpenseBtn = document.getElementById('submit');
const downloadFileBtn = document.getElementById('download-btn');
const rowPerPage = document.querySelector('#rows-per-page');
const downloadFileHistoryBtn = document.getElementById('download-file-history');
const logoutBtn = document.getElementById('logout-btn');


const token = localStorage.getItem('token');



//Submit Function
addExpenseBtn.onclick = async function (event){
   event.preventDefault();
    alert("This Form is submited");

    var amt = document.getElementById('expenseAmt').value;
    var description = document.getElementById('chooseDescription').value;
    var category = document.getElementById('chooseCategory').value;
   
        var obj =
        {
            amt,
            description,
            category,
        }
        let response;
        try {   
        response = await axios.post("http://localhost:3000/expense/expenses",obj,{headers: {"Authorization" : token}});
        console.log(response.data.expense);    
        }

        catch (error) {
            console.log(error);
        }
        printTheListForAddExpense(obj, response.data.expense);
}

//populate list when an expense is added
function printTheListForAddExpense(obj, res){
   console.log(res._id)
   var list = document.createElement('li');
   list.className="list-group-item";
   list.id=`${res._id}`;
   
   //Delete Button
   var deleteBtn = document.createElement('button');
   deleteBtn.className="btn btn-sm delete ml-10 mr-10 float-right";
   deleteBtn.appendChild(document.createTextNode('Delete'));
   deleteBtn.onclick = (async () => {

      if(confirm('Do you want to delete ? '))
            {
               
               try{
               const response = await axios.delete(`http://localhost:3000/expense/${res._id}`, {headers: {"Authorization" : token}});
               console.log(response);
               var deleteli = document.getElementById(`${res._id}`);
               ulTag.removeChild(deleteli);
               }
               catch(error) {
                  console.log(error)
               }
            }
      })

   //Data ShowCased on the screen
   list.textContent = obj.amt+" "+obj.description+" "+obj.category+" ";
   list.appendChild(deleteBtn);

   ulTag.appendChild(list);
}


//Populate the Data from Local Storage onto The screen on Screen Refresh along with pagination
window.onload = (async () => {
   const page = 1;
   try {
      const LIST_PER_PAGE = localStorage.getItem('showItem');
      disablePremiumBtnOnwindowLoad(token);
      const response = await axios.get(`http://localhost:3000/expense/expenses?page=${page}` , {headers: {"Authorization" : token,"Showitem" :LIST_PER_PAGE }});
       showExpenseItemsOnScreen(response.data.expenseData);
      showPagination(response.data);
   }
   catch (error)
   {
      console.log(error);
   }
   
})


//populate list on screen
function showExpenseItemsOnScreen(obj)
{  
      ulTag.innerHTML='';
      for(let i = 0 ; i<obj.length; i++)
         {
            var list = document.createElement('li');
            list.className="list-group-item";
            list.id=`${obj[i]._id}`;
            
            //Delete Button
            var deleteBtn = document.createElement('button');
            deleteBtn.className="btn btn-sm delete ml-10 mr-10 float-right";
            deleteBtn.appendChild(document.createTextNode('Delete'));
            deleteBtn.onclick = (async () => {

               if(confirm('Do you want to delete ? '))
                     {
                        
                        try{
                        const response = await axios.delete(`http://localhost:3000/expense/${obj[i]._id}`, {headers: {"Authorization" : token}});
                        console.log(response);
                        var deleteli = document.getElementById(`${obj[i]._id}`);
                        ulTag.removeChild(deleteli);
                        }
                        catch(error) {
                           console.log(error)
                        }
                     }
               })

            //Data ShowCased on the screen
            list.textContent = Number(obj[i].amount)+" "+obj[i].description+" "+obj[i].category+" ";
            list.appendChild(deleteBtn);

            ulTag.appendChild(list);
      }
   }


logoutBtn.onclick = async function(event) {
   localStorage.clear();
   event.preventDefault();
 
    window.location.href="../views/login.html"
}

//when user buys premium account
premiumBtn.onclick = async function (event)
{
   const response = await axios.get('http://localhost:3000/purchase/premium',{headers: {"Authorization" : token}});
   //
   var options = {
      "key": response.data.key_id,
      "order_id": response.data.order.id,
      "handler" : async function (response) {
         await axios.post('http://localhost:3000/purchase/updateTransaction',{
         order_id: options.order_id,
         payment_id: response.razorpay_payment_id,
         }, {headers : {"Authorization" : token}});
         disableThePremiumBtn();
         alert('You are a Premium User now');
         

      }
   };

   const rzp1 = new Razorpay(options);
   rzp1.open();


   rzp1.on('payment.failed', function (response){
      console.log(response)
      alert('Something went wrong');
   });
}

 
//when user buys premium account the buy premium btn is disabled
function disableThePremiumBtn() {
   var buyPremiumBtn = document.getElementById('rzp-btn');
   buyPremiumBtn.className="btn-right-display";
   disablePremiumBtnOnwindowLoad(token);
}

//when users account is premium buy btn's display in none
async function disablePremiumBtnOnwindowLoad(token) {
   try {
      const response = await axios.get('http://localhost:3000/user/UserByToken/', {headers: {"Authorization" : token}});

      if(response.data.isPremium === true){
         var buyPremiumBtn = document.getElementById('rzp-btn');
         buyPremiumBtn.className="btn-right-display";  
         var para = document.createElement('p');
         para.className = 'premium-class';
         para.innerHTML= 'Premium User';
         premiumTag.appendChild(para);
         
       
         leaderBoardBtn.id="leaderBoard-btn";
         leaderBoardBtn.className="btn2-right";
         leaderBoardBtn.appendChild(document.createTextNode('Leaderboard'));
         document.getElementById('premium-feature').appendChild(leaderBoardBtn)
      }
   }
   catch (error)
   {
      console.log(error);
   }
}

//leaderboard btn is available for premium account
leaderBoardBtn.onclick = async function (event){
                 
   try{
    const response = await axios.get('http://localhost:3000/premium/leaderBoard', {headers: {"Authorization" : token}});
    console.log(response);
    ldTag.innerHTML =''   
    ldTag.innerHTML += '<h3>Leader Board</h3>'
    response.data.forEach((userInfro) => {
      ldTag.innerHTML += `<li>Name : ${userInfro.name} -  Total Expense : ${userInfro.totalExpense}`
   })
   }
   catch(error) {
      console.log(error)
   }
}

//download btn is authorised only for premium account
downloadFileBtn.onclick = async function(event){

try
{
   const response = await axios.get('http://localhost:3000/expense/downloadfile',{headers :{"Authorization " : token}})
    if(response.status === 200)
    {
      var a = document.createElement('a');
      a.href = response.data.fileUrl;
      a.download = 'myexpense.csv';
      a.click();
    }
    else
    throw new Error(response.data.message);
}

catch(err)
{

}
}   

//file history btn is authoried only for premium account
downloadFileHistoryBtn.onclick = async function(event){
  
try{
   const response = await axios.get('http://localhost:3000/expense/filehistory',{headers: {"Authorization": token}});
   fileHistoryTag.innerHTML =''
   console.log(response);
   fileHistoryTag.innerHTML += '<h3>List of Downloaded Files : </h3>'
   console.log(response.data.fileData);
   if(response.data.fileData.length == 0)
   {
      fileHistoryTag.innerHTML +='<p>No files downloaded</p>'
   }
   var j = 1; 
   for(let i = 0 ; i<response.data.fileData.length; i++)
    {
      fileHistoryTag.innerHTML += `<li><a  href = "${response.data.fileData[i].fileUrl}">File ${j}</a>`
      j++;
    }
}
catch(err){
console.log(err)
}
}


//dynamic Pagination
rowPerPage.onchange = storeInLocal;
async function storeInLocal()
{
   localStorage.setItem('showItem',this.value);
  getExpenses(1)
}

//showPagination 
function showPagination({
   currentPage,
   hasNextPage,
   nextPage,
   hasPreviousPage,
   lastPage,
}){
   pagination.innerHTML ='';
   if(hasPreviousPage){
      const btn2 = document.createElement('button')
      btn2.innerHTML = hasPreviousPage
      btn2.addEventListener('click', () => getExpenses(hasPreviousPage))
      pagination.appendChild(btn2)
   }

      const btn1 = document.createElement('button')
      btn1.innerHTML = `<h3>${currentPage}</h3>`
      btn1.addEventListener('click', () => getExpenses(currentPage))
      pagination.appendChild(btn1)
      
      if(hasNextPage){
         const btn3 = document.createElement('button')
         btn3.innerHTML = nextPage
         btn3.addEventListener('click', () => getExpenses(nextPage))
         pagination.appendChild(btn3)
      }
   }


//getExpenses when the page number is changed    
  async function getExpenses(page)
   { 
      const LIST_PER_PAGE = localStorage.getItem('showItem');
     
      try{
         const response = await axios.get(`http://localhost:3000/expense/expenses?page=${page}` , {headers: {"Authorization" : token, "Showitem" :LIST_PER_PAGE }}); 
            showExpenseItemsOnScreen(response.data.expenseData);
         showPagination(response.data);
      }
      catch(err){
         console.log(err)
      }
}



   



