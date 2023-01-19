import React from "react";
import {Link} from "react-router-dom";
import "./Navbar.css";

/**
 * This is our navbar (top row for links on the page) to help navigate our website
 *
 * @returns {JSX.Element}
 * @constructor
 */
function Navbar(){
    return <nav className="navbar bg-dark container">
        <li><Link className="link" to="/">Home</Link></li>
        <li><Link className="link" to="information">Information</Link></li>
        <li><Link className="link" to="test_knowledge">Test Your Knowledge</Link></li>
        <li><Link className="link" to="try">Try It Yourself</Link></li>
    </nav>
    
}
//<li><Link className="link" to="definitions">Definitions</Link></li>
//<li><Link className="link" to="examples">Examples</Link></li>
export default Navbar