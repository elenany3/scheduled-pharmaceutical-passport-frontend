import React, { useState } from "react";
import { useRouter } from "next/router";
import { Post_Request } from "../services/axios"
import Head from "next/head";
import { Button, Form } from "react-bootstrap";
//login page
const login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [spin, setSpin] = useState(false);
  const handleLogin = (e) => {
    e.preventDefault();
    setSpin(true);
    Post_Request('auth/login', {
      email,
      password,
    }, "login").then((res) => {
      if (res.data) {
        localStorage.setItem('userData', JSON.stringify(res?.data?.data));
        window.location.reload(true);
      } else {
        setError(res?.message);
        setSpin(false);
      }
    }).catch((error) => {
      setError(error.response.data.message);
      setSpin(false);
    });
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <div className="about__content p-4 rounded-lg w-5/6 md:w-3/5 mint__card ">
        <h1 className="heading text-xl font-bold mb-5">Login </h1>
        <div className="mint__options flex justify-centre items-centre gap-x-2 m-5">
          <label className="text-lg block w-[30%]">Email:</label>
          <input
            type="text"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border text-sm rounded-md block w-[40%] h-full p-2.5 focus:outline-none focus:border-[#843cff] focus:ring-1 focus:ring-[#843cff]"
          />
        </div>
        <div className="mint__options flex justify-centre items-centre gap-x-2 m-5">
          <label className="text-lg block w-[30%]">Password:</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border text-sm rounded-md block w-[40%] h-full p-2.5 focus:outline-none focus:border-[#843cff] focus:ring-1 focus:ring-[#843cff]"
          />
        </div>
        <div className="mint__options flex justify-end items-centre gap-x-2 m-5">
          <Button
            className="p-2 bg-[#843cff] rounded-md w-[20%] text-white heading"
            onClick={spin ? () => console.log("Loading...") : handleLogin}
          >{spin ? "Loading..." : "LogIn"}</Button>
        </div>
        <label className="text-lg block w-[30%]">{error}</label>
        <div className="mint__options flex justify-start items-centre m-5">
          <a href="/airport" className="text-sm text-blue-500">Search On Prescriptions</a>
        </div>
      </div>
    </div>
  );
};

export default login;
