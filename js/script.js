// Function to toggle between Loan Details and Ownership Period field
function toggleLoanDetails(value) {
    const loanDetails = document.getElementById("loanDetails");
    const ownershipPeriodSection = document.getElementById("ownershipPeriodSection");
    const loanAvailedLabel = document.getElementById("loanAvailedLabel");
    const expenseReport = document.getElementById("expenseReport");

    if (value === "1") { // Loan Availed: Yes
        loanDetails.style.display = "block";
        ownershipPeriodSection.style.display = "none";
        loanAvailedLabel.textContent = "Yes";
    } else { // Loan Availed: No
        loanDetails.style.display = "none";
        ownershipPeriodSection.style.display = "block";
        loanAvailedLabel.textContent = "No";

        // Remove Loan Details from the report
        const loanReportSection = document.querySelector(".section");
        if (loanReportSection) {
            loanReportSection.remove();
        }
    }
}

// Roundoff Number to 2 decimals
function formatToTwoDecimals(value) {
return Math.round(value * 100) / 100;
}
function generateReport() {
    // Get inputs from user
    const model = document.getElementById("model").value;
    const downPayment = formatToTwoDecimals(parseFloat(document.getElementById("downPayment").value));
    const principal = formatToTwoDecimals(parseFloat(document.getElementById("principal").value));
    const interestRate = formatToTwoDecimals(parseFloat(document.getElementById("interestRate").value));
    const termMonths = parseInt(document.getElementById("termMonths").value);
    const emiPaidInAdvance = formatToTwoDecimals(parseFloat(document.getElementById("emiPaidInAdvance").value));
    const ownershipPeriod = parseInt(document.getElementById("ownershipPeriod").value);
    const distance = parseInt(document.getElementById("distance").value);
    const mileage = formatToTwoDecimals(parseFloat(document.getElementById("mileage").value));
    const fuelCost = formatToTwoDecimals(parseFloat(document.getElementById("fuelCost").value));
    const serviceMaintenance = formatToTwoDecimals(parseFloat(document.getElementById("serviceMaintenance").value));
    const otherMaintenance = formatToTwoDecimals(parseFloat(document.getElementById("otherMaintenance").value));
    const monthsPaid = parseInt(document.getElementById("monthsPaid").value);
    const resaleValue = formatToTwoDecimals(parseFloat(document.getElementById("resaleValue").value));
    
    // Save input values to localStorage
    localStorage.setItem('model', model);
    localStorage.setItem('downPayment', downPayment);
    localStorage.setItem('principal', principal);
    localStorage.setItem('interestRate', interestRate);
    localStorage.setItem('termMonths', termMonths);
    localStorage.setItem('emiPaidInAdvance', emiPaidInAdvance);
    localStorage.setItem('ownershipPeriod', ownershipPeriod);
    localStorage.setItem('distance', distance);
    localStorage.setItem('mileage', mileage);
    localStorage.setItem('fuelCost', fuelCost);
    localStorage.setItem('serviceMaintenance', serviceMaintenance);
    localStorage.setItem('otherMaintenance', otherMaintenance);
    localStorage.setItem('monthsPaid', monthsPaid);
    localStorage.setItem('resaleValue', resaleValue);

    // Ensure default values if loan details are zero
    const monthlyInterestRate = (interestRate / 100) / 12;
    const emi = (principal > 0 && termMonths > 0 && interestRate > 0)
        ? formatToTwoDecimals((principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, termMonths)) / (Math.pow(1 + monthlyInterestRate, termMonths) - 1))
        : 0; // Default to 0 if loan is not taken
    const totalLoanAmount = formatToTwoDecimals(emi * termMonths);
    
    const emiPaidToDate = formatToTwoDecimals(emi * monthsPaid + emiPaidInAdvance);
    const emiToBePaid = formatToTwoDecimals(totalLoanAmount - emiPaidToDate);
    
    // Maintenance Cost Calculation
    const ownershipPeriodInYears = ownershipPeriod / 12;
    const fuelConsumedPerYear = distance / mileage;
    const totalFuelCost = formatToTwoDecimals(fuelConsumedPerYear * fuelCost * ownershipPeriodInYears);
    const totalServiceMaintenance = formatToTwoDecimals(serviceMaintenance * ownershipPeriodInYears);
    
    // Total Expenses Calculation
    const vehicleCost = formatToTwoDecimals(downPayment + totalLoanAmount);
    const totalMaintenanceCost = formatToTwoDecimals(totalFuelCost + totalServiceMaintenance + otherMaintenance);
    const totalExpense = formatToTwoDecimals(vehicleCost + totalMaintenanceCost);
    
    // Calculate expenses for months paid
    const vehicleCostToDate = formatToTwoDecimals(downPayment + emiPaidToDate);
    const totalFuelCostPaid = formatToTwoDecimals(fuelConsumedPerYear * fuelCost * (monthsPaid / 12));
    const totalServiceMaintenancePaid = formatToTwoDecimals(serviceMaintenance * (monthsPaid / 12));
    const totalMaintenanceCostPaid = formatToTwoDecimals(totalFuelCostPaid + totalServiceMaintenancePaid + otherMaintenance);
    const totalExpensePaid = formatToTwoDecimals(vehicleCostToDate + totalMaintenanceCostPaid);

    // Generate and display the report
    const reportHTML = `
        <div class="report-section">
            <h3>Vehicle Details</h3>
            <p>Vehicle Model: ${model}</p>
            <hr>
        </div>

        <div class="report-section">
            <h3>Loan Details</h3>
            <p>Down Payment: ${downPayment.toFixed(2)}</p>
            <p>EMI (Monthly): ${emi.toFixed(2)}</p>
            <p>Total Loan Amount: ${totalLoanAmount.toFixed(2)}</p>
            <p>EMI Paid To-Date: ${emiPaidToDate.toFixed(2)}</p>
            <p>EMI Due: ${emiToBePaid.toFixed(2)}</p>
            <p>EMI Paid In Advance: ${emiPaidInAdvance.toFixed(2)}</p>
            <hr>
        </div>

        <div class="report-section">
            <h3>Maintenance Cost for ${monthsPaid} Months To-Date</h3>
            <p>Vehicle Cost: ${vehicleCostToDate.toFixed(2)}</p>
            <p>Fuel Cost: ${totalFuelCostPaid.toFixed(2)}</p>
            <p>Service Maintenance: ${totalServiceMaintenancePaid.toFixed(2)}</p>
            <p>Other Maintenance & Repair: ${otherMaintenance.toFixed(2)}</p>
            <p>Total Expense To-Date: ${totalExpensePaid.toFixed(2)}</p>
            <hr>
        </div>

        <div class="report-section">
            <h3>Maintenance Cost for ${ownershipPeriodInYears} Years</h3>
            <p>Vehicle Cost: ${vehicleCost.toFixed(2)}</p>
            <p>Fuel Cost: ${totalFuelCost.toFixed(2)}</p>
            <p>Service Maintenance: ${totalServiceMaintenance.toFixed(2)}</p>
            <p>Other Maintenance & Repair: ${otherMaintenance.toFixed(2)}</p>
            <p>Total Expense for Ownership Period: ${totalExpense.toFixed(2)}</p>
            <hr>
        </div>

        <div class="report-section">
            <h3>Vehicle Resale Value</h3>
            <p>Current Resale Value: ${resaleValue.toFixed(2)}</p>
        </div>
    `;
    document.getElementById("expenseReport").innerHTML = reportHTML;
    document.getElementById("expenseReport").style.display = 'block';

    // Add Chart.js DataLabels plugin
    Chart.register(ChartDataLabels);
    
    let chartToDate = null;
    let chartOwnership = null;

    function createBarChart(ctx, labels, data, chartLabel, maxYValueRounded) {
        const colors = [
            '#79b5c9', // Light Blue
            '#ccccc', // Red
        ];
    
        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: chartLabel,
                    data: data,
                    backgroundColor: labels.map((_, index) => colors[index % colors.length]), // Assign colors cyclically
                    borderColor: '#ccc',
                    borderWidth: 1,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    datalabels: {
                        anchor: 'end',
                        align: 'end',
                        color: '#2985A5',
                        font: { size: 12, weight: 'bold' },
                        formatter: (value) => value.toLocaleString()
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        min: 0,
                        max: maxYValueRounded,
                        ticks: {
                            callback: (value) => value.toLocaleString(),
                        },
                    }
                }
            }
        });
    }

    function calculateMaxYValue(dataArray) {
        const maxValue = Math.max(...dataArray);
        return Math.ceil(maxValue / 100000) * 100000;
    }

    function generateCharts() {
        //generateReport();
        const maxYValue = calculateMaxYValue([
            vehicleCostToDate,
            totalFuelCostPaid,
            totalServiceMaintenancePaid,
            otherMaintenance,
            vehicleCost,
            totalFuelCost,
            totalServiceMaintenance,
        ]);

        // Destroy existing charts if they exist
        if (chartToDate) chartToDate.destroy();
        if (chartOwnership) chartOwnership.destroy();

        // Create the charts
        const ctxToDate = document.getElementById('expenseChartToDate').getContext('2d');
        chartToDate = createBarChart(
            ctxToDate,
            ['Vehicle Cost', 'Fuel Cost Paid', 'Service Maintenance Paid', 'Other Maintenance'],
            [vehicleCostToDate, totalFuelCostPaid, totalServiceMaintenancePaid, otherMaintenance],
            'Expense To-Date',
            maxYValue
        );

        const ctxOwnership = document.getElementById('expenseChartOwnership').getContext('2d');
        chartOwnership = createBarChart(
            ctxOwnership,
            ['Vehicle Cost', 'Fuel Cost Total', 'Service Maintenance Total', 'Other Maintenance'],
            [vehicleCost, totalFuelCost, totalServiceMaintenance, otherMaintenance],
            'Expense Ownership Period',
            maxYValue
        );
    }

    // Ensure this is called at the end of generateReport
    generateCharts();
}

