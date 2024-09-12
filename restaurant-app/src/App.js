import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useLocation
} from 'react-router-dom';
import Home from './components/Home/Home';
import RestaurantCreate from './components/RestaurantCreate/RestaurantCreate';
import RestaurantList from './components/RestaurantList/RestaurantList';


function Navbar() {
  const location = useLocation();

  return (
    <nav>
      <ul>
        <li>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
        </li>
        <li>
          <Link to="/list" className={location.pathname === '/list' ? 'active' : ''}>List</Link>
        </li>
        <li>
          <Link to="/create" className={location.pathname === '/create' ? 'active' : ''}>Create</Link>
        </li>
      </ul>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/list" element={<RestaurantList />} />
        <Route path="/create" element={<RestaurantCreate />} />
      </Routes>
    </Router>
  );
}

export default App;
