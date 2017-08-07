import NameInput from "./NameInput";

'use strict';

//Наследуется от NameInput, там комментарии
export default class EmailInput extends NameInput {

    constructor() {

        super(arguments);

        this.div = null;
        this.input = null;
        this.error = null;

        this.errorText = "Email должен иметь формат: email@email.ru";
        this.regularStringValidate = /^[A-Za-z0-9]\w*\@\w+\.[a-z]+$/;
        this.regularStringKeydown = /^[\w@.-]$/;
    }

    createLabel() {
        let label = document.createElement('label');
        label.className = "control-label";
        label.innerText = "Email";

        return label;
    }

    createInput() {
        let input = document.createElement('input');
        input.className = "form-control";
        input.type = "text";
        input.placeholder = "Ваш Email";
        input.name = "email";

        return input;
    }
}