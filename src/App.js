import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./Dashboard"; 
import Profil from "./Profil";
import Hilfe from "./Hilfe"; // ✅ Import the new component
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";



function App() {
    // ✅ Investment State
    const [investments, setInvestments] = useState([]);
    const [editingInvestment, setEditingInvestment] = useState(null);
    const [formData, setFormData] = useState({
        projectName: "",
        amountInvested: "",
        energyGenerated: "",
        returns: ""
    });
	const API_BASE_URL = "https://energy-dashboard-backend-ptlo.onrender.com";


    // ✅ Auth State
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [authData, setAuthData] = useState({ username: "", email: "", password: "" });
    const [isRegistering, setIsRegistering] = useState(false);
	
	// ✅ Language State (Persisted in Local Storage)
    const [language, setLanguage] = useState(() => {
		return localStorage.getItem("language") || "de";
	});
	
	const handleLanguageChange = (e) => {
		setLanguage(e.target.value);
		toast.info(`🌍 Sprache geändert zu ${e.target.value === "de" ? "Deutsch" : "English"}`);
    };
	
	 // ✅ Fetch Investments from Backend
    const fetchInvestments = () => {
        axios.get(`${API_BASE_URL}/api/investments`, {
			headers: { Authorization: `Bearer ${token}` }
		})
        .then(response => setInvestments(response.data))
        .catch(error => {
            console.error("Fehler beim Abrufen der Daten:", error);
            if (error.response && error.response.status === 401) {
                handleLogout();
            }
        });
    };
	
	useEffect(() => {
        localStorage.setItem("language", language);
    }, [language]);
	
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            fetchInvestments();
        }
    }, [token]);
	
    // ✅ Logout Function
    const handleLogout = () => {
        localStorage.removeItem("token");
        setToken(null);
        toast.info(language === "de" ? "Erfolgreich abgemeldet! 🚪" : "Successfully logged out! 🚪");
    };

    // ✅ Edit Investment
    const editInvestment = (investment) => {
        setEditingInvestment(investment);
        setFormData(investment);
    };

    // ✅ Delete Investment
    const deleteInvestment = (id) => {
        axios.delete(`${API_BASE_URL}/api/investments/${id}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(() => {
                setInvestments(investments.filter(inv => inv._id !== id));
                toast.info("Investition gelöscht! 🗑");
            })
            .catch(error => toast.error("Fehler beim Löschen! ❌"));
    };

    // ✅ Handle Input Change
    const handleChange = (e) => {
        setFormData(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };
	
	const handleAuthChange = (e) => {
    setAuthData(prevState => ({
        ...prevState,
        [e.target.name]: e.target.value
    }));
	};


    // ✅ Handle Investment Submission
    const handleSubmit = (e) => {
        e.preventDefault();
        const url = editingInvestment
			? `${API_BASE_URL}/api/investments/${editingInvestment._id}`
			: `${API_BASE_URL}/api/investments`;

        const request = editingInvestment ? axios.put : axios.post;

		request(url, formData, { headers: { Authorization: `Bearer ${token}` } })
				.then(response => {
					if (editingInvestment) {
						setInvestments(investments.map(inv => inv._id === response.data._id ? response.data : inv));
						setEditingInvestment(null);
						toast.success("Investition erfolgreich aktualisiert! ✅");
					} else {
						setInvestments([...investments, response.data]);
						toast.success("Neue Investition erfolgreich hinzugefügt! 🎉");
					}
					setFormData({ projectName: "", amountInvested: "", energyGenerated: "", returns: "" });
				})
				.catch(error => toast.error("Fehler beim Speichern der Investition! ❌"));
    };
	
	const registerUser = (e) => {
		e.preventDefault();
		axios.post(`${API_BASE_URL}/api/auth/register`, authData)
			.then(response => {
				toast.success(response.data.message);
				setIsRegistering(false);
			})
			.catch(error => toast.error("Fehler bei der Registrierung! ❌"));
	};

	const loginUser = (e) => {
		e.preventDefault();
		axios.post(`${API_BASE_URL}/api/auth/login`, authData)
			.then(response => {
				localStorage.setItem("token", response.data.token);
				setToken(response.data.token);
				axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
				toast.success("Anmeldung erfolgreich! 🎉");
			})
			.catch(error => toast.error("Fehler bei der Anmeldung! ❌"));
	};


    // ✅ CSV Export
    const exportCSV = () => {
        if (!token) {
            toast.error("Kein Token, Zugriff verweigert!");
            return;
        }
        axios.get(`${API_BASE_URL}/api/export/csv`, {
			headers: { Authorization: `Bearer ${token}` },
			responseType: "blob"
		})
			.then(response => {
            const blob = new Blob([response.data], { type: "text/csv" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "Investitionen.csv";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }).catch(error => toast.error("CSV Export fehlgeschlagen! ❌"));
    };

    // ✅ PDF Export
    const exportPDF = () => {
        if (!token) {
            toast.error("Kein Token, Zugriff verweigert!");
            return;
        }
        axios.get(`${API_BASE_URL}/api/export/pdf`, {
			headers: { Authorization: `Bearer ${token}` },
			responseType: "blob"
		})
			.then(response => {
            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "Investitionen.pdf";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }).catch(error => toast.error("PDF Export fehlgeschlagen! ❌"));
    };

    return (
        <Router>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

           {/* ✅ Navigation Bar with Language Support */}
			<nav>
				<h1>{language === "de" ? "Erneuerbare Investitionen" : "Renewable Investments"}</h1>
				<div className="nav-links">
					<ul>
						<li><Link to="/">{language === "de" ? "Übersicht" : "Overview"}</Link></li>
						<li><Link to="/profil">{language === "de" ? "Profil" : "Profile"}</Link></li>
						<li><Link to="/hilfe">{language === "de" ? "Hilfe" : "Help"}</Link></li>  {/* ✅ Added Help Link */}

					</ul>
					{token && <button className="logout-button" onClick={handleLogout}>🚪 {language === "de" ? "Abmelden" : "Logout"}</button>}
				</div>
			</nav>


            <div className="container">
                <Routes>
					{/* ✅ Dashboard Route (Passes necessary props) */}
					<Route path="/" element={
						<Dashboard 
							token={token}
							authData={authData} 
							handleAuthChange={handleAuthChange} 
							isRegistering={isRegistering}
							setIsRegistering={setIsRegistering}
							registerUser={registerUser}
							loginUser={loginUser}
							investments={investments} 
							editInvestment={editInvestment} 
							deleteInvestment={deleteInvestment} 
							formData={formData} 
							handleChange={handleChange} 
							handleSubmit={handleSubmit} 
							exportCSV={exportCSV} 
							exportPDF={exportPDF} 
							language={language}  
							setLanguage={setLanguage}
						/>
					}/>

					{/* ✅ Profile Route (Prevent Access if not logged in) */}
					<Route path="/profil" element={
						token ? (
							<Profil 
								token={token} 
								handleLogout={handleLogout} 
								language={language} 
								setLanguage={setLanguage}  // ✅ Allow Language Change in Profile
							/>
						) : (
							<Navigate to="/" replace />
						)
					}/>
					
					
					{/* ✅ Help Route */}
                    <Route path="/hilfe" element={<Hilfe language={language} />} />


										
					{/* ✅ Catch-all Route (Redirect unknown routes to Dashboard) */}
					<Route path="*" element={<Navigate to="/" replace />} />
					
									
					

					</Routes>

            </div>
        </Router>
    );
}

export default App;
