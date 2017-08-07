'use strict';


export default class NameInput {

    constructor() {
        this.div = null;
        this.input = null;
        this.error = null;

        //Текст ошибки
        this.errorText = "Имя может содержать только символы кириллицы. Пример: Сергей";

        //Регулярное выражение для проверки строки, при клике на кнопку Добавить
        this.regularStringValidate = /^[А-Яа-я][а-я]+$/;

        //Регулярное выражение для проверки символа (событие keydown)
        this.regularStringKeydown = /^[А-Яа-я]$/;

        this.keydownOnInput = this.keydownOnInput.bind(this);
    }

    createElement() {
        let div = this.createMainDiv();
        let label = this.createLabel();
        let input = this.createInput();
        let error = this.createError();

        this.input = input;
        this.error = error;

        this.input.onkeydown = this.keydownOnInput;

        div.appendChild(label);
        div.appendChild(input);
        div.appendChild(error);

        this.div = div;
    }

    createMainDiv() {
        let div = document.createElement('div');
        div.className = "form-group";

        return div;
    }

    createLabel() {
        let label = document.createElement('label');
        label.className = "control-label";
        label.innerText = "Имя";

        return label;
    }

    createInput() {
        let input = document.createElement('input');
        input.className = "form-control";
        input.type = "text";
        input.placeholder = "Ваше Имя";
        input.name = "name";

        return input;
    }

    getInput() {
        if (!this.div) this.createElement();
        return this.div;
    }

    createError() {
        let error = document.createElement('p');
        error.className = "text-error";
        error.innerText = this.errorText;
        error.style.color = "#FF0000";
        error.style.display = "none";

        return error;
    }

    //Проверка строки
    validate() {

        let string = this.input.value;
        string = string.trim();

        if (string && this.regularStringValidate.test(string)) {
            this.error.style.display = "none";
            this.input.style.borderColor = "#cccccc";

            return true;

        } else {
            //Если строка не прошла проверку, то показываем ошибку
            this.error.style.display = "block";
            this.input.style.borderColor = "#FF0000";

            return false;

        }
    }

    //Обработчик события keydown
    keydownOnInput(event) {

        let key = event.key;

        if (!this.regularStringKeydown || event.keyCode < 32) return true;

        if (key && this.regularStringKeydown) {
            //Проверка, соответсявует ли символ регулярному выражению
            return this.regularStringKeydown.test(key);
        }

        return false;
    }
};
