// IMPORTS
import "./styles.css";
import { useState } from "react";
import { useNavigate } from "react-router";

// IMAGES
import finchCollectorFinch from "../../assets/images/finch_wave.png";
import logoType from "../../assets/images/finch_wave.png";

// APIs
import * as usersAPI from "../../utilities/users-api";


export default function HomePage({ user, setUser }) {
  const initialState = { username: "", password: "" }
  const [formData, setFormData] = useState(initialState)
  const navigate =useNavigate()

  function handleChange(evt) {
    setFormData({ ...formData, [evt.target.name]: evt.target.value})
  }

  // async function handleLogin(evt) {
  //   evt.preventDefault();
  //   console.log("time to login!!!!")
  // }

  async function handleLogin(evt) {
    try {
      evt.preventDefault();
      const loggedInUser = await usersAPI.login(formData);
      setUser(loggedInUser);
      setFormData(initialState)
      navigate("/finchs");
    } catch (err) {
      setUser(null);
    }
}

  return (<>
      <div className="home-finch-container">
        <img src={finchCollectorFinch} alt="The Finch Collector Finch" />
      </div>
    <section className="logo-container">
      <img src={logoType} alt="Text reads: Finch Collector" />
    </section>
    {!user &&
      <section>
        <form onSubmit={handleLogin} className="form-container login">
          <h1>Login</h1>
          <p>
            <label htmlFor="id_username">Username:</label>
            <input value={formData.username} type="text" name="username" maxLength="150" required id="id_username" onChange={handleChange}/>
          </p>
          <p>
            <label htmlFor="id_password">Password:</label>
            <input value={formData.password} type="password" name="password" required id="id_password" onChange={handleChange} />
          </p>
          <button type="submit" className="btn submit">Login</button>
        </form>
      </section>
    }
  </>)
}