'use client'
import axios from 'axios';
import { useFormik } from 'formik';
import React from 'react'
import toast from 'react-hot-toast';

const Login = () => {

  const loginform = useFormik(
    {
       initialValues: {// initial value isliye dete hai kyuki wo pahle se hi show hoti hai
        email: '',
        password: ''
      },
      onSubmit: (values,{resetForm}) => {
        console.log(values);
        // axios data ko backend me bhejne ke liye use krte hai
        axios.post('http://localhost:4000/user/authenticate', values)
          .then((result) => {
            toast.success("Login Successfully");
            console.log(result.data);
            localStorage.setItem("token", result.data.token); 
            localStorage.setItem("role", result.data.user.role);
            // setEmail("");
            // setPassword("");
                      resetForm();


          }).catch((err) => {
            toast.error("Login Failed");
            console.log(err);


          });
      }
    }
  )
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center "
      // style={{
      //   backgroundImage:
      //     "url('https://mdbootstrap.com/img/Photos/Horizontal/Nature/6-col/img%20(122).jpg')", // replace with your image
      // }}
    >
      <div className="bg-white/90 shadow-2xl rounded-2xl flex overflow-hidden max-w-4xl w-full backdrop-blur-sm">
        {/* Left Side - Illustration */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-b from-blue-500 to-blue-700 items-center justify-center relative">
          <img
            src="https://mdbootstrap.com/img/Photos/Horizontal/Nature/6-col/img%20(122).jpg"
            alt="Illustration"
            className="object-cover w-full h-full opacity-400"
          />
          <div className="absolute text-white text-center px-6">
            <h2 className="text-3xl font-bold"></h2>
            <p className="mt-2 text-sm text-gray-200">
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Login</h2>

          <form
          onSubmit={loginform.handleSubmit}
          className="space-y-5">
            
            
            {/* Email */}
            <div>
              <label className="block text-gray-600 font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                 onChange={loginform.handleChange}
                 value={loginform.values.email}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-600 font-medium mb-2">Password</label>
              <input
                type="password"
                name="password"
                 onChange={loginform.handleChange}
                 value={loginform.values.password}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black focus:outline-none"
                required
              />
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox" />
                <span className="text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-blue-600 hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Next →
            </button>
          </form>

          {/* Signup link */}
          <p className="mt-6 text-center text-gray-600">
            Don’t have an account?{" "}
            <a href="/signup" className="text-blue-600 font-semibold hover:underline">
              Create account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
