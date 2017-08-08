import NameInput from "./NameInput";

'use strict';

//Наследуется от NameInput, там комментарии
export default class PhoneInput extends NameInput {

    constructor() {

        super(arguments);

        this.div = null;
        this.input = null;
        this.error = null;

        this.errorText = "Номер должен иметь формат: +X (XXX) XXX-XX-XX";
        this.regularStringValidate = /^\+\d ?\(\d{3}\) ?\d{3}\-\d{2}\-\d{2}$/;

        this.regularStringKeydown = /^[\d\ \(\)\-+]$/;

    }

    createLabel() {
        let label = document.createElement('label');
        label.className = "control-label";
        label.innerText = "Телефон";

        return label;
    }

    createInput() {
        let input = document.createElement('input');
        input.className = "form-control";
        input.type = "text";
        input.placeholder = "Ваш Телефон";
        input.name = "phone";

        return input;
    }
}