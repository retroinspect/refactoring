colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
};

function print(text, color = "reset") {
    console.log(colors[color]);
    console.log(text);
    console.log(colors["reset"]);
}

function amountFor(aPerformance, play) {
    let result = 0;

    switch (play.type) {
        case "tragedy":
            result = 40000;
            if (aPerformance.audience > 30) {
                result += 1000 * (aPerformance.audience - 30);
            }
            break;
        case "comedy":
            result = 3000;
            if (aPerformance.audience > 20) {
                result += 10000 + 500 * (aPerformance.audience - 20);
            }
            result += 300 * aPerformance.audience;
            break;
        default:
            throw new Error(`Unknown genre: ${play.type}`);
    }
    return result;
}

function statement(invoice, plays) {
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `Invoice (Customer: ${invoice.customer})\n`;
    const format = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format;

    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }

    for (let perf of invoice.performances) {
        const thisAmount = amountFor(perf, playFor(perf));

        volumeCredits += Math.max(perf.audience - 30, 0);
        if ("comedy" === playFor(perf).type) volumeCredits += Math.floor(perf.audience / 5);

        result += ` ${playFor(perf).name}: ${format(thisAmount / 100)} (${perf.audience})\n`;
        totalAmount += thisAmount;
    }

    result += `Total: ${format(totalAmount / 100)}\n`;
    result += `Volume Credits: ${volumeCredits} credits\n`;
    return result;
}

const invoices = require('./invoices.json');
const plays = require('./plays.json');

const expected = `
Invoice (Customer: BigCo)
 Hamlet: $650.00 (55)
 As You Like It: $310.00 (35)
 Othello: $500.00 (40)
Total: $1,460.00
Volume Credits: 47 credits
`;

const actual = statement(invoices[0], plays);

if (expected.trim() === actual.trim()) {
    print("PASS", "green");
} else {
    print("FAIL", "red");
    print(`expected: ${expected}`);
    print(`actual: ${actual}`);
}
