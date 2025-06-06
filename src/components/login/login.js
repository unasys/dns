import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Login = () => {
    const { loginWithRedirect, error } = useAuth0();

    useEffect(() => {
        loginWithRedirect();
    }, [loginWithRedirect]);

    return (
        <div className="login-container">
            <h2>Redirecting to login...</h2>
            {error && <div style={{ color: "red" }}>{error.message}</div>}
        </div>
    );
};

export default Login;