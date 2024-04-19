
const signupBtn = document.getElementById('submit');

signupBtn.onclick = async function(event)    
{
    event.preventDefault();
            alert("The form is submited");
            var fname = document.getElementById('fname').value;
            var femail = document.getElementById('femail').value;
            var fpassword = document.getElementById('fpassword').value;

            var obj ={
                fname,
                femail,
                fpassword
            }
            try {         
             const response = await axios.post("http://localhost:3000/user/signup", obj);
             console.log(response)
           
            }
             catch(err)  {
                alert("User already exists");
             console.log(err)};
}
