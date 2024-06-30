import invoices from './invoices.json' assert { type: "json" };
import plays from './plays.json' assert { type: "json" };
import statement from './statement.js';

const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
};

function print(text, color = "reset") {
    console.log(colors[color]);
    console.log(text);
    console.log(colors["reset"]);
}

function test(expected, actual) {
    if (expected.trim() === actual.trim()) {
        print("PASS", "green");
    } else {
        print("FAIL", "red");
        print(`expected: ${expected}`);
        print(`actual: ${actual}`);
    }
}

function main() {
    test(`
Invoice (Customer: BigCo)
 Hamlet: $650.00 (55)
 As You Like It: $310.00 (35)
 Othello: $500.00 (40)
Total: $1,460.00
Volume Credits: 47 credits
`, statement(invoices[0], plays));
}

main();
