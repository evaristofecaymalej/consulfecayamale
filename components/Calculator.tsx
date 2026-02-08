
import React, { useState } from 'react';

const Calculator: React.FC = () => {
    const [display, setDisplay] = useState('0');
    const [firstOperand, setFirstOperand] = useState<number | null>(null);
    const [operator, setOperator] = useState<string | null>(null);
    const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);

    const inputDigit = (digit: string) => {
        if (waitingForSecondOperand) {
            setDisplay(digit);
            setWaitingForSecondOperand(false);
        } else {
            setDisplay(display === '0' ? digit : display + digit);
        }
    };

    const inputDecimal = () => {
        if (!display.includes('.')) {
            setDisplay(display + '.');
        }
    };

    const clearDisplay = () => {
        setDisplay('0');
        setFirstOperand(null);
        setOperator(null);
        setWaitingForSecondOperand(false);
    };

    const performOperation = (nextOperator: string) => {
        const inputValue = parseFloat(display);

        if (firstOperand === null) {
            setFirstOperand(inputValue);
        } else if (operator) {
            const result = calculate(firstOperand, inputValue, operator);
            setDisplay(String(result));
            setFirstOperand(result);
        }

        setWaitingForSecondOperand(true);
        setOperator(nextOperator);
    };

    const calculate = (first: number, second: number, op: string) => {
        switch (op) {
            case '+': return first + second;
            case '-': return first - second;
            case '*': return first * second;
            case '/': return first / second;
            default: return second;
        }
    };
    
    const handleEquals = () => {
        if (operator && firstOperand !== null) {
            const result = calculate(firstOperand, parseFloat(display), operator);
            setDisplay(String(result));
            setFirstOperand(null);
            setOperator(null);
            setWaitingForSecondOperand(true);
        }
    }

    const buttonClasses = "text-xl font-semibold rounded-lg h-16 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-300";
    const digitClasses = "bg-neutral-light text-secondary hover:bg-neutral-medium";
    const operatorClasses = "bg-primary-50 text-primary hover:bg-primary-100";
    const specialClasses = "bg-neutral-medium text-secondary hover:bg-gray-300";
    const equalsClasses = "bg-primary text-white hover:bg-primary-600 col-span-2";

    return (
        <div className="p-2 space-y-2">
            <div className="bg-gray-800 text-white text-4xl text-right font-light rounded-lg px-4 py-6 mb-2">
                {display}
            </div>
            <div className="grid grid-cols-4 gap-2">
                <button onClick={clearDisplay} className={`${buttonClasses} ${specialClasses}`}>AC</button>
                <button disabled className={`${buttonClasses} ${specialClasses}`}>+/-</button>
                <button disabled className={`${buttonClasses} ${specialClasses}`}>%</button>
                <button onClick={() => performOperation('/')} className={`${buttonClasses} ${operatorClasses}`}>÷</button>

                <button onClick={() => inputDigit('7')} className={`${buttonClasses} ${digitClasses}`}>7</button>
                <button onClick={() => inputDigit('8')} className={`${buttonClasses} ${digitClasses}`}>8</button>
                <button onClick={() => inputDigit('9')} className={`${buttonClasses} ${digitClasses}`}>9</button>
                <button onClick={() => performOperation('*')} className={`${buttonClasses} ${operatorClasses}`}>×</button>

                <button onClick={() => inputDigit('4')} className={`${buttonClasses} ${digitClasses}`}>4</button>
                <button onClick={() => inputDigit('5')} className={`${buttonClasses} ${digitClasses}`}>5</button>
                <button onClick={() => inputDigit('6')} className={`${buttonClasses} ${digitClasses}`}>6</button>
                <button onClick={() => performOperation('-')} className={`${buttonClasses} ${operatorClasses}`}>-</button>

                <button onClick={() => inputDigit('1')} className={`${buttonClasses} ${digitClasses}`}>1</button>
                <button onClick={() => inputDigit('2')} className={`${buttonClasses} ${digitClasses}`}>2</button>
                <button onClick={() => inputDigit('3')} className={`${buttonClasses} ${digitClasses}`}>3</button>
                <button onClick={() => performOperation('+')} className={`${buttonClasses} ${operatorClasses}`}>+</button>

                <button onClick={() => inputDigit('0')} className={`${buttonClasses} ${digitClasses} col-span-2`}>0</button>
                <button onClick={inputDecimal} className={`${buttonClasses} ${digitClasses}`}>.</button>
                <button onClick={handleEquals} className={`${buttonClasses} ${equalsClasses}`}>=</button>
            </div>
        </div>
    );
};

export default Calculator;
