console.log("hi, i'm from JavaScript");

document.getElementById("login-btn").addEventListener("click", function(){
    const userInput = document.getElementById("input-username");
    const userName = userInput.value;

    const inputPass = document.getElementById("input-pass");
    const pass = inputPass.value;

    if(userName=="admin" && pass=="admin123"){
        alert("Sign In Success");

        window.location.assign("/home.html");
    } else{
        alert("login Failed");
        return;
    }
});