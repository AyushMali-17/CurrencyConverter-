document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const amountInput = document.getElementById('amount');
    const fromCurrencySelect = document.getElementById('fromCurrency');
    const toCurrencySelect = document.getElementById('toCurrency');
    const resultDiv = document.getElementById('result');
    const convertBtn = document.getElementById('convert-btn');
    const resetBtn = document.getElementById('reset-btn');

    init();

    themeToggle.addEventListener('change', toggleTheme);
    convertBtn.addEventListener('click', async () => {
        await convert();
        savePreferences();
    });
    resetBtn.addEventListener('click', resetFields);

    async function init() {
        loadPreferences();
        const rates = await fetchExchangeRates();
        populateCurrencyOptions(rates);
    }

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
        const amount = amountInput.value;
        const fromCurrency = fromCurrencySelect.value;
        const toCurrency = toCurrencySelect.value;

        if (!amount || isNaN(amount) || amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        const rates = await fetchExchangeRates();
        const fromRate = rates[fromCurrency];
        const toRate = rates[toCurrency];
        const result = ((amount / fromRate) * toRate).toFixed(2);

        resultDiv.textContent = `${amount} ${fromCurrency} = ${result} ${toCurrency}`;
        drawChart(fromCurrency, toCurrency);
    }

    function populateCurrencyOptions(rates) {
        for (const currency in rates) {
            if (!rates.hasOwnProperty(currency)) continue;

            const optionFrom = document.createElement('option');
            optionFrom.value = currency;
            optionFrom.textContent = currency;
            fromCurrencySelect.appendChild(optionFrom);

            const optionTo = document.createElement('option');
            optionTo.value = currency;
            optionTo.textContent = currency;
            toCurrencySelect.appendChild(optionTo);
        }
    }

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
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    function toggleTheme() {
        document.body.classList.toggle('dark-mode');
        savePreferences();
    }

    function savePreferences() {
        const preferences = {
            darkMode: themeToggle.checked,
            fromCurrency: fromCurrencySelect.value,
            toCurrency: toCurrencySelect.value
        };
        localStorage.setItem('preferences', JSON.stringify(preferences));
    }

    function loadPreferences() {
        const savedPreferences = JSON.parse(localStorage.getItem('preferences'));
        if (savedPreferences) {
            themeToggle.checked = savedPreferences.darkMode;
            document.body.classList.toggle('dark-mode', savedPreferences.darkMode);
            fromCurrencySelect.value = savedPreferences.fromCurrency;
            toCurrencySelect.value = savedPreferences.toCurrency;
        }
    }

    function resetFields() {
        amountInput.value = '';
        fromCurrencySelect.selectedIndex = 0;
        toCurrencySelect.selectedIndex = 0;
        resultDiv.textContent = '';
        localStorage.removeItem('preferences');
    }
});
