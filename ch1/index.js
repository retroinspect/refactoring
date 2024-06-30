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

function renderPlainText(statementData, invoice, plays) {
    let result = `Invoice (Customer: ${invoice.customer})\n`;

    for (let perf of invoice.performances) {
        result += ` ${playFor(perf).name}: ${usd(amountFor(perf, playFor(perf)))} (${perf.audience})\n`;
    }

    result += `Total: ${usd(totalAmount())}\n`;
    result += `Volume Credits: ${totalVolumeCredits()} credits\n`;
    return result;

    function usd(aNumber) {
        return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(aNumber / 100);
    }

    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }

    function amountFor(aPerformance) {
        let result = 0;

        switch (playFor(aPerformance).type) {
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
                throw new Error(`Unknown genre: ${playFor(aPerformance).type}`);
        }
        return result;
    }

    function volumeCreditsFor(aPerformance) {
        let volumeCredits = 0;
        volumeCredits += Math.max(aPerformance.audience - 30, 0);
        if ("comedy" === playFor(aPerformance).type) volumeCredits += Math.floor(aPerformance.audience / 5);
        return volumeCredits;
    }

    function totalVolumeCredits() {
        let result = 0;
        for (let perf of invoice.performances) {
            result += volumeCreditsFor(perf);
        }
        return result;
    }

    function totalAmount() {
        let result = 0;
        for (let perf of invoice.performances) {
            result += amountFor(perf, playFor(perf));
        }
        return result;
    }
}

function statement(invoice, plays) {
    const statementData = {}
    return renderPlainText(statementData, invoice, plays);
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
