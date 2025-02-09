import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profil = ({ token, handleLogout }) => {
    const [userData, setUserData] = useState({
        username: "",
        email: "",
        newPassword: ""
    });

    const [originalData, setOriginalData] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [language, setLanguage] = useState(localStorage.getItem("language") || "de");
    const [profilePic, setProfilePic] = useState(localStorage.getItem("profilePic") || "");

    useEffect(() => {
        if (token) {
            axios.get("http://localhost:5000/api/user/profile", {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => {
                setUserData({
                    username: response.data.username,
                    email: response.data.email,
                    newPassword: ""
                });
                setOriginalData({
                    username: response.data.username,
                    email: response.data.email
                });
            })
            .catch(error => {
                console.error("Fehler beim Abrufen der Profildaten:", error);
                toast.error("❌ Fehler beim Laden der Profildaten!");
            })
            .finally(() => setLoading(false));
        }
    }, [token]);

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleLanguageChange = (e) => {
    const newLang = e.target.value;
		setLanguage(newLang);
		localStorage.setItem("language", newLang);
		toast.info(`🌍 Sprache geändert zu ${newLang === "de" ? "Deutsch" : "English"}`);

		// ✅ Force a re-render of the entire App
		window.location.reload();
	};


    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePic(reader.result);
                localStorage.setItem("profilePic", reader.result);
                toast.success("✅ Profilbild aktualisiert!");
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = (e) => {
        e.preventDefault();

        if (
            userData.username === originalData.username &&
            userData.email === originalData.email &&
            userData.newPassword.trim() === ""
        ) {
            toast.warn("⚠️ Keine Änderungen vorgenommen!");
            return;
        }

        const updateData = {};
        if (userData.username !== originalData.username) updateData.username = userData.username;
        if (userData.email !== originalData.email) updateData.email = userData.email;
        if (userData.newPassword.trim() !== "") updateData.newPassword = userData.newPassword;

        axios.put("http://localhost:5000/api/user/update", updateData, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => {
            toast.success("✅ Profil erfolgreich aktualisiert!");
            setOriginalData({ username: userData.username, email: userData.email });
            setUserData(prev => ({ ...prev, newPassword: "" }));
        })
        .catch(() => toast.error("❌ Fehler beim Speichern!"));
    };

    return (
        <div className="profile-container">
            <h2>👤 {language === "de" ? "Mein Profil" : "My Profile"}</h2>

            {loading ? (
                <p>⏳ {language === "de" ? "Profildaten werden geladen..." : "Loading profile data..."}</p>
            ) : (
                <form onSubmit={handleSave} className="profile-form">
                    
                    {/* Language Selection */}
                    <div className="input-group">
                        <label>{language === "de" ? "Sprache" : "Language"}:</label>
                        <select value={language} onChange={handleLanguageChange}>
                            <option value="de">Deutsch</option>
                            <option value="en">English</option>
                        </select>
                    </div>

                    {/* Profile Picture */}
                    <div className="profile-picture">
                        {profilePic ? (
                            <img src={profilePic} alt="Profilbild" className="profile-pic" />
                        ) : (
                            <p>{language === "de" ? "Kein Bild hochgeladen" : "No image uploaded"}</p>
                        )}
                        <input type="file" onChange={handleImageUpload} />
                    </div>

                    <div className="input-group">
                        <label>{language === "de" ? "Benutzername" : "Username"}</label>
                        <input 
                            type="text" 
                            name="username" 
                            value={userData.username} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <div className="input-group">
                        <label>{language === "de" ? "E-Mail" : "Email"}</label>
                        <input 
                            type="email" 
                            name="email" 
                            value={userData.email} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <div className="input-group">
                        <label>{language === "de" ? "Neues Passwort" : "New Password"}</label>
                        <input 
                            type="password" 
                            name="newPassword" 
                            placeholder={language === "de" ? "Neues Passwort (Optional)" : "New Password (Optional)"} 
                            value={userData.newPassword} 
                            onChange={handleChange} 
                        />
                    </div>

                    <button type="submit" className="save-btn">💾 {language === "de" ? "Speichern" : "Save"}</button>
                </form>
            )}

            <button className="logout-button" onClick={handleLogout}>🚪 {language === "de" ? "Abmelden" : "Logout"}</button>
        </div>
    );
};

export default Profil;
