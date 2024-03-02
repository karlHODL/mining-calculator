const rateForm = document.getElementById('rate-form');
const rateResults = document.getElementById('rate-results');

async function getApiKey() {
    const response = await fetch('/api-key')
    const data = await response.json();
    return data.apiKey;
}

function updateHoursOutput(value) {
    const output = document.getElementById('hours-per-day-output')
    output.textContent = value
}

function updateDaysOutput(value) {
    const output = document.getElementById('days-per-month-output')
    output.textContent = value
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

rateForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const zipCode = document.getElementById('zip-code').value
    const customerType = document.getElementById('customer-type').value 
    const hoursPerDay = parseInt(document.getElementById('hours-per-day').value)
    const daysPerMonth = parseInt(document.getElementById('days-per-month').value)
    const powerConsumption = parseInt(document.getElementById('power-consumption').value)
    const numberOfRigs = parseInt(document.getElementById('number-rigs').value)

    const apiKey = await getApiKey()

    try {
        const response = await fetch(`https://developer.nrel.gov/api/utility_rates/v3.json?api_key=${apiKey}&address=${zipCode}`)

        if (!response.ok) {
            throw new Error('Failed to fetch data from the API.')
        }

        const data = await response.json()

        // Find the rate based on the customer type
        const rate = data.outputs[customerType]

        // Test calculation **CHANGE THIS**
        const costIncreasePerMonth = (powerConsumption * numberOfRigs * hoursPerDay / 1000) * daysPerMonth * rate 

        // Display the results to the page
        rateResults.innerHTML = `
            <h2>Utility Rates for ${zipCode} (${capitalizeFirstLetter(customerType)})</h2>
            <p>Average Rate: $${rate}/kWh</p>
            <p>Approximate electricity bill increase running ${numberOfRigs} rig(s) for ${hoursPerDay} hours per day for ${daysPerMonth} days: $${costIncreasePerMonth.toFixed(2)}</p>
        `
    } catch (error) {
        rateResults.innerHTML = `<h2>${error.message}</h2>`
    }
})