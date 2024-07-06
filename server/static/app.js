// Function to get Bathroom value from the form
// Function to get the number of bathrooms from the form
// Fetch property data from Flask backend

function getBathValue() {
    var uiBathrooms = $("[name='uiBathrooms']");
    for (var i in uiBathrooms) {
        if (uiBathrooms[i].checked) {
            return parseInt(i) + 1; // get no. of bathrooms
        }
    }
    return -1; // Invalid inputs
}

// Function to get BHK value from the form
function getBHKValue() {
    var uiBHK = $("[name='uiBHK']");
    for (var i in uiBHK) {
        if (uiBHK[i].checked) {
            return parseInt(i) + 1; // get no. of bhk
        }
    }
    return -1; // Invalid inputs
}

// Function to estimate home price
function onClickedEstimatePrice(){
    console.log("estimate button clicked");
    const sqft = document.getElementById("uiSqft");
    const bhk = getBHKValue();
    const bathrooms = getBathValue();
    const location = document.getElementById("uiLocations");
    const estPrice = document.getElementById("uiEstimatedPrice");
    // console.log("bhk",bhk);
    // console.log("bath",bathrooms);
    const url = "http://127.0.0.1:5000/predict";
    //const url = "/api/predict"

    $.post(url, {
        total_sqft: parseFloat(sqft.value),
        bhk: bhk,
        bath: bathrooms,
        location: location.value
    }, function(data, status){
        console.log(data.estimated_price);
        estPrice.innerHTML = "<h2>Rs. " + data.estimated_price.toString() + " Lakhs</h2>";
        console.log(status);
    });
}

// Function to load locations when the page loads
function onPageLoad() {
    console.log("loaded document");
    const url = "http://127.0.0.1:5000/locations";
    //const url = "/api/locations"
    $.get(url, function(data, status) {
        console.log("got locations");
        if (data) {
            const locations = data.locations;
            const uiLocations = document.getElementById("uiLocations");
            $('#uiLocations').empty();
            for(var i in locations){
                var opt = new Option(locations[i]);
                $('#uiLocations').append(opt);
            }
        }
    })
}

document.addEventListener("DOMContentLoaded", function() {
    // Mortgage Calculator Function
    document.getElementById("mortgage-form").addEventListener("submit", function(event) {
        event.preventDefault();
        calculateMortgage();
    });

    // Property Tax Calculator Function
    document.getElementById("property-tax-form").addEventListener("submit", function(event) {
        event.preventDefault();
        calculatePropertyTax();
    });
});

// Mortgage Calculator Function
function calculateMortgage(event) {
    event.preventDefault();
    let loanAmount = parseFloat(document.getElementById("loanAmount").value);
    let interestRate = parseFloat(document.getElementById("interestRate").value) / 100 / 12;
    let loanTerm = parseFloat(document.getElementById("loanTerm").value) * 12;
    const mortgageResult = document.getElementById("mortgageResult");

    if (loanAmount && interestRate && loanTerm) {
        let monthlyPayment = (loanAmount * interestRate) / (1 - Math.pow(1 + interestRate, -loanTerm));
        mortgageResult.innerHTML = "Monthly Payment: " + monthlyPayment.toFixed(2);
    } else {
        mortgageResult.innerHTML = "Please enter valid values.";
    }
}

// Property Tax Calculator Function
function calculatePropertyTax(event) {
    event.preventDefault(); // Prevent the form from refreshing the page

    // Get values from the form
    let propertyValue = parseFloat(document.getElementById("propertyValue").value);
    let taxRate = parseFloat(document.getElementById("taxRate").value) / 100;

    // Reference to the element where the result will be displayed
    const taxResult = document.getElementById("taxResult");

    // Validate input
    if (isNaN(propertyValue) || isNaN(taxRate) || propertyValue <= 0 || taxRate < 0) {
        taxResult.innerHTML = "Please enter valid values.";
    } else {
        // Calculate annual tax
        let annualTax = propertyValue * taxRate;
        taxResult.innerHTML = "Annual Tax: " + annualTax.toFixed(2);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // Event listener for Home Affordability Calculator
    document.getElementById('home-affordability-form').addEventListener('submit', function (event) {
        event.preventDefault();
        calculateHomeAffordability();
    });

    // Scroll the page to the result section
    function scrollToElement(element) {
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Home Affordability Calculator function
    function calculateHomeAffordability() {
        const annualIncome = parseFloat(document.getElementById('annualIncome').value);
        const monthlyDebt = parseFloat(document.getElementById('monthlyDebt').value);
        const downPayment = parseFloat(document.getElementById('downPayment').value);
        const loanInterestRate = parseFloat(document.getElementById('loanInterestRate').value) / 100;

        if (!isNaN(annualIncome) && !isNaN(monthlyDebt) && !isNaN(downPayment) && !isNaN(loanInterestRate) &&
            annualIncome > 0 && monthlyDebt >= 0 && downPayment >= 0 && loanInterestRate >= 0) {
            // Calculate the maximum affordable price using the 36% rule for debt-to-income ratio
            const maxMonthlyPayment = (annualIncome / 12) * 0.36 - monthlyDebt;
            // Calculate the maximum loan amount based on the monthly payment and interest rate
            const maxLoanAmount = (maxMonthlyPayment * (1 - Math.pow(1 + loanInterestRate / 12, -360))) / (loanInterestRate / 12);
            // Calculate the maximum affordable home price
            const maxAffordablePrice = maxLoanAmount + downPayment;

            document.getElementById('homeAffordabilityResult').innerHTML = `Maximum Affordable Home Price: ₹ ${maxAffordablePrice.toFixed(2)} Lakh`;
        } else {
            // Display error message without <h3> headers
            document.getElementById('homeAffordabilityResult').innerHTML = `Please enter valid values.`;
        }

        // Scroll to the result
        scrollToElement(document.getElementById('homeAffordabilityResult'));
    }
});

window.onload = onPageLoad;
