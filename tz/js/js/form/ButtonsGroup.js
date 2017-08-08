'use strict';

//Группа кнопок
export default class ButtonsGroup {

    constructor() {

        this.div = null;

        this.buttonAdd = null;
        this.buttonReset = null;
    }

    createElement() {
        let div = this.createMainDiv();

        let buttonAdd = this.createButtonAdd();
        this.buttonAdd = buttonAdd;

        let buttonReset = this.createButtonReset();
        this.buttonReset = buttonReset;

        div.appendChild(buttonAdd);
        div.appendChild(buttonReset);

        this.div = div;
    }

    createMainDiv() {
        let div = document.createElement('div');
        div.className = "form-group";

        return div;
    }

    createButtonAdd() {
        let button = document.createElement('button');
        button.className = "btn btn-default";
        button.type = "button";
        button.innerText = "Добавить";
        button.name = "add";

        return button;
    }

    createButtonReset() {
        let button = document.createElement('button');
        button.className = "btn btn-default";
        button.type = "reset";
        button.innerText = "Очистить";
        button.name = "reset";

        return button;
    }

    getElement() {
        if (!this.div) this.createElement();

        return this.div;
    }

    clickAdd() {

        if (this.buttonAdd) {
            this.buttonAdd.click();
        }
    }

    clickReset() {

        if (this.buttonReset) {
            this.buttonReset.click();
        }
    }

}