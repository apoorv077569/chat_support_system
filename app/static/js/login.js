import { apiPost } from "./services/api_service.js";

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit",async (e) =>{
    e.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.password.value;

    const result = await apiPost("/api/auth/login",{email,password});
    if(result.access_token){
        localStorage.setItem("token",result.access_token);
        alert("Login Sucessfull");
        window.location.href = "/api/tickets/"
        console.log("token",result.access_token);
    }else{
        alert(result.error || result.details || "Login Failed");
        
    }
})