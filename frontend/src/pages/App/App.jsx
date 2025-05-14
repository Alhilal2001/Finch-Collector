// IMPORTS
import "./App.css"
import { Route, Routes, Link, useLocation, Navigate } from 'react-router';

import headerLogo from "../../assets/images/finch_wave.png";

// COMPONENTS
import HomePage from '../HomePage';
import AboutPage from '../AboutPage';
import FinchDetailPage from '../FinchDetailPage';
import FinchIndexPage from "../FinchIndexPage/FinchIndexPage";
import FinchFormPage from "../FinchFormPage/FinchFormPage";
import ToyDetailPage from "../ToyDetailPage/ToyDetailPage";
import ToyFormPage from "../ToyFormPage/ToyFormPage";
import ToyIndexPage from "../ToyIndexPage/ToyIndexPage";
import Navbar from '../../components/Navbar/Navbar';
import SignupPage from '../SignupPage/SignupPage';
import { useState } from "react";

//Api
import { getUser } from '../../utilities/users-api';


function App() {
  const [user, setUser] = useState(getUser());
  const location = useLocation();
  const routes = ["about", "finchs", "home"]
  const mainCSS = routes.filter(r => location.pathname.includes(r) ? r : "").join(" ")
  



  return (<>
    <header>
      <div className={`${mainCSS} header-logo-container`}>
        <Link to="/">
          <img src={headerLogo} alt="The Finch Collector Logo" />
        </Link>
      </div>
      {/* <nav>
        <ul>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/finchs">All Finchs</Link></li>
          <li><Link to="/finchs/new">New Finch</Link></li>
          <li><Link to="/toys/new">Add a Toy</Link></li>
          <li><Link to="/toys">All Toys</Link></li>
        </ul>
      </nav> */}
      <ul>
        <nav>
          <Navbar user={user} setUser={setUser}/>
        </nav>
      </ul>
    </header>
    <main className={mainCSS}>
      { user ?
      <Routes>
        <Route path="/home" element={<HomePage user={user} setUser={setUser} />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/signup" element={<SignupPage user={user} setUser={setUser} />}/>
        <Route path="/finchs/:id" element={<FinchDetailPage />} />
        <Route path="/finchs" element={<FinchIndexPage />} />
        <Route path="/finchs/new" element={<FinchFormPage createFinch={true}  />}/>
        <Route path="/finchs/edit/:id"   element={<FinchFormPage editFinch={true}   />}/>
        <Route path="/finchs/confirm_delete/:id" element={<FinchFormPage deleteFinch={true} />}/>
        <Route path="/*" element={ <Navigate to="/home"/>}/>
        <Route path="/toys/:id" element={<ToyDetailPage />} />
        <Route path="/toys" element={<ToyIndexPage />} />
        <Route path="/toys/new" element={<ToyFormPage createToy={true} />} />
        <Route path="/toys/edit/:id" element={<ToyFormPage editToy={true}/>} />
        <Route path="/toys/confirm_delete/:id" element={<ToyFormPage deleteToy={true}/>} />
      </Routes>
      :
      <Routes>
       <Route path="/home" element={<HomePage user={user} setUser={setUser} />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/signup" element={<SignupPage user={user} setUser={setUser} />}/>
        <Route path="/*" element={ <Navigate to="/home"/>}/>
      </Routes>
      }
    </main>
  </>);
}

export default App
