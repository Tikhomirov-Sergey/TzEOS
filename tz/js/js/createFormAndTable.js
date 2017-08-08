'use strict';

import Form from "./Form";
import Table from "./Table";

//Функция удаляет кнопки, создает форму и таблицу.
//Метод createElement() создает элемент и помещает его в dom модель
export default function createFormAndTable(event) {

    event.currentTarget.remove();

    let divForm = document.getElementById('form');
    let form = new Form(divForm);
    form.createElement();

    let divTable = document.getElementById('table');
    let table = new Table(divTable);
    table.createTable();

    form.setTable(table);
}