'use strict';

import NameInput from "./form/NameInput";
import EmailInput from "./form/EmailInput";
import PhoneInput from "./form/PhoneInput";
import SelectBoxCountries from "./form/SelectBoxCountries";
import SelectBoxCities from "./form/SelectBoxCities";
import ButtonsGroup from "./form/ButtonsGroup";


export default class Form {

    constructor(parentElement, table) {

        this.parentElement = parentElement;

        this.div = null;
        this.form = null;

        this.table = table;

        this.name = null;
        this.email = null;
        this.phone = null;

        this.buttonsGroup = null;


        this.clickOnButtonAdd = this.clickOnButtonAdd.bind(this);
    }

    createElement() {

        let div = this.createMainDiv();

        let form = this.createForm();
        this.form = form;

        let nameInput = new NameInput();
        this.name = nameInput;
        nameInput = nameInput.getInput();

        let emailInput = new EmailInput();
        this.email = emailInput;
        emailInput = emailInput.getInput();

        let phoneInput = new PhoneInput();
        this.phone = phoneInput;
        phoneInput = phoneInput.getInput();

        let selectBoxes = this.createSelectBoxes();

        let buttonsGroup = new ButtonsGroup();
        this.buttonsGroup = buttonsGroup;
        buttonsGroup = buttonsGroup.getElement();

        form.appendChild(nameInput);
        form.appendChild(emailInput);
        form.appendChild(phoneInput);
        form.appendChild(selectBoxes);
        form.appendChild(buttonsGroup);

        div.appendChild(form);

        this.div = div;

        this.removeForm();
        this.parentElement.appendChild(this.div);
    }

    createMainDiv() {
        let div = document.createElement('div');
        div.className = "container";

        return div;
    }

    createForm() {
        let form = document.createElement('form');
        form.className = "form-horizontal col-lg-8";
        form.role = "form";

        return form;
    }

    createSelectBoxes() {
        let div = document.createElement('div');
        div.className = "row";

        let selectBoxCountries = new SelectBoxCountries();

        let selectBoxCities = new SelectBoxCities();

        selectBoxCountries.setSelectBoxCities(selectBoxCities);

        div.appendChild(selectBoxCountries.getSelectBox());
        div.appendChild(selectBoxCities.getSelectBox());

        return div
    }

    updateElement() {
        this.createElement();
        return this.div;
    }

    //Метод связывает форму с таблицей
    setTable(table) {

        this.table = table;
        this.parentElement.querySelector('[name="add"]').onclick = this.clickOnButtonAdd;

    }

    removeForm() {
        if (this.parentElement.firstElementChild) {
            this.parentElement.firstElementChild.remove();
        }
    }

    //Событие click на кнопке добавления
    clickOnButtonAdd(event) {
        event.preventDefault();

        if (this.table && this.validate()) {

            let name = this.parentElement.querySelector('[name="name"]').value;
            let email = this.parentElement.querySelector('[name="email"]').value;
            let phone = this.parentElement.querySelector('[name="phone"]').value;

            let country = this.parentElement.querySelector('[name="countries"]');
            let selectedIndex = country.selectedIndex;
            country = country.options[selectedIndex].text;


            let city = this.parentElement.querySelector('[name="cities"]');
            selectedIndex = city.selectedIndex;
            city = city.options[selectedIndex].text;

            let user =
                {
                    id: null,
                    name: name,
                    email: email,
                    phone: phone,
                    country: country,
                    city: city
                };

            this.table.addRow(user);

            this.buttonsGroup.clickReset();
        }
    }

    //Валидация инпутов
    validate() {

        let valide = true;

        valide = this.name.validate() && valide;
        valide = this.email.validate() && valide;
        valide = this.phone.validate() && valide;

        return valide;
    }
}

