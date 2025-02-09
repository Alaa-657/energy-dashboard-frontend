import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function InvestmentChart({ investments }) {
    // Prepare data for the chart
    const data = {
        labels: investments.map(inv => inv.projectName),
        datasets: [
            {
                label: "Investierter Betrag (€)",
                data: investments.map(inv => inv.amountInvested),
                backgroundColor: "rgba(54, 162, 235, 0.5)"
            },
            {
                label: "Erzeugte Energie (kWh)",
                data: investments.map(inv => inv.energyGenerated),
                backgroundColor: "rgba(255, 206, 86, 0.5)"
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: "top" },
            title: { display: true, text: "Investitionen und Energieerzeugung" }
        }
    };

    return (
        <div className="chart-container">
            <Bar data={data} options={options} />
        </div>
    );
}

export default InvestmentChart;
