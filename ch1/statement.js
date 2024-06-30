import createStatementData from './createStatementData.js';

export default function statement(invoice, plays) {
    return renderPlainText(createStatementData(invoice, plays));
}

function renderPlainText(data) {
    let result = `Invoice (Customer: ${data.customer})\n`;

    for (let perf of data.performances) {
        result += ` ${perf.play.name}: ${usd(perf.amount)} (${perf.audience})\n`;
    }

    result += `Total: ${usd(data.totalAmount)}\n`;
    result += `Volume Credits: ${data.totalVolumeCredits} credits\n`;
    return result;


    function usd(aNumber) {
        return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(aNumber / 100);
    }
}
