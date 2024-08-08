const exchangeRates = {
    USD: { INR: 74.85, GBP: 0.75 },
    EUR: { INR: 88.55, GBP: 0.85 }
};

function convert() {
    const amount = document.getElementById('amount').value;
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;
    
    if (amount === '' || isNaN(amount)) {
        alert('Please enter a valid amount');
        return;
    }
    
    const result = (amount * exchangeRates[fromCurrency][toCurrency]).toFixed(2);
    document.getElementById('result').textContent = 
        `${amount} ${fromCurrency} = ${result} ${toCurrency}`;
}
