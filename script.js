async function fetchExchangeRates() {
    try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        return data.rates;
    } catch (error) {
        alert('Error fetching exchange rates. Please try again later.');
        console.error(error);
    }
}

async function convert() {
    const amount = document.getElementById('amount').value;
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;
    
    if (amount === '' || isNaN(amount)) {
        alert('Please enter a valid amount');
        return;
    }

    const rates = await fetchExchangeRates();
    const fromRate = rates[fromCurrency];
    const toRate = rates[toCurrency];
    const result = ((amount / fromRate) * toRate).toFixed(2);

    document.getElementById('result').textContent = 
        `${amount} ${fromCurrency} = ${result} ${toCurrency}`;
    drawChart(fromCurrency, toCurrency);
}

fetchExchangeRates().then(rates => {
    const fromCurrencySelect = document.getElementById('fromCurrency');
    const toCurrencySelect = document.getElementById('toCurrency');

    Object.keys(rates).forEach(currency => {
        const optionFrom = document.createElement('option');
        optionFrom.value = currency;
        optionFrom.textContent = currency;
        fromCurrencySelect.appendChild(optionFrom);

        const optionTo = document.createElement('option');
        optionTo.value = currency;
        optionTo.textContent = currency;
        toCurrencySelect.appendChild(optionTo);
    });
});

async function fetchHistoricalRates(base, target) {
    try {
        const response = await fetch(`https://api.exchangerate-api.com/v4/history/${base}/${target}`);
        const data = await response.json();
        return data.rates;
    } catch (error) {
        alert('Error fetching historical rates. Please try again later.');
        console.error(error);
    }
}

async function drawChart(base, target) {
    const historicalRates = await fetchHistoricalRates(base, target);
    const labels = Object.keys(historicalRates);
    const data = Object.values(historicalRates);

    const ctx = document.getElementById('historicalChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `Exchange Rate (${base} to ${target})`,
                data: data,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            scales: {
                x: { beginAtZero: true },
                y: { beginAtZero: true }
            }
        }
    });
}
