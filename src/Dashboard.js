import React from "react";
import InvestmentChart from "./InvestmentChart";

const Dashboard = ({
    investments = [],  
    editInvestment, deleteInvestment, 
    formData = {}, handleChange, handleSubmit,
    exportCSV, exportPDF, token, isRegistering, 
    registerUser, loginUser, authData = {}, 
    handleAuthChange, setIsRegistering,
    language // ✅ Added language prop
}) => {

    return (
        <div className="container">
            {!token ? (
                <div className="auth-container">
                    <div className="form-container">
                        <h2>{isRegistering ? (language === "de" ? "Registrieren" : "Register") : (language === "de" ? "Login" : "Sign In")}</h2>
                        <form onSubmit={isRegistering ? registerUser : loginUser}>
                            {isRegistering && (
                                <input 
                                    type="text" 
                                    name="username" 
                                    placeholder={language === "de" ? "Benutzername" : "Username"}
                                    value={authData.username || ""} 
                                    onChange={handleAuthChange} 
                                    required 
                                />
                            )}
                            <input 
                                type="email" 
                                name="email" 
                                placeholder={language === "de" ? "E-Mail" : "Email"} 
                                value={authData.email || ""} 
                                onChange={handleAuthChange} 
                                required 
                            />
                            <input 
                                type="password" 
                                name="password" 
                                placeholder={language === "de" ? "Passwort" : "Password"} 
                                value={authData.password || ""} 
                                onChange={handleAuthChange} 
                                required 
                            />
                            <button type="submit">{isRegistering ? (language === "de" ? "Registrieren" : "Register") : (language === "de" ? "Anmelden" : "Login")}</button>
                        </form>

                        <button className="toggle-auth" onClick={() => setIsRegistering(!isRegistering)}>
                            {isRegistering ? (language === "de" ? "Bereits registriert? Hier anmelden" : "Already registered? Sign in here") : (language === "de" ? "Noch keinen Account? Hier registrieren" : "No account yet? Register here")}
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    {/* ✅ Investment Metrics */}
                    <div className="metrics">
                        <div className="card">
                            <h3>{language === "de" ? "Gesamtinvestitionen" : "Total Investments"}</h3>
                            <p>{investments.length > 0 ? investments.reduce((total, inv) => total + (inv.amountInvested || 0), 0) : "0"} €</p>
                        </div>
                        <div className="card">
                            <h3>{language === "de" ? "Erzeugte Energie" : "Generated Energy"}</h3>
                            <p>{investments.length > 0 ? investments.reduce((total, inv) => total + (inv.energyGenerated || 0), 0) : "0"} kWh</p>
                        </div>
                        <div className="card">
                            <h3>{language === "de" ? "Durchschnittliche Rendite" : "Average Returns"}</h3>
                            <p>{investments.length > 0 ? (investments.reduce((total, inv) => total + (inv.returns || 0), 0) / investments.length).toFixed(2) : "0"}%</p>
                        </div>
                    </div>

                    {/* ✅ Investment Chart */}
                    <div className="chart">
                        <InvestmentChart investments={investments} />
                    </div>

                    {/* ✅ Form to Add Investments */}
                    <div className="form-container">
                        <h2>{language === "de" ? "Neue Investition hinzufügen" : "Add New Investment"}</h2>
                        <form onSubmit={handleSubmit}>
                            <input type="text" name="projectName" placeholder={language === "de" ? "Projektname" : "Project Name"} value={formData.projectName || ""} onChange={handleChange} required />
                            <input type="number" name="amountInvested" placeholder={language === "de" ? "Investierter Betrag (€)" : "Invested Amount (€)"} value={formData.amountInvested || ""} onChange={handleChange} required />
                            <input type="number" name="energyGenerated" placeholder={language === "de" ? "Erzeugte Energie (kWh)" : "Generated Energy (kWh)"} value={formData.energyGenerated || ""} onChange={handleChange} required />
                            <input type="number" name="returns" placeholder={language === "de" ? "Rendite (%)" : "Returns (%)"} value={formData.returns || ""} onChange={handleChange} required />
                            <button type="submit">{language === "de" ? "Investition hinzufügen" : "Add Investment"}</button>
                        </form>
                    </div>


                   {/* ✅ Investment Table */}
                    <div>
                        <h2>{language === "de" ? "Gespeicherte Investitionen" : "Saved Investments"}</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>{language === "de" ? "Projektname" : "Project Name"}</th>
                                    <th>{language === "de" ? "Investierter Betrag (€)" : "Invested Amount (€)"}</th>
                                    <th>{language === "de" ? "Erzeugte Energie (kWh)" : "Generated Energy (kWh)"}</th>
                                    <th>{language === "de" ? "Rendite (%)" : "Returns (%)"}</th>
                                    <th>{language === "de" ? "Aktionen" : "Actions"}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {investments.length > 0 ? (
                                    investments.map((inv) => (
                                        <tr key={inv._id}>
                                            <td>{inv.projectName}</td>
                                            <td>{inv.amountInvested} €</td>
                                            <td>{inv.energyGenerated} kWh</td>
                                            <td>{inv.returns} %</td>
                                            <td>
                                                <button onClick={() => editInvestment(inv)} className="edit-btn">✏️ {language === "de" ? "Bearbeiten" : "Edit"}</button>
                                                <button onClick={() => deleteInvestment(inv._id)} className="delete-btn">🗑 {language === "de" ? "Löschen" : "Delete"}</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: "center", padding: "10px" }}>
                                            {language === "de" ? "Keine Investitionen gefunden." : "No investments found."}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* ✅ Export Buttons */}
                    <div className="export-buttons">
                        <button onClick={exportCSV}>📄 {language === "de" ? "CSV Export" : "Export CSV"}</button>
                        <button onClick={exportPDF}>📝 {language === "de" ? "PDF Export" : "Export PDF"}</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Dashboard;
