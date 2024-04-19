
const loginBtn = document.getElementById('submit');
const signupBtn = document.getElementById('submitSignUp');
const forgetPwdBtn = document.getElementById('forgotPassword');


loginBtn.onclick = async function(event)    
{
    event.preventDefault();
            var femail = document.getElementById('femail').value;
            var fpassword = document.getElementById('fpassword').value;

            var obj ={
                femail,
                fpassword
            }
            try {         
             const response = await axios.post("http://localhost:3000/user/login", obj);
             alert("You have successully logged in");
             localStorage.setItem('token',response.data.token);
             window.location.href="../views/expense.html"
           
            }
             catch(err)  {
                this.errorMessage = err.message;
                alert("Username or Password is invalid")};
}

signupBtn.onclick = async function(event)
{
    event.preventDefault();
    window.location.href="../views/signup.html"
}

forgetPwdBtn.onclick = async function(event)
{
    event.preventDefault();
    window.location.href="../views/forget-pwd.html"
}
