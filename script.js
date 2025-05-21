// Core Calculator Logic
class Calculator {
    constructor() {
        this.currentInput = '';
        this.firstOperand = null;
        this.operator = null;
        this.shouldResetDisplay = false;
        this.displayValue = '';
    }

    getDisplayValue() {
        return this.displayValue;
    }

    _updateInternalDisplay(value) {
        this.displayValue = String(value);
    }

    handleNumber(numberStr) {
        if (this.shouldResetDisplay) {
            this.currentInput = '';
            this.shouldResetDisplay = false;
        }

        if (this.currentInput === '0' && numberStr === '0') return;
        if (this.currentInput === '0' && numberStr !== '0') {
            this.currentInput = numberStr;
        } else {
            this.currentInput += numberStr;
        }
        this._updateInternalDisplay(this.currentInput);
    }

    handleOperator(op) {
        if (this.currentInput === '' && this.firstOperand === null) return;

        if (this.firstOperand === null) {
            this.firstOperand = parseFloat(this.currentInput);
            this.operator = op;
            this.currentInput = '';
            this.shouldResetDisplay = true; 
        } else if (this.operator && this.currentInput !== '') {
            this.calculate(); // Calculate previous result
            this.operator = op; // Then set the new operator
            this.currentInput = '';
            this.shouldResetDisplay = true;
        } else { // Operator pressed multiple times or after equals
            this.operator = op;
            this.shouldResetDisplay = true; 
        }
    }

    calculate() {
        if (this.firstOperand === null || this.operator === null || this.currentInput === '') {
            // If called by an operator press and currentInput is empty, do nothing yet.
            // If called by equals and currentInput is empty, also do nothing.
            if (this.currentInput === '' && this.operator && this.firstOperand !== null) {
                 // This case can happen if user presses e.g. 5 + =
                 // We should probably not calculate here, or decide on a behavior.
                 // For now, let's assume this is not a valid sequence to trigger calculation.
                return;
            }
             if (this.firstOperand === null || this.operator === null ) return;
        }


        const secondOperand = parseFloat(this.currentInput);
        let result;

        switch (this.operator) {
            case '+':
                result = this.firstOperand + secondOperand;
                break;
            case '-':
                result = this.firstOperand - secondOperand;
                break;
            case '*':
                result = this.firstOperand * secondOperand;
                break;
            case '/':
                if (secondOperand === 0) {
                    this._updateInternalDisplay('Error');
                    this.currentInput = ''; // Keep currentInput as empty after error
                    this.firstOperand = null;
                    this.operator = null;
                    this.shouldResetDisplay = true;
                    return;
                }
                result = this.firstOperand / secondOperand;
                break;
            default:
                return;
        }

        if (isNaN(result) || !isFinite(result)) {
            this._updateInternalDisplay('Error');
            this.currentInput = '';
            this.firstOperand = null;
            this.operator = null;
            this.shouldResetDisplay = true;
        } else {
            result = parseFloat(result.toFixed(10)); // Round to avoid floating point issues
            this._updateInternalDisplay(result);
            this.firstOperand = result;
            this.currentInput = String(result); // So it can be used if an operator is pressed next
            this.operator = null; // Reset operator after calculation
            // shouldResetDisplay is set by the calling context (equals or next operator)
        }
    }

    clear() {
        this.currentInput = '';
        this.firstOperand = null;
        this.operator = null;
        this.shouldResetDisplay = false;
        this._updateInternalDisplay('');
    }

    // This method is for the equals button action
    handleEquals() {
        if (this.firstOperand !== null && this.operator && this.currentInput !== '') {
            this.calculate();
            this.shouldResetDisplay = true; // After equals, next number should start new calc
        }
    }
}

// DOM Interaction Layer - This part remains in script.js but uses the Calculator class
document.addEventListener('DOMContentLoaded', () => {
    const displayElement = document.getElementById('display');
    const calculator = new Calculator(); // Instantiate the calculator

    function updateDisplayDOM() {
        displayElement.value = calculator.getDisplayValue();
    }

    // Initialize display
    calculator.clear();
    updateDisplayDOM();

    // Number buttons
    const numberButtonIds = [
        'btn-0', 'btn-1', 'btn-2', 'btn-3', 'btn-4',
        'btn-5', 'btn-6', 'btn-7', 'btn-8', 'btn-9'
    ];
    numberButtonIds.forEach(id => {
        const button = document.getElementById(id);
        button.addEventListener('click', () => {
            calculator.handleNumber(button.textContent);
            updateDisplayDOM();
        });
    });

    // Operator buttons
    const operatorButtonIds = ['btn-add', 'btn-subtract', 'btn-multiply', 'btn-divide'];
    operatorButtonIds.forEach(id => {
        const button = document.getElementById(id);
        button.addEventListener('click', () => {
            calculator.handleOperator(button.textContent);
            // Display might not change until next number or equals,
            // but if an error occurred (e.g. during chained calc), it should update.
            updateDisplayDOM();
        });
    });

    // Equals button
    document.getElementById('btn-equals').addEventListener('click', () => {
        calculator.handleEquals();
        updateDisplayDOM();
    });

    // Clear button
    document.getElementById('btn-clear').addEventListener('click', () => {
        calculator.clear();
        updateDisplayDOM();
    });
});

// Export the Calculator class for testing if using modules (optional for this setup)
// If not using modules, tests will need to access Calculator globally or script.js needs to be loaded before test.js
// For simplicity in this environment, we'll assume Calculator becomes globally accessible when script.js is loaded.
// Or, test.js can instantiate its own Calculator objects. The latter is cleaner.
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Calculator;
}
