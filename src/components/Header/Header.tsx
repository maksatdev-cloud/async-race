import { Link, useLocation } from "react-router-dom";
import Button from "../../ui/Button/Button";
// import "./Header.css";

const Header = () => {
  const location = useLocation();

  return (
    <header className="app-header">
      <h1>Async Race</h1>
      <nav className="header-nav">
        <Link to="/">
          <Button variant={location.pathname === "/" ? "success" : "primary"}>
            TO GARAGE
          </Button>
        </Link>
        <Link to="/winners">
          <Button
            variant={location.pathname === "/winners" ? "success" : "primary"}
          >
            TO WINNERS
          </Button>
        </Link>
      </nav>
    </header>
  );
};

export default Header;
