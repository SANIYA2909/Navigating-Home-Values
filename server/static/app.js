// Function to get Bathroom value from the form
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

    // const url = "/api/predict"

    $.post(url,{
        total_sqft: parseFloat(sqft.value),
        bhk: bhk,
        bath: bathrooms,
        location: location.value
    },function(data, status){
        console.log(data.estimated_price);
        estPrice.innerHTML = "<h2>Rs. "+data.estimated_price.toString()+" Lakhs</h2>";
        console.log(status);
    });
}

// Function to load locations when the page loads
function onPageLoad() {
    console.log("loaded document");
    const url = "http://127.0.0.1:5000/locations";
    $.get(url, function(data, status) {
        console.log("got locations");
        if (data) {
            const locations = data.locations;
            const uiLocations = document.getElementById("uiLocations");
            $('#uiLocations').empty();
            for (var i in locations) {
                var opt = new Option(locations[i]);
                $('#uiLocations').append(opt);
            }
        }
    })
}

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
    event.preventDefault();
    let propertyValue = parseFloat(document.getElementById("propertyValue").value);
    let taxRate = parseFloat(document.getElementById("taxRate").value) / 100;
    const taxResult = document.getElementById("taxResult");

    if (propertyValue && taxRate) {
        let annualTax = propertyValue * taxRate;
        taxResult.innerHTML = "Annual Tax: " + annualTax.toFixed(2);
    } else {
        taxResult.innerHTML = "Please enter valid values.";
    }
}


window.onload = onPageLoad;
