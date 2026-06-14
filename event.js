let display = document.getElementById("display");

function addValue(value) {
    display.value += value;
}

function clearDisplay() {
    display.value = "";
}

function backspace() {
    display.value = display.value.slice(0, -1);
}

function percentage(value) {
    display.value += value;
}

document.getElementById("equal").addEventListener("click", function () {
    try {
        let expression = display.value;

        expression = expression.replace(/(\d+)%/g, '($1/100)');

        let result = eval(expression);

        if (!isFinite(result)) {
            display.value = "Error: Division by zero";
            return;
        }

        display.value = result;
    }
    catch (error) {
        display.value = "Error";
    }


});
