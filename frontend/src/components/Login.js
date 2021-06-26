import { Cancel, Room } from "@material-ui/icons";
import axios from "axios";
import { useRef, useState } from "react";
import "./style.css";

function Login({ setShowLogin, myStorage, setCurrentUser }) {
  const [error, setError] = useState(false);

  const nameRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      username: nameRef.current.value,
      password: passwordRef.current.value,
    };
    try {
      const userdata = await axios.post("/login", user);
      myStorage.setItem("mapUserData", userdata.data.username);
      setCurrentUser(userdata.data.username);
      setShowLogin(false);
      setError(false);

      // setTimeout(setSuccess(false), 2000);
    } catch (error) {
      setError(true);
      // setTimeout(setError(false), 2000);
    }
  };

  return (
    <div className="loginContainer">
      <div className="logo">
        <Room />
        TravelMap
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" ref={nameRef} />
        <input type="password" placeholder="Password" ref={passwordRef} />
        <button className="loginBtn" type="submit">
          Login
        </button>
        {error && <span className="error">Hey Somthing Went Wrong</span>}
      </form>
      <Cancel
        className="loginCancel"
        onClick={() => {
          setShowLogin(false);
        }}
      />
    </div>
  );
}

export default Login;
