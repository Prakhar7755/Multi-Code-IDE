import { useState } from "react";
import logo from "../images/logos/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { api_base_url } from "../helper.js";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  const navigate = useNavigate();

  const submitForm = (e) => {
    e.preventDefault();

    fetch(api_base_url + "/login", {
      mode: "cors",
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        email,
        pwd,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("isLoggedIn", true);
          navigate("/"); // or window.location.href="/"
        } else {
          toast.error(data.msg);
        }
      })
      .catch((err) => {
        console.error("Failed during Login Fetch", err.message);
        toast.error("Failed during Login Fetch", err.message);
      });
  };

  return (
    <>
      <div className="con flex flex-col items-center justify-center min-h-screen">
        <form
          onSubmit={submitForm}
          className="w-[25vw] h-[auto] flex flex-col items-center bg-[#0f0e0e] p-[20px] rounded-lg shadow-xl shadow-black/50"
        >
          <img className="w-[230px] object-cover" src={logo} alt="logo" />

          {/* EMAIL INPUT */}
          <div className="inputBox">
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              value={email}
              placeholder="Email"
              required
            />
          </div>

          {/* PASSWORD INPUT */}
          <div className="inputBox">
            <input
              onChange={(e) => setPwd(e.target.value)}
              type="text"
              value={pwd}
              placeholder="Password"
              required
            />
          </div>

          <p className="text-[gray] text-[14px] mt-3 self-start">
            Don&apos;t have an account?
            <Link to="/signUp" className="text-blue-500">
              Sign Up
            </Link>
          </p>

          <button
            type="submit"
            className="btnNormal mt-3 bg-blue-500 transition-all hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;
