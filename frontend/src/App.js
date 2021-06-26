import { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import { Room, Star } from "@material-ui/icons";
import "./app.css";
import axios from "axios";
import { format } from "timeago.js";
import Register from "./components/Register";
import Login from "./components/Login";

function App() {
  const myStorage = window.localStorage;
  const [currentUser, setCurrentUser] = useState(
    myStorage.getItem("mapUserData")
  );
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 20.5937,
    longitude: 78.9629,
    zoom: 4,
  });
  const [currentPlaceID, setCurrentPlaceID] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [pins, setPins] = useState([]);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(0);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("/pins");
        const data = res.data;
        // console.log(data.pins);
        setPins(data.pins);
        //  console.log(pins);
      } catch (error) {
        console.log(error);
      }
    };
    getPins();
    //  console.log(pins);
  }, []);

  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceID(id);
    setViewport({
      ...viewport,
      latitude: lat,
      longitude: long,
    });
  };

  const handleAddClick = (e) => {
    const [long, lat] = e.lngLat;
    setNewPlace({
      lat,
      long,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title,
      desc,
      rating,
      lat: newPlace.lat,
      long: newPlace.long,
    };
    try {
      const res = await axios.post("/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    myStorage.removeItem("mapUserData");
    setCurrentUser(null);
  };
  return (
    <div className="App">
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={
          "pk.eyJ1IjoiaHVubnkzNDU2ODYiLCJhIjoiY2twejZ2Nms2MGpwbzJvbzYzYm9iZzd6eSJ9.KmBwl378HUJoUxMlPqUinA"
        }
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
        onDblClick={handleAddClick}
        transitionDuration="100"
      >
        {pins.map((p) => {
          return (
            <>
              <Marker
                latitude={p.lat}
                longitude={p.long}
                offsetLeft={-viewport.zoom * 10}
                offsetTop={-viewport.zoom * 10}
              >
                <Room
                  style={{
                    fontSize: viewport.zoom * 10,
                    color: p.username === currentUser ? "tomato" : "slateblue",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    handleMarkerClick(p._id, p.lat, p.long);
                  }}
                />
              </Marker>

              {p._id === currentPlaceID && (
                <Popup
                  latitude={p.lat}
                  longitude={p.long}
                  closeButton={true}
                  closeOnClick={false}
                  anchor="left"
                  onClose={() => {
                    setCurrentPlaceID(null);
                  }}
                >
                  <div className="card">
                    <label>Place</label>
                    <h4 className="place">{p.title}</h4>
                    <label>Review</label>
                    <p className="review">{p.desc}</p>
                    <label>Rating</label>
                    <div className="rating">
                      {Array(p.rating).fill(<Star className="star" />)}
                    </div>
                    <label>Informations</label>
                    <span className="username">
                      Created By <strong>{p.username}</strong>
                    </span>
                    <span className="date">
                      Created By <strong>{format(p.createdAt)}</strong>
                    </span>
                  </div>
                </Popup>
              )}
            </>
          );
        })}
        {newPlace && (
          <Popup
            latitude={newPlace.lat}
            longitude={newPlace.long}
            closeButton={true}
            closeOnClick={false}
            anchor="left"
            onClose={() => {
              setNewPlace(null);
            }}
          >
            <div>
              <form onSubmit={handleSubmit}>
                <label>Title </label>
                <input
                  type="text"
                  placeholder="Title"
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                />
                <label>Review </label>
                <textarea
                  placeholder="Say About This Place !!"
                  onChange={(e) => {
                    setDesc(e.target.value);
                  }}
                ></textarea>
                <label>Rating </label>
                <select
                  id=""
                  onChange={(e) => {
                    setRating(e.target.value);
                  }}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <button className="submitbtn" type="submit">
                  Add Pin
                </button>
              </form>
            </div>
          </Popup>
        )}
        {currentUser ? (
          <button className="button logOut" onClick={handleLogout}>
            Log Out
          </button>
        ) : (
          <div className="btns">
            <button className="button login" onClick={() => setShowLogin(true)}>
              Login
            </button>
            <button
              className="button register"
              onClick={() => setShowRegister(true)}
            >
              Register
            </button>
          </div>
        )}
        {showRegister && <Register setShowRegister={setShowRegister} />}
        {showLogin && (
          <Login
            setShowLogin={setShowLogin}
            myStorage={myStorage}
            setCurrentUser={setCurrentUser}
          />
        )}
      </ReactMapGL>
    </div>
  );
}

export default App;
