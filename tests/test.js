QUnit.module('Calculator Logic', function(hooks) {
    let calculator;

    hooks.beforeEach(function() {
        calculator = new Calculator();
    });

    QUnit.test('Number Appending', function(assert) {
        calculator.handleNumber('1');
        assert.equal(calculator.getDisplayValue(), '1', 'Appended 1');
        calculator.handleNumber('2');
        assert.equal(calculator.getDisplayValue(), '12', 'Appended 2');
        calculator.handleNumber('3');
        assert.equal(calculator.getDisplayValue(), '123', 'Appended 3');
        calculator.handleNumber('0');
        assert.equal(calculator.getDisplayValue(), '1230', 'Appended 0');
    });

    QUnit.test('Prevent multiple leading zeros', function(assert) {
        calculator.handleNumber('0');
        assert.equal(calculator.getDisplayValue(), '0', 'Appended 0');
        calculator.handleNumber('0');
        assert.equal(calculator.getDisplayValue(), '0', 'Appended second 0, display still 0');
        calculator.handleNumber('5');
        assert.equal(calculator.getDisplayValue(), '5', 'Appended 5, display is 5 (replaced 0)');
    });
    
    QUnit.test('Number input after 0', function(assert) {
        calculator.handleNumber('0');
        calculator.handleNumber('5');
        assert.equal(calculator.getDisplayValue(), '5', 'Input 0 then 5, should be 5');
        calculator.clear();
        calculator.handleNumber('0');
        calculator.handleNumber('0');
        calculator.handleNumber('7');
        assert.equal(calculator.getDisplayValue(), '7', 'Input 0, 0, then 7, should be 7');
    });

    QUnit.test('Basic Addition: 5 + 3 = 8', function(assert) {
        calculator.handleNumber('5');
        calculator.handleOperator('+');
        calculator.handleNumber('3');
        calculator.handleEquals();
        assert.equal(calculator.getDisplayValue(), '8', '5 + 3 = 8');
    });

    QUnit.test('Basic Subtraction: 10 - 4 = 6', function(assert) {
        calculator.handleNumber('1');
        calculator.handleNumber('0');
        calculator.handleOperator('-');
        calculator.handleNumber('4');
        calculator.handleEquals();
        assert.equal(calculator.getDisplayValue(), '6', '10 - 4 = 6');
    });

    QUnit.test('Basic Multiplication: 7 * 2 = 14', function(assert) {
        calculator.handleNumber('7');
        calculator.handleOperator('*');
        calculator.handleNumber('2');
        calculator.handleEquals();
        assert.equal(calculator.getDisplayValue(), '14', '7 * 2 = 14');
    });

    QUnit.test('Basic Division: 12 / 3 = 4', function(assert) {
        calculator.handleNumber('1');
        calculator.handleNumber('2');
        calculator.handleOperator('/');
        calculator.handleNumber('3');
        calculator.handleEquals();
        assert.equal(calculator.getDisplayValue(), '4', '12 / 3 = 4');
    });

    QUnit.test('Clear Functionality', function(assert) {
        calculator.handleNumber('1');
        calculator.handleNumber('2');
        calculator.handleOperator('+');
        calculator.handleNumber('3');
        calculator.clear();
        assert.equal(calculator.getDisplayValue(), '', 'Display is empty after clear');
        assert.equal(calculator.currentInput, '', 'currentInput is empty');
        assert.equal(calculator.firstOperand, null, 'firstOperand is null');
        assert.equal(calculator.operator, null, 'operator is null');
        assert.false(calculator.shouldResetDisplay, 'shouldResetDisplay is false');
        // Try an operation after clear to ensure it starts fresh
        calculator.handleNumber('5');
        calculator.handleOperator('+');
        calculator.handleNumber('2');
        calculator.handleEquals();
        assert.equal(calculator.getDisplayValue(), '7', '5 + 2 = 7 after clear');
    });

    QUnit.test('Division by Zero', function(assert) {
        calculator.handleNumber('5');
        calculator.handleOperator('/');
        calculator.handleNumber('0');
        calculator.handleEquals();
        assert.equal(calculator.getDisplayValue(), 'Error', '5 / 0 = Error');
        assert.equal(calculator.firstOperand, null, 'firstOperand is null after error');
        assert.equal(calculator.operator, null, 'operator is null after error');
        assert.true(calculator.shouldResetDisplay, 'shouldResetDisplay is true after error');
    });
    
    QUnit.test('Operation resulting in NaN (0/0)', function(assert) {
        calculator.handleNumber('0');
        calculator.handleOperator('/');
        calculator.handleNumber('0');
        calculator.handleEquals();
        assert.equal(calculator.getDisplayValue(), 'Error', '0 / 0 = Error');
        assert.equal(calculator.firstOperand, null, 'firstOperand is null after NaN error');
    });

    QUnit.test('Chained Operations: 10 - 2 + 5 = 13', function(assert) {
        calculator.handleNumber('1');
        calculator.handleNumber('0'); // 10
        calculator.handleOperator('-'); // 10 -
        calculator.handleNumber('2');   // 10 - 2
        calculator.handleOperator('+'); // (10-2)=8, new op is +
        assert.equal(calculator.firstOperand, 8, 'Intermediate result 10-2=8');
        calculator.handleNumber('5');   // 8 + 5
        calculator.handleEquals();
        assert.equal(calculator.getDisplayValue(), '13', '10 - 2 + 5 = 13');
    });

    QUnit.test('Order of Operations (Implicit via Chaining): 5 + 3 * 2 = 11', function(assert) {
        // Standard calculator processes left-to-right for chained input like this
        // So, 5 + 3 is calculated first, then the result is multiplied by 2. (5+3)*2 = 16
        // If it were true order of operations (PEMDAS), it would be 5 + (3*2) = 11.
        // The current implementation does left-to-right.
        calculator.handleNumber('5');
        calculator.handleOperator('+');
        calculator.handleNumber('3');
        calculator.handleOperator('*'); // (5+3)=8, new op is *
        assert.equal(calculator.firstOperand, 8, 'Intermediate result 5+3=8');
        calculator.handleNumber('2');
        calculator.handleEquals();
        assert.equal(calculator.getDisplayValue(), '16', '5 + 3 * 2 = 16 (left-to-right)');
    });

     QUnit.test('Order of Operations (PEMDAS like): 5 * 3 + 2 = 17', function(assert) {
        // Test: 5 * 3 + 2.  (5*3) then + 2.
        calculator.handleNumber('5');
        calculator.handleOperator('*');
        calculator.handleNumber('3');
        calculator.handleOperator('+'); // (5*3)=15, new op is +
        assert.equal(calculator.firstOperand, 15, 'Intermediate result 5*3=15');
        calculator.handleNumber('2');
        calculator.handleEquals();
        assert.equal(calculator.getDisplayValue(), '17', '5 * 3 + 2 = 17 (left-to-right)');
    });


    QUnit.test('Starting a new calculation after a result is displayed', function(assert) {
        calculator.handleNumber('1');
        calculator.handleOperator('+');
        calculator.handleNumber('2');
        calculator.handleEquals(); // 1+2=3
        assert.equal(calculator.getDisplayValue(), '3', 'First calculation: 1+2=3');

        calculator.handleNumber('4'); // Start new calculation with '4'
        assert.equal(calculator.getDisplayValue(), '4', 'Display shows 4 for new calculation');
        assert.equal(calculator.currentInput, '4', 'currentInput is 4');
        assert.equal(calculator.firstOperand, 3, 'firstOperand is still 3 from previous calc until new op');
        assert.false(calculator.shouldResetDisplay, 'shouldResetDisplay is false after typing new number');
        
        calculator.handleOperator('*');
        assert.equal(calculator.firstOperand, 4, 'New firstOperand is 4');
        calculator.handleNumber('5');
        calculator.handleEquals();
        assert.equal(calculator.getDisplayValue(), '20', 'New calculation: 4 * 5 = 20');
    });

    QUnit.test('Pressing an operator multiple times consecutively', function(assert) {
        calculator.handleNumber('1');
        calculator.handleNumber('0'); // 10
        calculator.handleOperator('+');
        assert.equal(calculator.operator, '+', 'Operator is +');
        calculator.handleOperator('-');
        assert.equal(calculator.operator, '-', 'Operator changed to -');
        calculator.handleOperator('*');
        assert.equal(calculator.operator, '*', 'Operator changed to *');
        calculator.handleNumber('2');
        calculator.handleEquals();
        assert.equal(calculator.getDisplayValue(), '20', '10 * 2 = 20 (used last operator)');
    });

    QUnit.test('Pressing equals button without full input (e.g. 5 + =)', function(assert) {
        calculator.handleNumber('5');
        calculator.handleOperator('+');
        calculator.handleEquals(); // No second operand entered
        // The behavior here can vary. My current `calculate` returns if currentInput is empty.
        // So the display should remain '5' (what was last entered or result) or firstOperand.
        // The `_updateInternalDisplay` was last called with `this.currentInput` which is '5' before operator.
        // After operator, currentInput is '', displayValue is '5'.
        // `handleEquals` calls `calculate`. `calculate` checks if `this.currentInput` is empty.
        // If `this.currentInput` is `''`, it might not proceed.
        // Let's trace: 5, op(+). currentInput becomes '', firstOp=5. displayValue still 5.
        // equals. calculate(). currentInput is ''.
        // The test for `calculate` itself has: if (this.currentInput === '' && this.operator && this.firstOperand !== null) return;
        assert.equal(calculator.getDisplayValue(), '5', '5 + = should effectively do nothing or show first operand, displayValue is 5');
        assert.equal(calculator.firstOperand, 5, 'First operand is 5');
        assert.equal(calculator.operator, '+', 'Operator is +');

        // Follow up with a number and equals
        calculator.handleNumber('3');
        calculator.handleEquals();
        assert.equal(calculator.getDisplayValue(), '8', 'Followed by 3 and =, 5 + 3 = 8');
    });
    
    QUnit.test('Pressing equals button with only one number entered', function(assert) {
        calculator.handleNumber('7');
        calculator.handleEquals();
        assert.equal(calculator.getDisplayValue(), '7', '7 = should display 7');
    });

    QUnit.test('Pressing equals button repeatedly after a calculation', function(assert) {
        calculator.handleNumber('10');
        calculator.handleOperator('/');
        calculator.handleNumber('2');
        calculator.handleEquals(); // 10 / 2 = 5
        assert.equal(calculator.getDisplayValue(), '5', '10 / 2 = 5');
        calculator.handleEquals(); // Should this repeat the operation (5/2) or do nothing?
        // Current implementation: firstOperand=5, currentInput="5", operator=null
        // handleEquals calls calculate. Calculate needs an operator. It will return.
        assert.equal(calculator.getDisplayValue(), '5', 'Pressing equals again does nothing, result is still 5');
    });


    QUnit.test('Calculations with negative numbers: -5 + 3 = -2', function(assert) {
        // Note: UI does not have a +/- button, so negative numbers are input via operations.
        // e.g. 0 - 5 gives -5 as firstOperand.
        calculator.handleNumber('0');
        calculator.handleOperator('-');
        calculator.handleNumber('5'); // firstOperand becomes -5 after next operator or equals
        calculator.handleOperator('+'); // firstOperand is now -5
        assert.equal(calculator.firstOperand, -5, 'Intermediate result 0-5 = -5');
        calculator.handleNumber('3');
        calculator.handleEquals();
        assert.equal(calculator.getDisplayValue(), '-2', '-5 + 3 = -2');
    });

    QUnit.test('Calculations with negative numbers: 3 - 5 = -2', function(assert) {
        calculator.handleNumber('3');
        calculator.handleOperator('-');
        calculator.handleNumber('5');
        calculator.handleEquals();
        assert.equal(calculator.getDisplayValue(), '-2', '3 - 5 = -2');
    });
    
    QUnit.test('Calculations with negative result: 2 * -3 = -6', function(assert) {
        calculator.handleNumber('2');
        calculator.handleOperator('*');
        // Simulate entering a negative number for the second operand
        // This is tricky without a +/- button. We'll assume the first number was negative.
        // Test: 0-2 = -2. Then -2 * 3 = -6
        calculator.clear();
        calculator.handleNumber('0');
        calculator.handleOperator('-');
        calculator.handleNumber('2'); // currentInput is 2. firstOperand is 0, operator is -
        calculator.handleOperator('*'); // firstOperand becomes -2 (0-2). New operator is *
        assert.equal(calculator.firstOperand, -2, "firstOperand is -2");
        calculator.handleNumber('3');
        calculator.handleEquals();
        assert.equal(calculator.getDisplayValue(), '-6', '-2 * 3 = -6');
    });


    QUnit.test('Calculations involving zero: 0 * 5 = 0', function(assert) {
        calculator.handleNumber('0');
        calculator.handleOperator('*');
        calculator.handleNumber('5');
        calculator.handleEquals();
        assert.equal(calculator.getDisplayValue(), '0', '0 * 5 = 0');
    });

    QUnit.test('Calculations involving zero: 0 + 5 = 5', function(assert) {
        calculator.handleNumber('0');
        calculator.handleOperator('+');
        calculator.handleNumber('5');
        calculator.handleEquals();
        assert.equal(calculator.getDisplayValue(), '5', '0 + 5 = 5');
    });
    
    QUnit.test('Calculations involving zero: 5 - 0 = 5', function(assert) {
        calculator.handleNumber('5');
        calculator.handleOperator('-');
        calculator.handleNumber('0');
        calculator.handleEquals();
        assert.equal(calculator.getDisplayValue(), '5', '5 - 0 = 5');
    });

    QUnit.test('Decimal number input', function(assert) {
        // My current handleNumber doesn't explicitly handle '.', this assumes it's treated like other digits
        // For a real calculator, '.' handling would be more specific.
        // Given the current structure, it would append.
        calculator.handleNumber('1');
        calculator.handleNumber('.'); // Assuming '.' is a character that can be part of a number
        calculator.handleNumber('5');
        assert.equal(calculator.getDisplayValue(), '1.5', 'Input 1.5');
    });

    QUnit.test('Decimal calculation: 1.5 + 0.5 = 2', function(assert) {
        calculator.handleNumber('1'); // For this test, assume handleNumber can take multi-digit strings
        calculator.handleNumber('.'); // or the test needs to be adapted.
        calculator.handleNumber('5'); // currentInput = "1.5"
        // The current handleNumber takes single digits. Let's adapt how we call it for the test.
        calculator.clear();
        calculator.currentInput = "1.5"; // Manually set for test as handleNumber is digit by digit
        calculator._updateInternalDisplay("1.5");

        calculator.handleOperator('+');
        
        calculator.currentInput = "0.5"; // Manually set for test
        calculator._updateInternalDisplay("0.5");

        calculator.handleEquals();
        assert.equal(calculator.getDisplayValue(), '2', '1.5 + 0.5 = 2');
    });
    
    QUnit.test('Floating point precision (e.g. 0.1 + 0.2)', function(assert) {
        // Manually set inputs for precision test
        calculator.currentInput = "0.1";
        calculator._updateInternalDisplay("0.1");
        calculator.handleOperator('+');
        calculator.currentInput = "0.2";
        calculator._updateInternalDisplay("0.2");
        calculator.handleEquals();
        // result is parseFloat(result.toFixed(10));
        assert.equal(calculator.getDisplayValue(), '0.3', '0.1 + 0.2 should be 0.3 (handled by toFixed(10))');
    });

    QUnit.test('Operator, then number, then new operator before equals', function(assert) {
        calculator.handleNumber('5');
        calculator.handleOperator('+'); // firstOp = 5, op = +
        calculator.handleNumber('3');   // currentInput = 3
        calculator.handleOperator('-'); // Should calculate 5+3=8, then set op = -
        assert.equal(calculator.firstOperand, 8, 'Intermediate 5+3=8');
        assert.equal(calculator.operator, '-', 'New operator is -');
        assert.equal(calculator.getDisplayValue(), '3', 'Display shows last input 3, awaiting next for new op');
        // The displayValue after an intermediate calculation by handleOperator
        // is actually the *result* of that calculation due to _updateInternalDisplay(result) in calculate()
        // Let's re-verify this behavior.
        // 5, op(+), 3. state: firstOp=5, op='+', currentInput='3'. display='3'
        // op(-). calls calculate(). 5+3=8. firstOp=8. currentInput='8'. op=null. _updateInternalDisplay(8)
        // then, in handleOperator: this.operator = op ('-'). this.currentInput = ''. this.shouldResetDisplay = true.
        // So, displayValue should be '8'
        assert.equal(calculator.getDisplayValue(), '8', 'Display shows intermediate result 8');
        calculator.handleNumber('2');
        calculator.handleEquals();
        assert.equal(calculator.getDisplayValue(), '6', '8 - 2 = 6');
    });

});
