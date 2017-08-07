'use strict';

import JsonP from "./JsonP";
import PanelUser from "./Table/PanelUser";

export default class Table {

    constructor(parentElement) {

        this.users = null;
        this.parentElement = parentElement;

        //Таблица со всеми пользователями
        this.table = null;
        this.rows = null;

        //Таблица с одним пользователем
        this.user = null;

        //Объект с столбцами, которые нужно отобразить в таблице
        this.head = {
            id: "№",
            name: "Имя",
            email: "Email"
        };

        //Объект с ключем сортировки
        this.sort = {
            key:"id"
        };

        this.clickOnRow = this.clickOnRow.bind(this);
        this.clickOnHeadOfColumn = this.clickOnHeadOfColumn.bind(this);
        this.sortArrayByKey = this.sortArrayByKey.bind(this);

        this.backHistory = this.backHistory.bind(this);
        this.keyBackspace = this.keyBackspace.bind(this);

        history.replaceState({user:false}, '', '');
    }

    createTable() {

        let table = document.createElement('table');
        table.className = "table";

        let thead = this.createHead();
        let rows = this.createRowAll();



        if (rows) {
            table.appendChild(thead);
            table.appendChild(rows);
        }
        else {

            let divMessage = this.createMessageDownload();
            table.appendChild(divMessage);
        }

        this.table = table;
        this.div = table;

        this.removeTable();
        this.parentElement.appendChild(this.table);
    }

    createHead() {

        let thead = document.createElement('thead');

        let tr = document.createElement('tr');

        for (let colum in this.head) {
            let th = document.createElement('th');

            th.innerText = this.head[colum];
            th.id = `Column-${colum}`;
            th.style.cursor = 'pointer';
            th.onclick = this.clickOnHeadOfColumn;

            tr.appendChild(th);
        }

        thead.appendChild(tr);

        return thead;
    }

    createRowAll() {
        let tbody = document.createElement('tbody');

        if (this.checkUsers()) {
            this.users.forEach((element) => {
                let tr = this.createRowOne(element);
                tbody.appendChild(tr);
            });

            this.rows = tbody;

            return tbody;
        }
        return false;
    }

    createRowOne(columns) {

        let tr = document.createElement('tr');

        for (let colum in this.head) {
            let th = document.createElement('th');
            th.innerText = columns[colum];

            tr.appendChild(th);
        }

        tr.id = `row${columns.id}`;
        tr.style.cursor = "pointer";
        tr.onclick = this.clickOnRow;

        return tr;
    }

    checkUsers() {

        if (!this.users) {
            this.ajaxRequestUsers();
            return false;
        }

        return true;
    }

    createMessageDownload(){

        let div = document.createElement('div');
        div.className = "alert alert-info";
        div.innerText = "Загрузка таблицы";

        return div;
    }

    ajaxRequestUsers() {

        //Промис ждет подгрузки данных
        let promise = new Promise((resolve, reject) => {
            this.data = new JsonP("./data/Users/users.json", "./js/jsonP/users.js", this, 'users').request();
            setTimeout(() => {
                if (this.data) {

                    this.users = this.data;
                    resolve();
                }
            }, 1000);
        });

        //Как данные загрузились, рисует таблицу
        promise.then(() => {
                if (this.table) {
                    this.updateElement();
                }
            }
        );
    }

    updateElement() {

        this.createTable();
        return this.table;
    }

    //Добавление строки
    addRow(columns) {

        let length = this.users.length;
        columns['id'] = length + 1;

        this.users.push(columns);
        this.createTable();
    }

    removeTable() {
        if (this.parentElement.firstElementChild) {
            this.parentElement.firstElementChild.remove();
        }
    }

    //Событие, клик по строке, создает таблицу с одним пользователем и показывает её
    clickOnRow(event){

        let regularString = /\d+$/;
        let id = event.currentTarget.id;

        id = regularString.exec(id);

        if(id){

            let user = this.searchUser(id);
            let panel = new PanelUser(user, this);

            this.user = panel;
            this.showUser();

            history.pushState({user:true}, '', '');

            window.addEventListener("popstate", this.backHistory, false);
            window.addEventListener("keydown", this.keyBackspace, false);
        }
    }

    //Событие, клик на заголовок столбца, сортирует строки.
    clickOnHeadOfColumn(event){

        let columnId = event.currentTarget.id;

        let regular = /Column-(\w+)/;
        let nameColumn = columnId.match(regular)[1];

        if(this.sort.key !== nameColumn){

            this.sort.key = nameColumn;
            this.users.sort(this.sortArrayByKey);

        }else {

            this.users.reverse();
        }

        this.updateRows();
    }

    //Поиск пользователя по id
    searchUser(id){

        for(let key in this.users){

            let user = this.users[key];

            if(user.id == id){
                return user;
            }
        }

        console.log("Пользователь не найден");

        return false;
    }

    //Показывает пользователя
    showUser(){

        if(this.user.getPanel()){

            this.table.remove();
            this.parentElement.appendChild(this.user.getPanel());
        }
    }

    //Показывает таблицу
    showTable(){

        if(this.table){

            this.parentElement.appendChild(this.table);
        }
    }

    //Обновляет строки (после сортировки)
    updateRows(){

        this.rows.remove();
        this.createRowAll();
        this.table.appendChild(this.rows);
    }

    //Функция для сортировки массива
    sortArrayByKey(a,b){

        let key = this.sort['key'];
        if(a[key] > b[key]) return 1;
        return -1;
    }

    //Событие, кнопка назад браузера
    backHistory(event){

        console.log(event.state);
        if(event.state.user === false){

            this.user.clickOnButtonBack();
        }

        if(event.state.user === true){

            this.showUser();
        }
    }

    //Кнопка Backspace
    keyBackspace(event){

        if(event.keyCode === 8){

            this.user.clickOnButtonBack();
        }
    }
}