function saveProfile() {
    const profile = {
        model: document.getElementById("model").value,
        downPayment: document.getElementById("downPayment").value,
        principal: document.getElementById("principal").value,
        interestRate: document.getElementById("interestRate").value,
        termMonths: document.getElementById("termMonths").value,
        emiPaidInAdvance: document.getElementById("emiPaidInAdvance").value,
        ownershipPeriod: document.getElementById("ownershipPeriod").value,
        distance: document.getElementById("distance").value,
        mileage: document.getElementById("mileage").value,
        fuelCost: document.getElementById("fuelCost").value,
        serviceMaintenance: document.getElementById("serviceMaintenance").value,
        otherMaintenance: document.getElementById("otherMaintenance").value,
        monthsPaid: document.getElementById("monthsPaid").value,
        resaleValue: document.getElementById("resaleValue").value
    };

    // Retrieve profiles from localStorage
    const profiles = JSON.parse(localStorage.getItem("vehicleProfiles")) || [];
    profiles.push(profile);

    // Save updated profiles back to localStorage
    localStorage.setItem("vehicleProfiles", JSON.stringify(profiles));
    //alert("Profile saved successfully!");

    updateProfileSelector();
}

function loadProfile() {
    const selectedIndex = document.getElementById("profileSelector").value;
    if (!selectedIndex) {
        alert("Please select a profile.");
        return;
    }

    // Retrieve profiles from localStorage
    const profiles = JSON.parse(localStorage.getItem("vehicleProfiles")) || [];
    const profile = profiles[selectedIndex];

    // Load profile data into the form
    document.getElementById("model").value = profile.model;
    document.getElementById("downPayment").value = profile.downPayment;
    document.getElementById("principal").value = profile.principal;
    document.getElementById("interestRate").value = profile.interestRate;
    document.getElementById("termMonths").value = profile.termMonths;
    document.getElementById("emiPaidInAdvance").value = profile.emiPaidInAdvance;
    document.getElementById("ownershipPeriod").value = profile.ownershipPeriod;
    document.getElementById("distance").value = profile.distance;
    document.getElementById("mileage").value = profile.mileage;
    document.getElementById("fuelCost").value = profile.fuelCost;
    document.getElementById("serviceMaintenance").value = profile.serviceMaintenance;
    document.getElementById("otherMaintenance").value = profile.otherMaintenance;
    document.getElementById("monthsPaid").value = profile.monthsPaid;
    document.getElementById("resaleValue").value = profile.resaleValue;

    // Generate the report and refresh the charts
    generateReport();
    generateCharts();

    //alert("Profile loaded and charts updated successfully!");
}


