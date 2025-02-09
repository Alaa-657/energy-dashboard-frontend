import React, { useState } from "react";
import axios from "axios";

function Login({ setToken }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/api/auth/login", { email, password });
            setToken(response.data.token);
            localStorage.setItem("token", response.data.token);
            alert("Erfolgreich eingeloggt!");
        } catch (error) {
            alert("Fehler bei der Anmeldung");
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input type="email" placeholder="E-Mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Passwort" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Anmelden</button>
            </form>
        </div>
    );
}

export default Login;
