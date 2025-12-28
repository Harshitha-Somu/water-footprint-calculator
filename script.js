let dataset = [];
let currentRole = "user";
let currentCompareCrop = null;

// Column names
let COL_CROP, COL_SOIL, COL_CLIMATE, COL_WATER;

// Dynamic thresholds (computed from dataset)
let LOW_T = 0;
let HIGH_T = 0;

/* ---------------- LOAD CSV ---------------- */
document.addEventListener("DOMContentLoaded", () => {
    Papa.parse("agricultural_water_footprint.csv", {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: (res) => {
            dataset = res.data;
            detectColumns(dataset[0]);
            computeThresholds();   // 🔥 DATA PREPROCESSING
            console.log("Dataset loaded:", dataset.length);
            console.log("Thresholds → LOW:", LOW_T, "HIGH:", HIGH_T);
        },
        error: () => alert("Failed to load dataset")
    });

    initScrollReveal();
});

/* ---------------- COLUMN DETECTION ---------------- */
function detectColumns(row) {
    const keys = Object.keys(row).map(k => k.toLowerCase());

    COL_CROP = findKey(keys, ["crop"]);
    COL_SOIL = findKey(keys, ["soil"]);
    COL_CLIMATE = findKey(keys, ["climate"]);
    COL_WATER = findKey(keys, ["water"]);

    if (!COL_CROP || !COL_WATER) {
        alert("Dataset must contain Crop and Water columns");
    }
}

function findKey(keys, words) {
    for (let i = 0; i < keys.length; i++) {
        for (let w of words) {
            if (keys[i].includes(w)) {
                return Object.keys(dataset[0])[i];
            }
        }
    }
    return null;
}

/* ---------------- DATA PREPROCESSING ---------------- */
function computeThresholds() {
    const values = dataset
        .map(r => parseFloat(r[COL_WATER]))
        .filter(v => !isNaN(v))
        .sort((a, b) => a - b);

    const n = values.length;
    LOW_T = values[Math.floor(n * 0.33)];
    HIGH_T = values[Math.floor(n * 0.66)];
}

/* ---------------- ROLE SELECTION ---------------- */
function selectRole(role) {
    currentRole = role;
    document.getElementById("farmerInputs")
        .classList.toggle("hidden", role !== "farmer");
    resetUI();
}

/* ---------------- UTIL ---------------- */
function normalize(text) {
    return text ? text.toLowerCase().trim() : "";
}

/* ---------------- RESET UI ---------------- */
function resetUI() {
    document.getElementById("result").classList.add("hidden");
    document.getElementById("compareSection").classList.add("hidden");
    document.getElementById("compareResult").innerText = "";
    currentCompareCrop = null;
}

/* ---------------- MAIN SEARCH ---------------- */
function searchProduct() {
    const cropInput = normalize(
        document.getElementById("productInput").value
    );

    if (!cropInput) {
        alert("Please enter a crop name");
        return;
    }

    /* ---------- USER MODE ---------- */
    if (currentRole === "user") {
        const row = dataset.find(r =>
            normalize(r[COL_CROP]).includes(cropInput)
        );

        if (!row) {
            alert("Crop not found in dataset");
            return;
        }

        showWaterResult(row);
        return;
    }

    /* ---------- FARMER MODE ---------- */
    const soil = normalize(document.getElementById("soilInput").value);
    const climate = normalize(document.getElementById("climateInput").value);

    if (!soil || !climate) {
        alert("Please select soil and climate");
        return;
    }

    const row = dataset.find(r =>
        normalize(r[COL_CROP]).includes(cropInput) &&
        normalize(r[COL_SOIL]) === soil &&
        normalize(r[COL_CLIMATE]) === climate
    );

    if (!row) {
        showMessage("❌ This crop does not grow in this soil/climate.");
        return;
    }

    showWaterResult(row);
}

