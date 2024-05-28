import React from "react";
import "./Signin.css";
import {useState} from "react";
import Cookies from 'js-cookie';


const Signin = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const signinData = {
            username: formData.username,
            password: formData.password,
        }
        console.log(signinData)
        fetch('http://localhost:8080/user/signin', {
            method: 'POST',
            body: JSON.stringify(signinData),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                if (data.msg == 'Invalid log in information.'){
                    window.alert("登入錯誤")
                }else if (data.msg == 'user not found'){
                    window.alert("找不到此用戶,請先註冊帳號")
                }else if (data.msg == 'Sign in Successfully.'){
                    Cookies.set('jwt', data.data.token);
                    localStorage.setItem("loginResult", JSON.stringify(data.data))
                    window.alert("登入成功")
                    window.location.replace("/");
                }
                // Handle the response data
            })
            .catch((error) => {
                // Handle any errors
            });
    };
    return (
        <div className="showcase-content">
            <div className="formm">
                <form onSubmit={handleSubmit}>
                    <h1>Sign In</h1>
                    <div className="info">
                        <input className="email" type="username" name="username" placeholder="Username" onChange={handleInputChange}/> <br/>
                            <input className="email" type="password" name="password" placeholder="Password" onChange={handleInputChange}/>
                    </div>
                    <div className="btn">
                        <button className="btn-primary" type="submit">Sign In</button>
                    </div>
                    <div className="help">
                        <a href="/signup">Sign up</a>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Signin;