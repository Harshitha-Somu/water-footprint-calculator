---

Water Footprint Calculator

---

Project Overview

This project is a web-based application that helps users understand how much water is consumed in producing different food and agricultural crops. It promotes awareness of sustainable food choices by revealing the hidden water footprint behind everyday crops.

---

Features

• Search water footprint of crops using a real agricultural dataset
• Categorizes crops into low, medium, and high water consumption
• User mode for general awareness
• Farmer mode with soil and climate validation
• Crop comparison to suggest water-efficient alternatives
• Visual analysis page with multiple graphs (bar chart, pie chart, histogram, box plot)
• Clean, responsive UI with animations and interactive cards

---

Technologies Used

• HTML
• CSS
• JavaScript
• PapaParse (CSV parsing)
• Chart.js (data visualization)

---

Dataset

Agricultural Water Footprint Dataset
Source: Kaggle

The dataset contains crop-wise water consumption values and is directly used in the frontend without any backend processing.

---

Folder Structure


water-footprint-project
│
├── index.html
├── style.css
├── script.js
│
├── analysis.html
├── analysis.css
├── analysis.js
│
├── agricultural_water_footprint.csv
│
└── README.md


---

How It Works

1. User selects User or Farmer mode
2. Crop name is entered
3. Farmer mode additionally checks soil type and climate
4. System matches input with dataset
5. Water footprint is calculated and categorized
6. If water usage is high, alternative crops can be compared
7. Detailed visual analysis is shown using graphs

---

Use Cases

• Students learning sustainability concepts
• Farmers planning water-efficient crops
• Educators and researchers
• Environment-conscious users

---

Future Enhancements

• ML-based prediction for crops not present in dataset
• Region-specific crop recommendations
• Improved mobile-first UI
• Backend integration for large datasets

---

Live Demo

Visit the site here:
[https://harshitha-somu.github.io/water-footprint-calculator/](https://harshitha-somu.github.io/water-footprint-calculator/)

---

Developed By

Harshitha Somu

---