function deleteProfile() {
    const selectedIndex = document.getElementById("profileSelector").value;
    if (!selectedIndex) {
        alert("Please select a profile.");
        return;
    }

    // Retrieve profiles from localStorage
    const profiles = JSON.parse(localStorage.getItem("vehicleProfiles")) || [];
    profiles.splice(selectedIndex, 1);

    // Save updated profiles back to localStorage
    localStorage.setItem("vehicleProfiles", JSON.stringify(profiles));
    //alert("Profile deleted successfully!");

    updateProfileSelector();
}

function updateProfileSelector() {
    const profiles = JSON.parse(localStorage.getItem("vehicleProfiles")) || [];
    const profileSelector = document.getElementById("profileSelector");

    // Clear existing options
    profileSelector.innerHTML = '<option value="">Select a Profile</option>';

    // Populate the selector with profile options
    profiles.forEach((profile, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = profile.model || `Profile ${index + 1}`;
        profileSelector.appendChild(option);
    });
}

// Initialize the profile selector on page load
updateProfileSelector();

function loadLastSavedData() {
    // Load saved data from localStorage
    if (localStorage.getItem('model')) {
        document.getElementById('model').value = localStorage.getItem('model');
        document.getElementById('downPayment').value = localStorage.getItem('downPayment');
        document.getElementById('principal').value = localStorage.getItem('principal');
        document.getElementById('interestRate').value = localStorage.getItem('interestRate');
        document.getElementById('termMonths').value = localStorage.getItem('termMonths');
        document.getElementById('ownershipPeriod').value = localStorage.getItem('ownershipPeriod');
        document.getElementById('distance').value = localStorage.getItem('distance');
        document.getElementById('mileage').value = localStorage.getItem('mileage');
        document.getElementById('fuelCost').value = localStorage.getItem('fuelCost');
        document.getElementById('serviceMaintenance').value = localStorage.getItem('serviceMaintenance');
        document.getElementById('otherMaintenance').value = localStorage.getItem('otherMaintenance');
        document.getElementById('monthsPaid').value = localStorage.getItem('monthsPaid');
        document.getElementById('resaleValue').value = localStorage.getItem('resaleValue');
    } else {
        alert('No saved data found!');
        }
}
    

function loadNotes() {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const notesList = document.getElementById('notesList');
    notesList.innerHTML = '';
    notes.forEach((note, index) => {
        const noteElement = document.createElement('div');
        noteElement.classList.add('note');
        noteElement.innerHTML = `
            <p>${note}</p>
            <button onclick="deleteNote(${index})">Delete</button>
        `;
        notesList.appendChild(noteElement);
    });
}

function addNote() {
    const noteInput = document.getElementById('noteInput');
    const note = noteInput.value.trim();
    if (!note) {
        alert('Please enter a note.');
        return;
    }
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.push(note);
    localStorage.setItem('notes', JSON.stringify(notes));
    noteInput.value = '';
    loadNotes();
}

function deleteNote(index) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.splice(index, 1);
    localStorage.setItem('notes', JSON.stringify(notes));
    loadNotes();
}

loadNotes();