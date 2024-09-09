import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useLocation
} from 'react-router-dom';
import Home from './components/Home';
import RestaurantCreate from './components/RestaurantCreate';
import RestaurantDetail from './components/RestaurantDetail';
import RestaurantList from './components/RestaurantList/RestaurantList';
import RestaurantSearch from './components/RestaurantSearch';
import RestaurantUpdate from './components/RestaurantUpdate';
import logo from './logo.jpg'; // Path to your logo

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
        <li>
          <Link to="/update" className={location.pathname === '/update' ? 'active' : ''}>Update</Link>
        </li>
        <li>
          <Link to="/search" className={location.pathname === '/search' ? 'active' : ''}>Search</Link>
        </li>
        <li>
          <Link to="/detail" className={location.pathname === '/detail' ? 'active' : ''}>Detail</Link>
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
        <Route path="/update" element={<RestaurantUpdate />} />
        <Route path="/search" element={<RestaurantSearch />} />
        <Route path="/detail" element={<RestaurantDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
