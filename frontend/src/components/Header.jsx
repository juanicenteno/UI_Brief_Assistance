import "../css/Header.css"
import { useNavigate } from "react-router-dom";

function Header() {
      const navigate = useNavigate();

  return (
    <header>
        <h1 onClick={() => navigate("/")} id="title"> <i className="yellow">AI</i> Brief Assistance</h1>
        <a href="#">Contáctame</a>
    </header>
  )
}

export default Header