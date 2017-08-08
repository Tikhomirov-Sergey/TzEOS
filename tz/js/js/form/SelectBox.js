'use strict';

//Класс создания селект бокса
export default class SelectBox {

    constructor(name, nameAttribute, array, onChange) {
        this.name = name;
        this.nameAttribute = nameAttribute;
        this.array = array;

        if (onChange) this.onChange = onChange;

        this.div = null;
    }

    createElement() {
        let div = this.createMainDiv();
        let label = this.createLabel();
        let select = this.createSelect();

        div.appendChild(label);
        div.appendChild(select);

        this.div = div;
    }

    createMainDiv() {
        let div = document.createElement('div');
        div.className = "form-group col-lg-6 col-md-6 col-sm-4";

        return div;
    }

    createLabel() {
        let label = document.createElement('label');
        label.className = "control-label";
        label.innerText = this.name;

        return label;
    }

    createSelect() {
        let select = document.createElement('select');
        select.className = "selectpicker input-sm";
        select.name = this.nameAttribute;
        for (let element in this.array) {
            let option = document.createElement('option');
            option.innerText = this.array[element];
            option.value = element;

            select.appendChild(option);
        }

        if (this.onChange) select.onchange = this.onChange;

        return select;
    }

    getSelectBox() {
        if (!this.div) this.createElement();

        return this.div;
    }

    updateList(array) {

        if (array) {
            this.array = array;

            this.div.getElementsByTagName('select')[0].remove();
            let select = this.createSelect();

            this.div.appendChild(select);
        }
    }

    clearList() {
        this.array = null;

        this.div.getElementsByTagName('select')[0].remove();
        let select = this.createSelect();

        this.div.appendChild(select);
    }
}