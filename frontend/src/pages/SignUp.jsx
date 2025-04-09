import { useState } from "react";
import logo from "../images/logos/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { api_base_url } from "../helper";
import { toast } from "react-toastify";

const SignUp = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  const navigate = useNavigate();

  const submitForm = (e) => {
    e.preventDefault();

    fetch(api_base_url + "/signUp", {
      mode: "cors",
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        fullName,
        email,
        pwd,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          navigate("/login");
        } else {
          toast.error(data.msg);
        }
      })
      .catch((err) => {
        console.error("Failed during SignUp Fetch", err.message);
        toast.error("Failed during SignUp Fetch", err.message);
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

          {/* FULL NAME INPUT */}
          <div className="inputBox">
            <input
              onChange={(e) => setFullName(e.target.value)}
              type="text"
              value={fullName}
              placeholder="Full Name"
              required
            />
          </div>

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
            Already have an account?
            <Link to="/login" className="text-blue-500">
              Login
            </Link>
          </p>

          <button
            type="submit"
            className="btnNormal mt-3 bg-blue-500 transition-all hover:bg-blue-600"
          >
            Sign Up
          </button>
        </form>
      </div>
    </>
  );
};

export default SignUp;
