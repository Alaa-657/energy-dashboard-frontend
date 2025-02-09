import React, { useState } from "react";

const Hilfe = ({ language }) => {
    const [activeTab, setActiveTab] = useState("faq"); // Default to FAQ

    return (
        <div className="hilfe-container">
            <h2>{language === "de" ? "Hilfe" : "Help"}</h2>

            {/* ✅ Tabs for FAQ, Anleitungen, Support */}
            <div className="hilfe-tabs">
                <button onClick={() => setActiveTab("faq")} className={activeTab === "faq" ? "active" : ""}>
                    {language === "de" ? "FAQ" : "FAQ"}
                </button>
                <button onClick={() => setActiveTab("guides")} className={activeTab === "guides" ? "active" : ""}>
                    {language === "de" ? "Anleitungen" : "Guides"}
                </button>
                <button onClick={() => setActiveTab("support")} className={activeTab === "support" ? "active" : ""}>
                    {language === "de" ? "Support" : "Support"}
                </button>
            </div>

            {/* ✅ FAQ Section */}
            {activeTab === "faq" && (
                <div className="hilfe-section">
                    <h3>{language === "de" ? "Häufig gestellte Fragen" : "Frequently Asked Questions"}</h3>
                    <ul>
                        <li><b>{language === "de" ? "Wie kann ich eine Investition hinzufügen?" : "How can I add an investment?"}</b>
                            <p>{language === "de" ? "Gehen Sie auf das Dashboard und nutzen Sie das Formular 'Neue Investition hinzufügen'." : "Go to the dashboard and use the 'Add New Investment' form."}</p>
                        </li>
                        <li><b>{language === "de" ? "Kann ich mein Passwort ändern?" : "Can I change my password?"}</b>
                            <p>{language === "de" ? "Ja, unter 'Profil' können Sie Ihr Passwort ändern." : "Yes, under 'Profile' you can change your password."}</p>
                        </li>
                    </ul>
                </div>
            )}

            {/* ✅ Guides Section */}
            {activeTab === "guides" && (
                <div className="hilfe-section">
                    <h3>{language === "de" ? "Anleitungen" : "Guides"}</h3>
                    <p>{language === "de" ? "Hier finden Sie Anleitungen zur Nutzung des Dashboards." : "Here you will find guides on using the dashboard."}</p>
                    <ul>
                        <li><a href="#">{language === "de" ? "Wie füge ich eine Investition hinzu?" : "How to add an investment?"}</a></li>
                        <li><a href="#">{language === "de" ? "Wie exportiere ich Daten?" : "How to export data?"}</a></li>
                    </ul>
                </div>
            )}

            {/* ✅ Support Section */}
            {activeTab === "support" && (
                <div className="hilfe-section">
                    <h3>{language === "de" ? "Support" : "Support"}</h3>
                    <p>{language === "de" ? "Haben Sie Fragen? Kontaktieren Sie uns!" : "Have questions? Contact us!"}</p>
                    <form>
                        <label>{language === "de" ? "Ihre Nachricht" : "Your Message"}</label>
                        <textarea placeholder={language === "de" ? "Geben Sie Ihre Nachricht ein..." : "Enter your message..."}></textarea>
                        <button type="submit">{language === "de" ? "Senden" : "Send"}</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Hilfe;
