import { apiPost } from "./services/api_service.js";

const signupForm = document.getElementById("signupForm");

signupForm.addEventListener("submit",async (e) =>{
    e.preventDefault();
    const name = signupForm.name.value;
    const email = signupForm.email.value;
    const password = signupForm.password.value;

    const result = await apiPost("/api/auth/register",{name,email,password});
    if(result.message){
        alert(result.message);
        window.location.href = "/api/auth/login"
    }else{
        alert(result.error || result.details || "Signup Failed");
    }
})