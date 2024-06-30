import createStatementData from './createStatementData.js';

export function statement(invoice, plays) {
    return renderPlainText(createStatementData(invoice, plays));
}

export function htmlStatement(invoice, plays) {
    return renderHtml(createStatementData(invoice, plays))
}

function usd(aNumber) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(aNumber / 100);
}

function renderPlainText(data) {
    let result = `Invoice (Customer: ${data.customer})\n`;

    for (let perf of data.performances) {
        result += ` ${perf.play.name}: ${usd(perf.amount)} (${perf.audience})\n`;
    }

    result += `Total: ${usd(data.totalAmount)}\n`;
    result += `Volume Credits: ${data.totalVolumeCredits} credits\n`;
    return result;
}

function renderHtml(data) {
    let result = `<h1>Invoice (Customer: ${data.customer})</h1>\n`;
    result += "<table>\n"
    result += "<tr><th>Play Name</th><th>Audience</th><th>Amount</th></tr>"
    for (let perf of data.performances) {
        result += `<tr><td>${perf.play.name}</td><td>${perf.audience}</td><td>${usd(perf.amount)}</td></tr>\n`;
    }
    result += "</table>\n"

    result += `<p>Total: <em>${usd(data.totalAmount)}</em></p>\n`;
    result += `<p>Volume Credits: <em>${data.totalVolumeCredits} credits</em></p>\n`;
    return result;
}
