import React from 'react';
import {Link, NavLink} from "react-router-dom";

const NavBar = ({user}) => {
    

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light  shadow-sm">
            <div className="container">
                <Link className="navbar-brand" to="/">Vidly</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"/>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <NavLink className="nav-link" aria-current="page" to="/movies">Movies</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/customers">Customers</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/rentals">Rentals</NavLink>
                        </li>

                    </ul>
                    <ul className="navbar-nav ms-auto">
                        {!user &&
                        <React.Fragment>
                            <li className="nav-item">
                                <NavLink className="nav-link" aria-current="page" to="/login">Login</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" aria-current="page" to="/register">Register</NavLink>
                            </li>
                        </React.Fragment>
                        }
                        {user &&
                        <React.Fragment>
                            <li className="nav-item">
                                <NavLink className="nav-link" aria-current="page" to="/profile">
                                    {user.name}
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" aria-current="page" to="/logout">
                                    Logout
                                </NavLink>
                            </li>
                        </React.Fragment>
                        }
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;