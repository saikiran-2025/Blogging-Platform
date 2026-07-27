import React, { useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Ct from "./Ct";

const Logout = () => {

    const { user, setUser, setToken } = useContext(Ct);
    const navigate = useNavigate();

    useEffect(() => {
        logout();
    }, []);

    const logout = async () => {

        try {

            if (user?.username) {
                await axios.post(
                    `http://localhost:5000/logout/${user.email}`
                );
            }

        } catch (error) {
            console.log(error.response?.data?.err || error.message);
        }

        // Clear Context
        setToken("");
        setUser(null);

        // Redirect immediately
        navigate("/");
    };

    return null;
};

export default Logout;