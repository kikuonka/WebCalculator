"use strict";

/*
    реализация функции, которая выполняет математиматические операции калькулятора
*/
function math(oper) {
    let tokens = oper.match(/(\d+\.\d+|\d+|[-+*/^()])/g);   //здесь просиходит обработка входящей строки
                                                            //разбиение на токены
    if (!tokens) return "Ошибка";

    let OPNQueue = [];  //это очередь
                        //но я бы сказала, это реализация Обратной Польской Нотации для операндов
    let operators = []; //это операторы
    let priority = {'+': 1, '-': 1, '*': 2, '/': 2, '^': 3};    //это расставленный приоритет

    //далее идет цикл обработки токенов
    for (let i = 0; i < tokens.length; i++) {
        let token = tokens[i];
        //проверка на число
        if (!isNaN(token)) {
            OPNQueue.push(parseFloat(token));
        //проверка на оператора
        } else if (token in priority) {
            //распределение операторов по их приоритету
            while (operators.length && priority[operators[operators.length - 1]] >= priority[token]) {
                OPNQueue.push(operators.pop());
            }
            operators.push(token);
        //проверка на открывающуюся скобку
        } else if (token === '(') {
            operators.push(token);
        //проверка на закрывающуюся скобку
        } else if (token === ')') {
            while (operators.length && operators[operators.length - 1] !== '(') {
                OPNQueue.push(operators.pop());
            }
            if (operators.length === 0) return "Ошибка";
            operators.pop();
        }
    }

    if (operators.includes('(')) return "Ошибка";

    while (operators.length) {
        OPNQueue.push(operators.pop());
    }

    let stack = [];
    //работа со стеком
    //выполнение математических операций
    for (let token of OPNQueue) {
        if (!isNaN(token)) {
            stack.push(token);
        } else {
            let num2 = stack.pop();
            let num1 = stack.pop();
            if (num1 === undefined || num2 === undefined) return "Ошибка";
            switch (token) {
                case '+': stack.push(num1 + num2); break;
                case '-': stack.push(num1 - num2); break;
                case '*': stack.push(num1 * num2); break;
                case '/': 
                    if (num2 === 0) return "Ошибка";
                    stack.push(num1 / num2); break;
                case '^': stack.push(Math.pow(num1, num2)); break;
            }
        }
    }
    return stack.length ? stack[0] : "Ошибка";
}

/*
    функция сохранения состояния дисплея (введенные значения)
    и их загрузка при обновлении
*/
let temp = localStorage.getItem("calculate_element") || "";
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("display").innerText = temp || "0";
})
function saveLocalStorage() {
    if (temp !== "Ошибка") {
        localStorage.setItem("calculate_element", temp);
    }
}

/*
    основная логика вычисления с обработкой возможных ошибок
*/
function calculate() {
    if (temp === "" || !/[\d)]$/.test(temp)) {
        failCatch();
        return;
    }
    try {
        let result = math(temp);
        if (result === "Ошибка") {
            failCatch();
        } else {
            document.getElementById("display").innerText = result;
            temp = result.toString();
            saveLocalStorage();
        }
    } catch {
        failCatch()
    }
}
function failCatch() {
    document.getElementById("display").innerText = "Ошибка";
    temp = "";
    localStorage.removeItem("calculate_element");
}

/* 
    функции полной очистки дисплея 
    и удаления последнего введенного значения
*/
function clearAll() {
    temp = "";
    document.getElementById("display").innerText = "0";
    localStorage.removeItem("calculate_element");
}
function clearOne() {
    if (temp.length === 0) return;
    temp = temp.slice(0, -1);
    document.getElementById("display").innerText = temp || 0;
    saveLocalStorage();
}

/*
    функция обработки нажатых кнопок
    и проверка вводимых значений
*/
function pressTo(button) {
    if (button === 'C') {
        clearAll();
    } else if (button === 'DEL') { 
        clearOne();
    } else if (button === '%') {
        if (temp === "" || isNaN(parseFloat(temp))) {
            document.getElementById("display").innerText = "Ошибка";
            temp = "";
            localStorage.removeItem("calculate_element");
        } else {
            temp = (parseFloat(temp) / 100).toString();
            document.getElementById("display").innerText = temp;
            saveLocalStorage();
        }
    } else if (button === '+/-') {
        if (temp === "" || isNaN(parseFloat(temp))) {
            return;
        }

        let match = temp.match(/-?\d+\.?\d*$/);
        if (match) {
            let number = parseFloat(match[0]);
            let inverted = (-number).toString();
            temp = temp.slice(0, -match[0].length) + inverted;
            document.getElementById("display").innerText = temp;
            saveLocalStorage();
        }
    } else if (button === '=') {
        calculate();
    } else {
        if (/[-+*/]$/.test(temp) && /[-+*/]/.test(button)) return;
        temp += button;
        document.getElementById("display").innerText = temp;
        saveLocalStorage();
        adjustFontSize();
    }
}


/*
    функция для адаптации размера текста к его длине
*/
let initialTextLength = 0;
let isTextOverflowing = false;

function adjustFontSize() {
    const display = document.getElementById("display");
    const parent = display.parentElement;
    const baseFontSize = 2;
    const minFontSize = 1.5; 
    const currentTextLength = display.innerText.length;

    if (display.scrollWidth > parent.clientWidth && !isTextOverflowing) {
        initialTextLength = currentTextLength;
        isTextOverflowing = true;
        display.style.fontSize = minFontSize + "em";
    } else if (isTextOverflowing && currentTextLength <= initialTextLength) {
        display.style.fontSize = baseFontSize + "em";
        isTextOverflowing = false;
    }
}
