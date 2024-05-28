import React from "react";
import "../Signin/Signin.css";
import {useState} from "react";


const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        repassword: '',
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

        const signupData = {
            username: formData.username,
            email: formData.email,
            password: formData.password,
            repassword: formData.repassword,
        }
        console.log(signupData)
        fetch('http://localhost:8080/user/signup', {
            method: 'POST',
            body: JSON.stringify(signupData),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                if (data.msg == 'Invalid sign up information.'){
                    window.alert("請輸入所有資料")
                }
                else if (data.msg == 'user existed'){
                    window.alert("帳號已註冊")
                }else if (data.msg == 'Sign up Successfully.'){
                    window.alert("註冊成功，請登入後繼續使用")
                    window.location.replace("/signin");
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
                    <h1>Sign Up</h1>
                    <div className="info">
                        <input className="email" name="email" type="email" onChange={handleInputChange}
                               placeholder="Email"/> <br/>
                        <input className="email" name="username" type="username" onChange={handleInputChange}
                               placeholder="Username"/> <br/>
                        <input className="email" name="password" type="password" onChange={handleInputChange}
                               placeholder="Password"/>
                        <input className="email" name="repassword" type="password" onChange={handleInputChange}
                               placeholder="enter password again"/>
                    </div>
                    <div className="btn">
                        <button className="btn-primary" type="submit">Sign Up</button>
                    </div>
                    <div className="help">
                        <a href="/signin">Still have account? Sign in</a>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Signup;