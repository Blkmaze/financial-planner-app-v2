const fs = require('fs');
const pdf = require('pdf-parse');

const buffer = fs.readFileSync('./Bills.PDF');

pdf(buffer).then(data => {
  const lines = data.text.split('\n').map(line => line.trim()).filter(Boolean);
  const transactions = [];

  for (let line of lines) {
    const match = line.match(/^(\d{2}\/\d{2})\s+(.+?)\s+(-?\$[\d,]+\.\d{2})$/);
    if (match) {
      const [_, date, desc, amountStr] = match;
      const amount = parseFloat(amountStr.replace(/[^0-9.-]/g, ''));
      const type = amount > 0 ? 'income' : 'expense';
      transactions.push({ date, desc, amount, type });
    }
  }

  fs.writeFileSync('./parsed-transactions.json', JSON.stringify(transactions, null, 2));
  console.log(' Transactions saved to parsed-transactions.json');
});
