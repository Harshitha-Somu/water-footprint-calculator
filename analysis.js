// ---------------- GET URL PARAMS ----------------
const params = new URLSearchParams(window.location.search);

const crop1 = params.get("crop1");
const crop2 = params.get("crop2");
const water1 = parseFloat(params.get("water1"));
const water2 = parseFloat(params.get("water2"));

// ---------------- BACK BUTTON ----------------
function goBack() {
    window.location.href = "index.html";
}

// ---------------- COMMON OPTIONS ----------------
const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            labels: {
                font: { size: 14 }
            }
        }
    }
};

// ---------------- BAR CHART ----------------
new Chart(document.getElementById("barChart"), {
    type: "bar",
    data: {
        labels: [crop1, crop2],
        datasets: [{
            label: "Water Footprint (m³/kg)",
            data: [water1, water2],
            backgroundColor: ["#83c5be", "#e63946"]
        }]
    },
    options: commonOptions
});

// ---------------- PIE CHART ----------------
new Chart(document.getElementById("pieChart"), {
    type: "pie",
    data: {
        labels: [crop1, crop2],
        datasets: [{
            data: [water1, water2],
            backgroundColor: ["#2a9d8f", "#f4a261"]
        }]
    },
    options: commonOptions
});

// ---------------- LINE CHART ----------------
new Chart(document.getElementById("lineChart"), {
    type: "line",
    data: {
        labels: [crop1, crop2],
        datasets: [{
            label: "Water Footprint Trend",
            data: [water1, water2],
            borderColor: "#006d77",
            backgroundColor: "rgba(0,109,119,0.2)",
            tension: 0.4,
            fill: true
        }]
    },
    options: commonOptions
});

// ---------------- RADAR CHART ----------------
new Chart(document.getElementById("radarChart"), {
    type: "radar",
    data: {
        labels: [crop1, crop2],
        datasets: [{
            label: "Relative Water Impact",
            data: [water1, water2],
            backgroundColor: "rgba(131,197,190,0.4)",
            borderColor: "#83c5be",
            pointBackgroundColor: "#006d77"
        }]
    },
    options: commonOptions
});

// ---------------- HISTOGRAM (SIMULATED) ----------------
new Chart(document.getElementById("histChart"), {
    type: "bar",
    data: {
        labels: ["Low", "Medium", "High"],
        datasets: [{
            label: "Water Distribution",
            data: [
                Math.min(water1, water2) / 3,
                Math.min(water1, water2) / 2,
                Math.max(water1, water2)
            ],
            backgroundColor: "#94d2bd"
        }]
    },
    options: commonOptions
});

// ---------------- BOX-LIKE COMPARISON ----------------
new Chart(document.getElementById("boxChart"), {
    type: "bar",
    data: {
        labels: [crop1, crop2],
        datasets: [{
            label: "Water Footprint Range",
            data: [water1, water2],
            backgroundColor: "#adb5bd"
        }]
    },
    options: commonOptions
});
