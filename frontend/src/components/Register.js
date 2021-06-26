import { Cancel, Room } from "@material-ui/icons";
import axios from "axios";
import { useRef, useState } from "react";
import "./style.css";

function Register({ setShowRegister }) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
      username: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };
    try {
      await axios.post("/register", newUser);
      setError(false);
      setSuccess(true);
      // setTimeout(setSuccess(false), 2000);
    } catch (error) {
      setError(true);
      // setTimeout(setError(false), 2000);
    }
  };

  return (
    <div className="registerdiv">
      <div className="logo">
        <Room />
        TravelMap
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" ref={nameRef} />
        <input type="text" placeholder="Email" ref={emailRef} />
        <input type="password" placeholder="Password" ref={passwordRef} />
        <button className="registerBtn" type="submit">
          Register
        </button>
        {success && (
          <span className="success">Hey You Are In Plz Login Now</span>
        )}
        {error && <span className="error">Hey Somthing Went Wrong</span>}
      </form>
      <Cancel
        className="RegCancel"
        onClick={() => {
          setShowRegister(false);
        }}
      />
    </div>
  );
}

export default Register;