/* ---------------- DISPLAY RESULT ---------------- */
function showWaterResult(row) {
    const waterM3 = parseFloat(row[COL_WATER]);

    // 🔥 DATA-DRIVEN CLASSIFICATION
    let category = "low";
    if (waterM3 >= HIGH_T) category = "high";
    else if (waterM3 >= LOW_T) category = "medium";

    document.getElementById("productName").innerText =
        row[COL_CROP].toUpperCase();

    document.getElementById("waterValue").innerText =
        `Water Footprint: ${waterM3} m³ per kg`;

    const badge = document.getElementById("category");
    badge.innerText = category.toUpperCase();
    badge.className = `badge ${category}`;

    document.getElementById("message").innerText =
        category === "high"
            ? "High water usage crop. Consider alternatives."
            : "This crop has acceptable water usage.";

    document.getElementById("result").classList.remove("hidden");

    // Show comparison ONLY if HIGH
    if (category === "high") {
        document.getElementById("compareSection").classList.remove("hidden");
        currentCompareCrop = {
            crop: row[COL_CROP],
            waterM3
        };
    } else {
        document.getElementById("compareSection").classList.add("hidden");
        currentCompareCrop = null;
    }
}

/* ---------------- COMPARISON ---------------- */
function compareProduct() {
    if (!currentCompareCrop) return;

    const altCrop = normalize(
        document.getElementById("compareInput").value
    );

    if (!altCrop) {
        alert("Enter alternative crop");
        return;
    }

    const row = dataset.find(r =>
        normalize(r[COL_CROP]).includes(altCrop)
    );

    if (!row) {
        document.getElementById("compareResult").innerText =
            "❌ Alternative crop not found.";
        return;
    }

    const altM3 = parseFloat(row[COL_WATER]);

    const msg =
        altM3 < currentCompareCrop.waterM3
            ? `✅ ${row[COL_CROP]} uses LESS water than ${currentCompareCrop.crop}.`
            : `⚠️ ${row[COL_CROP]} uses MORE water than ${currentCompareCrop.crop}.`;

    document.getElementById("compareResult").innerText =
        `${currentCompareCrop.crop}: ${currentCompareCrop.waterM3} m³/kg\n` +
        `${row[COL_CROP]}: ${altM3} m³/kg\n\n${msg}`;
}function compareProduct() {
    if (!currentCompareCrop) return;

    const altCropInput = document.getElementById("compareInput").value;
    const altCrop = normalize(altCropInput);

    if (!altCrop) {
        alert("Enter alternative crop");
        return;
    }

    // Find matching crop
    const row = dataset.find(r =>
        normalize(r[COL_CROP]).includes(altCrop)
    );

    const compareBox = document.getElementById("compareResult");

    if (!row) {
        compareBox.innerText = "❌ Alternative crop not found.";
        return;
    }

    const altM3 = parseFloat(row[COL_WATER]);

    const isBetter = altM3 < currentCompareCrop.waterM3;

    let message = isBetter
        ? `✅ <b>${row[COL_CROP]}</b> uses <b>LESS water</b> than <b>${currentCompareCrop.crop}</b>.`
        : `⚠️ <b>${row[COL_CROP]}</b> uses <b>MORE water</b> than <b>${currentCompareCrop.crop}</b>.`;

    // Base comparison text
    compareBox.innerHTML = `
        <b>Comparison Result</b><br><br>
        ${currentCompareCrop.crop}: ${currentCompareCrop.waterM3} m³/kg<br>
        ${row[COL_CROP]}: ${altM3} m³/kg<br><br>
        ${message}
    `;

    // Show analysis button ONLY if alternative is better
    if (isBetter) {
        compareBox.innerHTML += `
            <br><br>
            <button onclick="goToAnalysis(
                '${currentCompareCrop.crop}',
                ${currentCompareCrop.waterM3},
                '${row[COL_CROP]}',
                ${altM3}
            )">
                View Detailed Analysis
            </button>
        `;
    }
}

/* ---------------- MESSAGE ---------------- */
function showMessage(text) {
    document.getElementById("result").classList.remove("hidden");
    document.getElementById("productName").innerText = "";
    document.getElementById("waterValue").innerText = "";
    document.getElementById("category").innerText = "";
    document.getElementById("message").innerText = text;
}

/* ---------------- SCROLL REVEAL ---------------- */
function initScrollReveal() {
    const reveals = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add("active");
            }
        });
    }, { threshold: 0.15 });

    reveals.forEach(el => observer.observe(el));
}

function goToAnalysis(crop1, water1, crop2, water2) {
    const params = new URLSearchParams({
        crop1,
        water1,
        crop2,
        water2
    });

    window.location.href = `analysis.html?${params.toString()}`;
}
