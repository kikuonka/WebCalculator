/*
    TO-DO: Реализация функции для выполнения математических операций (+ степени).
    Требования: Использование системы стека/очереди для обработки операторов и операндов с учетом их приоритета.
*/

"use strict";

function math(oper) {
    /*
        Я НЕНАВИЖУ РЕГУЛЯРНЫЕ ВЫРАЖЕНИЯ
        ОНИ ИСПОРТИЛИ МНЕ ВЕЧЕР
        __________________________________________
        Словарик:
        \d+ - несколько цифр от 0 до 9
        \.? - допускается одна точка точка
        \d* - допускаются несколько цифр от 0 до 9
        ИЛИ
        [] - перечисление допустимых операторов
        __________________________________________
    */
    let tokens = oper.match(/(\d+\.?\d*|[-+*/^()])/g);
    if (!tokens) return "Ошибка";

    let OPNQueue = [];
    let operators = [];
    let priority = {'+': 1, '-': 1, '*': 2, '/': 2, '^': 3};

    for (let token of tokens) {
        if (!isNaN(token)) {
            OPNQueue.push(parseFloat(token));
        } else if (token in priority) {
            while (operators.length && priority[operators[operators.length - 1]] >= priority[token]) {
                OPNQueue.push(operators.pop());
            }
            operators.push(token);
        } else if (token === '(') {
            operators.push(token);
        } else if (token === ')') {
            while (operators.length && operators[operators.length - 1] !== '(') {
                OPNQueue.push(operators.pop());
            }
            operators.pop();
        }
    }

    while (operators.length) {
        OPNQueue.push(operators.pop());
    }

    let stack = [];
    for (let token of OPNQueue) {
        if (!isNaN(token)) {
            stack.push(token);
        } else {
            let num1 = stack.pop();
            let num2 = stack.pop();
            switch (token) {
                case '+': stack.push(num1 + num2); break;
                case '-': stack.push(num1 - num2); break;
                case '*': stack.push(num1 * num2); break;
                case '/': stack.push(num1 / num2); break;
                case '^': stack.push(Math.pow(num1, num2)); break;
            }
        }
    }

    return stack[0];
}

/*
    TO-DO:      Реализация функционала для расчета результата.
    Требования: Внедрение возможности сохранения последних введенных данных в localstorage,
                чтобы после обновления страницы сохранялось введенные пользователем значения,
                которые еще не были вычислены.
*/

let temp = localStorage. getItem("calculate_element") || "";
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("display").innerText = temp || "0";
})

function saveLocalStorage() {
    localStorage.setItem("calculate_element", temp);
}

function calculate() {
    try {
        let result = math(temp);
        document.getElementById("display").innerText = result;
        temp = result.toString();
        saveLocalStorage();
    } catch {
        document.getElementById("display").innerText = "Ошибка";
        temp = "";
        localStorage.removeItem("calculate_element");
    }
}

/*
    TO-DO: Реализация возможности полностью очистить все введенные данные.
    Требования: ---
*/

function clearAll() {
    temp = "";
    document.getElementById("display").innerText = "0";
    localStorage.removeItem("calculate_element");
}

/*
    TO-DO: Реализация удаления последних введенных операторов и операндов.
    Требования: ---
*/

function clearOne() {
    if (temp.length === 0) return;

    temp = temp.slice(0, -1);
    document.getElementById("display").innerText = temp || 0;
    saveLocalStorage();
}

/*
    ВАЖНО! Калькулятор не работал, потому что функция была названа click()
    В JS и без этого хватает встроенных событий с таким наименованием
*/

function pressTo(button) {
    if (button === 'C') {
        clearAll();
    } else if (button === 'DEL') { 
        clearOne();
    } else if (button === '=') {
        calculate();
    } else {
        temp += button;
        document.getElementById("display").innerText = temp;
        saveLocalStorage();
    }
}

document.getElementById("year").textContent = new Date().getFullYear();
