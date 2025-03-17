import React, { useState, useEffect } from "react";
import '../../style/navbar.css';
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import ApiService from "../../service/ApiService";

const Navbar = () => {
    const [searchValue, setSearchValue] = useState("");
    const navigate = useNavigate();
    const location = useLocation(); // Get current route location

    const isAdmin = ApiService.isAdmin(); 
    const isAuthenticated = ApiService.isAuthenticated();

    // Redirect admin to admin profile on login (only once)
    useEffect(() => {
        if (isAuthenticated && isAdmin && location.pathname === "/login") {
            navigate("/admin-profile"); // Redirect to admin profile only after login
        }
    }, [isAuthenticated, isAdmin, navigate, location.pathname]);

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
    };

    // Handle search form submission
    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        navigate(`/?search=${searchValue}`);
    };

    // Handle logout
    const handleLogout = () => {
        const confirm = window.confirm("Do you want to log out...?");
        if (confirm) {
            ApiService.logout();
            setTimeout(() => {
                navigate(`/login`);
            }, 500);
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <NavLink to="/"><img src="./ecomlogo.png" alt="Online Shopping" /></NavLink>
            </div>

            {/* Show search bar only if the user is logged in (admin or regular user) */}
            {isAuthenticated && (
                <form className="navbar-search" onSubmit={handleSearchSubmit}>
                    <input
                        type="text"
                        placeholder="Search products"
                        value={searchValue}
                        onChange={handleSearchChange}
                    />
                    <button type="submit">Search</button>
                </form>
            )}

            <div className="navbar-link">
                {/* Show "Home", "Categories", "Cart", and "My Account" only if a regular user is logged in */}
                {isAuthenticated && !isAdmin && (
                    <>
                        <NavLink to="/">Home</NavLink>
                        <NavLink to="/categories">Categories</NavLink>
                        <NavLink to="/cart">Cart</NavLink>
                        <NavLink to="/profile">My Account</NavLink>
                        <NavLink onClick={handleLogout}>Logout</NavLink>
                    </>
                )}

                {/* Show "Admin Profile", "Admin", and "Logout" only if admin is logged in */}
                {isAuthenticated && isAdmin && (
                    <>
                        <NavLink to="/admin-profile">Admin Profile</NavLink>
                        <NavLink to="/admin">Admin</NavLink>
                        <NavLink onClick={handleLogout}>Logout</NavLink>
                    </>
                )}

                {/* Show "Login" only if the user is not authenticated */}
                {!isAuthenticated && <NavLink to="/login">Login</NavLink>}
            </div>
        </nav>
    );
};

export default Navbar;