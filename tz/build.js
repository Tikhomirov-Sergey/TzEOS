var main =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 11);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


//Класс для подгрузки данных(страны, города, таблица).
class JsonP {


    constructor(scrJson, scrCallback, parent, nameStore) {

        this.nameStore = nameStore;
        this.scrJson = scrJson;
        this.scrCallback = scrCallback;
        this.json = null;
        this.script = null;

        this.data = null;
        this.parent = parent;

        if (!window.store) window.store = {};
    }

    request() {
        let error = false;

        this.addCallbackScript();

        //Промис ждет подгрузки callback функции
        let promiseCallbackScript = new Promise((resolve, reject) => {

            this.script.onload = function () {
                resolve();
            };

            this.script.onerror = () => {
                error = true;
                console.log('errorJson', this.nameStore);
            }
        });

        //После подгрузки функции начинается загрузка jsonp файла
        promiseCallbackScript.then(() => {

            this.addJsonScript();
            //Промис ждет загрузки файла
            let promiseJson = new Promise((resolve, reject) => {
                this.json.onload = function () {
                    resolve();

                };

                this.json.onerror = () => {
                    error = true;
                    console.log('errorJson', this.nameStore);
                };
            });

            return promiseJson;
        }).then(() => {
            //Callback функция сохраняет данные в глобальный объект window.store['nameStore']
            //У каждой функции свое свойство в объекте window.store
            this.data = window.store[this.nameStore];
            window.store[this.nameStore] = null;

            this.json.remove();
            this.script.remove();

        });

        //setTimeout отлавливает загрузку данных и передает данные в класс родителя
        let timeOut = setTimeout(() => {
            if (this.data) {

                console.log(this.data);
                this.parent.data = this.data;
            }

            if (error) {
                console.log(`Файл ${this.nameStore}, ошибка 404.`);
                clearTimeout(timeOut);
            }
        }, 1000)
    }


    addJsonScript() {

        this.json = this.addScript(this.scrJson);
    }

    addCallbackScript() {

        this.script = this.addScript(this.scrCallback);
    }

    addScript(src) {
        let script = document.createElement("script");
        script.src = src;
        document.head.appendChild(script);

        return script;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = JsonP;



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";



class NameInput {

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
}
/* harmony export (immutable) */ __webpack_exports__["a"] = NameInput;
;


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


//Класс создания селект бокса
class SelectBox {

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
/* harmony export (immutable) */ __webpack_exports__["a"] = SelectBox;


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__form_NameInput__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__form_EmailInput__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__form_PhoneInput__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__form_SelectBoxCountries__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__form_SelectBoxCities__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__form_ButtonsGroup__ = __webpack_require__(6);










class Form {

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

        let nameInput = new __WEBPACK_IMPORTED_MODULE_0__form_NameInput__["a" /* default */]();
        this.name = nameInput;
        nameInput = nameInput.getInput();

        let emailInput = new __WEBPACK_IMPORTED_MODULE_1__form_EmailInput__["a" /* default */]();
        this.email = emailInput;
        emailInput = emailInput.getInput();

        let phoneInput = new __WEBPACK_IMPORTED_MODULE_2__form_PhoneInput__["a" /* default */]();
        this.phone = phoneInput;
        phoneInput = phoneInput.getInput();

        let selectBoxes = this.createSelectBoxes();

        let buttonsGroup = new __WEBPACK_IMPORTED_MODULE_5__form_ButtonsGroup__["a" /* default */]();
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

        let selectBoxCountries = new __WEBPACK_IMPORTED_MODULE_3__form_SelectBoxCountries__["a" /* default */]();

        let selectBoxCities = new __WEBPACK_IMPORTED_MODULE_4__form_SelectBoxCities__["a" /* default */]();

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
/* harmony export (immutable) */ __webpack_exports__["a"] = Form;




/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__JsonP__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Table_PanelUser__ = __webpack_require__(5);





class Table {

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
            this.data = new __WEBPACK_IMPORTED_MODULE_0__JsonP__["a" /* default */]("/data/Users/users.json", "/js/jsonP/users.js", this, 'users').request();
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
            let panel = new __WEBPACK_IMPORTED_MODULE_1__Table_PanelUser__["a" /* default */](user, this);

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
/* harmony export (immutable) */ __webpack_exports__["a"] = Table;





/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


class PanelUser {

    constructor(user, parent) {

        this.user = user;
        this.parent = parent;

        this.div = null;
        this.button = null;

        this.clickOnButtonBack = this.clickOnButtonBack.bind(this);
    }

    createPanel() {

        if (this.user) {

            let div = this.createMainDiv();
            let heading = this.createHeading();
            let body = this.createBody();

            div.appendChild(heading);
            div.appendChild(body);

            this.div = div;

            return div;
        }
    }

    createMainDiv() {

        let div = document.createElement('div');
        div.className = "panel panel-primary";

        return div;
    }

    createHeading() {

        let heading = document.createElement('div');
        heading.className = "panel-heading";

        let button = document.createElement('div');
        button.className = "btn btn-primary";
        button.type = "button";
        button.innerText = "Назад к списку пользователей";
        button.onclick = this.clickOnButtonBack;

        this.button = button;

        heading.appendChild(button);

        return heading;
    }

    createBody() {

        let body = document.createElement('div');
        body.className = "panel-body";

        for (let key in this.user) {

            let row = this.createRow(key, this.user[key]);

            body.appendChild(row);
        }

        return body;
    }


    createRow(nameItem, item) {

        let row = document.createElement('div');
        row.className = "row";

        nameItem = this.createDivItem(nameItem);
        item = this.createDivItem(item);

        row.appendChild(nameItem);
        row.appendChild(item);

        return row;
    }

    createDivItem(text) {

        let div = document.createElement('div');
        div.className = "col-lg-6 col-md-6 col-sm-6 col-xs-6";
        div.innerText = text;

        return div;
    }

    clickOnButtonBack(event) {
        if (event) event.preventDefault();


        this.parent.showTable();
        this.div.remove();

        history.pushState({user: false}, '', '');
        window.removeEventListener("keydown", this.parent.keyBackspace, false);
    }

    getPanel() {

        if (!this.div) this.createPanel();
        return this.div;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = PanelUser;


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


//Группа кнопок
class ButtonsGroup {

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
/* harmony export (immutable) */ __webpack_exports__["a"] = ButtonsGroup;


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__NameInput__ = __webpack_require__(1);


'use strict';

//Наследуется от NameInput, там комментарии
class EmailInput extends __WEBPACK_IMPORTED_MODULE_0__NameInput__["a" /* default */] {

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
/* harmony export (immutable) */ __webpack_exports__["a"] = EmailInput;


/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__NameInput__ = __webpack_require__(1);


'use strict';

//Наследуется от NameInput, там комментарии
class PhoneInput extends __WEBPACK_IMPORTED_MODULE_0__NameInput__["a" /* default */] {

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
/* harmony export (immutable) */ __webpack_exports__["a"] = PhoneInput;


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__SelectBox__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__JsonP__ = __webpack_require__(0);



'use strict';

//Селект бокс города
class SelectBoxCities {
    constructor() {

        this.selectBoxCountries = null;

        this.data = null;
        this.idCountry = "1";
        this.listCities = null;

        this.promiseJsonP();

        this.selectBox = null;
    }

    createSelectBox() {
        let selectBox = new __WEBPACK_IMPORTED_MODULE_0__SelectBox__["a" /* default */]("Город", "cities", this.listCities);
        this.selectBox = selectBox;
    }

    getSelectBox() {
        if (!this.selectBox) this.createSelectBox();
        return this.selectBox.getSelectBox();
    }

    //Промис ждет загрузки данных
    //После загрузки обновляет селект бокс
    //Вызывается при создании экземпляра и когда меняется id страны (если страна не была загружена ранее)
    promiseJsonP() {

        let promise = new Promise((resolve, reject) => {
            this.data = new __WEBPACK_IMPORTED_MODULE_1__JsonP__["a" /* default */](`/data/Countries/${this.idCountry}.json`, "/js/jsonP/cities.js", this, 'cities').request();
            setTimeout(() => {
                if (this.data) {

                    this.listCities = this.data;
                    this.selectBoxCountries.saveCities(this.idCountry, this.listCities || null);

                    resolve();
                }
            }, 1000);
        });

        promise.then(() => {
                if (this.selectBox) {
                    this.selectBox.updateList(this.listCities);
                }
            }
        );
    }

    //Связь с селект боксом страны
    setSelectBoxCountries(selectBox) {

        this.selectBoxCountries = selectBox;
    }

    //Замена idCountry, если есть аргумент cities, то промис не вызывается
    changeIdCountry(idCountry, cities) {

        if (this.idCountry != idCountry) {

            this.idCountry = idCountry;

            if (cities) {

                this.selectBox.updateList(cities);
            }
            else {
                this.selectBox.clearList();
                this.promiseJsonP();
            }
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = SelectBoxCities;






/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__SelectBox__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__JsonP__ = __webpack_require__(0);



'use strict';

//Селект бокс страны
class SelectBoxCountries {
    constructor() {

        this.selectBoxCities = null;

        this.data = null;
        this.listCountries = null;
        this.countries = [];

        this.promiseJsonP();

        this.selectBox = null;

        this.onChange = this.onChange.bind(this);
    }

    //Промис ждет загрузки данных
    //После загрузки обновляет селект бокс
    promiseJsonP() {

        let promise = new Promise((resolve, reject) => {
            this.data = new __WEBPACK_IMPORTED_MODULE_1__JsonP__["a" /* default */]("/data/countries/Countries.json", "/js/jsonP/countries.js", this, 'countries').request();
            setTimeout(() => {
                if (this.data) {

                    this.listCountries = this.data;
                    resolve();
                }
            }, 1000);
        });

        promise.then(() => {
                if (this.selectBox) {
                    this.selectBox.updateList(this.listCountries);
                }
            }
        );
    }

    createSelectBox() {
        let selectBox = new __WEBPACK_IMPORTED_MODULE_0__SelectBox__["a" /* default */]("Страна", "countries", this.listCountries, this.onChange);
        this.selectBox = selectBox;
    }

    getSelectBox() {
        if (!this.selectBox) this.createSelectBox();
        return this.selectBox.getSelectBox();
    }

    //Связь с селект боксом города
    setSelectBoxCities(selectBoxCities) {

        this.selectBoxCities = selectBoxCities;

        selectBoxCities.setSelectBoxCountries(this);
    }

    //Сохранение объекта с городами
    saveCities(idCountry, listCities) {

        let country = this.searchCountryOnId(idCountry);

        if (!country) {
            country = {
                id: idCountry,
                cities: listCities
            };

            this.countries.push(country);
        }
    }

    //Событие, при смене выбранного индекса
    onChange(event) {

        let selectBox = event.currentTarget;
        let selectedIndex = selectBox.selectedIndex;

        let idCountry = selectBox.options[selectedIndex].value;

        let country = this.searchCountryOnId(idCountry);

        //Если города выбранной страны загруженны ранее, то они передаются в селект бокс, и загрузка городов не происходит (country.cities)
        this.selectBoxCities.changeIdCountry(idCountry, country.cities);
    }

    searchCountryOnId(id) {

        if (this.countries) {

            for (let key in this.countries) {

                let country = this.countries[key];
                if (country.id === id) {

                    return country;
                }
            }
        }

        return false;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = SelectBoxCountries;





/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__js_createFormAndTable__ = __webpack_require__(12);





//Находим кнопку по id, вешаем на нее обработчик события
let button = document.getElementById('create-form-and-table');
button.onclick = __WEBPACK_IMPORTED_MODULE_0__js_createFormAndTable__["a" /* default */];





/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = createFormAndTable;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Form__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Table__ = __webpack_require__(4);





//Функция удаляет кнопки, создает форму и таблицу.
//Метод createElement() создает элемент и помещает его в dom модель
function createFormAndTable(event) {

    event.currentTarget.remove();

    let divForm = document.getElementById('form');
    let form = new __WEBPACK_IMPORTED_MODULE_0__Form__["a" /* default */](divForm);
    form.createElement();

    let divTable = document.getElementById('table');
    let table = new __WEBPACK_IMPORTED_MODULE_1__Table__["a" /* default */](divTable);
    table.createTable();

    form.setTable(table);
}

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZDg4NTlmYzQ4ZDg1MmYxZTA2NjAiLCJ3ZWJwYWNrOi8vLy4vanMvSnNvblAuanMiLCJ3ZWJwYWNrOi8vLy4vanMvZm9ybS9OYW1lSW5wdXQuanMiLCJ3ZWJwYWNrOi8vLy4vanMvZm9ybS9TZWxlY3RCb3guanMiLCJ3ZWJwYWNrOi8vLy4vanMvRm9ybS5qcyIsIndlYnBhY2s6Ly8vLi9qcy9UYWJsZS5qcyIsIndlYnBhY2s6Ly8vLi9qcy9UYWJsZS9QYW5lbFVzZXIuanMiLCJ3ZWJwYWNrOi8vLy4vanMvZm9ybS9CdXR0b25zR3JvdXAuanMiLCJ3ZWJwYWNrOi8vLy4vanMvZm9ybS9FbWFpbElucHV0LmpzIiwid2VicGFjazovLy8uL2pzL2Zvcm0vUGhvbmVJbnB1dC5qcyIsIndlYnBhY2s6Ly8vLi9qcy9mb3JtL1NlbGVjdEJveENpdGllcy5qcyIsIndlYnBhY2s6Ly8vLi9qcy9mb3JtL1NlbGVjdEJveENvdW50cmllcy5qcyIsIndlYnBhY2s6Ly8vLi9tYWluLmpzIiwid2VicGFjazovLy8uL2pzL2NyZWF0ZUZvcm1BbmRUYWJsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxtREFBMkMsY0FBYzs7QUFFekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7OztBQ2hFQTs7QUFFQTtBQUNBOzs7QUFHQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhOztBQUViO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0Esb0NBQW9DLGVBQWU7QUFDbkQ7QUFDQTtBQUNBLFNBQVM7QUFDVDs7O0FBR0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7Ozs7Ozs7O0FDcEdBOzs7QUFHQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQUE7QUFBQTs7Ozs7Ozs7QUNwSEE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsQzs7Ozs7Ozs7Ozs7Ozs7O0FDcEZBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7OztBQUdBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFBQTtBQUFBOzs7Ozs7Ozs7OztBQ3RLQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLDhCQUE4QixXQUFXO0FBQ3pDOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSw4QkFBOEIsTUFBTTtBQUNwQztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTs7QUFFYjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxzQkFBc0IsV0FBVztBQUNqQztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBLCtCQUErQixVQUFVOztBQUV6QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQSxTQUFTOztBQUVUO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBOzs7Ozs7Ozs7O0FDblRBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7OztBQUdBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQSwyQkFBMkIsWUFBWTtBQUN2QztBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEM7Ozs7Ozs7OztBQ2pIQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEM7Ozs7Ozs7Ozs7QUMzRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEM7Ozs7Ozs7Ozs7QUNyQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxrREFBa0QsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRTs7QUFFM0U7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEM7Ozs7Ozs7Ozs7O0FDdkNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsdUdBQXFELGVBQWU7QUFDcEU7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBOzs7Ozs7Ozs7Ozs7O0FDL0VBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQUE7QUFBQTs7Ozs7Ozs7Ozs7O0FDNUdBOzs7QUFHQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FDUEE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEMiLCJmaWxlIjoiYnVpbGQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBpZGVudGl0eSBmdW5jdGlvbiBmb3IgY2FsbGluZyBoYXJtb255IGltcG9ydHMgd2l0aCB0aGUgY29ycmVjdCBjb250ZXh0XG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmkgPSBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWU7IH07XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDExKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBkODg1OWZjNDhkODUyZjFlMDY2MCIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8v0JrQu9Cw0YHRgSDQtNC70Y8g0L/QvtC00LPRgNGD0LfQutC4INC00LDQvdC90YvRhSjRgdGC0YDQsNC90YssINCz0L7RgNC+0LTQsCwg0YLQsNCx0LvQuNGG0LApLlxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBKc29uUCB7XHJcblxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHNjckpzb24sIHNjckNhbGxiYWNrLCBwYXJlbnQsIG5hbWVTdG9yZSkge1xyXG5cclxuICAgICAgICB0aGlzLm5hbWVTdG9yZSA9IG5hbWVTdG9yZTtcclxuICAgICAgICB0aGlzLnNjckpzb24gPSBzY3JKc29uO1xyXG4gICAgICAgIHRoaXMuc2NyQ2FsbGJhY2sgPSBzY3JDYWxsYmFjaztcclxuICAgICAgICB0aGlzLmpzb24gPSBudWxsO1xyXG4gICAgICAgIHRoaXMuc2NyaXB0ID0gbnVsbDtcclxuXHJcbiAgICAgICAgdGhpcy5kYXRhID0gbnVsbDtcclxuICAgICAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcclxuXHJcbiAgICAgICAgaWYgKCF3aW5kb3cuc3RvcmUpIHdpbmRvdy5zdG9yZSA9IHt9O1xyXG4gICAgfVxyXG5cclxuICAgIHJlcXVlc3QoKSB7XHJcbiAgICAgICAgbGV0IGVycm9yID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHRoaXMuYWRkQ2FsbGJhY2tTY3JpcHQoKTtcclxuXHJcbiAgICAgICAgLy/Qn9GA0L7QvNC40YEg0LbQtNC10YIg0L/QvtC00LPRgNGD0LfQutC4IGNhbGxiYWNrINGE0YPQvdC60YbQuNC4XHJcbiAgICAgICAgbGV0IHByb21pc2VDYWxsYmFja1NjcmlwdCA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc2NyaXB0Lm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc2NyaXB0Lm9uZXJyb3IgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBlcnJvciA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZXJyb3JKc29uJywgdGhpcy5uYW1lU3RvcmUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8v0J/QvtGB0LvQtSDQv9C+0LTQs9GA0YPQt9C60Lgg0YTRg9C90LrRhtC40Lgg0L3QsNGH0LjQvdCw0LXRgtGB0Y8g0LfQsNCz0YDRg9C30LrQsCBqc29ucCDRhNCw0LnQu9CwXHJcbiAgICAgICAgcHJvbWlzZUNhbGxiYWNrU2NyaXB0LnRoZW4oKCkgPT4ge1xyXG5cclxuICAgICAgICAgICAgdGhpcy5hZGRKc29uU2NyaXB0KCk7XHJcbiAgICAgICAgICAgIC8v0J/RgNC+0LzQuNGBINC20LTQtdGCINC30LDQs9GA0YPQt9C60Lgg0YTQsNC50LvQsFxyXG4gICAgICAgICAgICBsZXQgcHJvbWlzZUpzb24gPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmpzb24ub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuanNvbi5vbmVycm9yID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGVycm9yID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZXJyb3JKc29uJywgdGhpcy5uYW1lU3RvcmUpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZUpzb247XHJcbiAgICAgICAgfSkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgIC8vQ2FsbGJhY2sg0YTRg9C90LrRhtC40Y8g0YHQvtGF0YDQsNC90Y/QtdGCINC00LDQvdC90YvQtSDQsiDQs9C70L7QsdCw0LvRjNC90YvQuSDQvtCx0YrQtdC60YIgd2luZG93LnN0b3JlWyduYW1lU3RvcmUnXVxyXG4gICAgICAgICAgICAvL9CjINC60LDQttC00L7QuSDRhNGD0L3QutGG0LjQuCDRgdCy0L7QtSDRgdCy0L7QudGB0YLQstC+INCyINC+0LHRitC10LrRgtC1IHdpbmRvdy5zdG9yZVxyXG4gICAgICAgICAgICB0aGlzLmRhdGEgPSB3aW5kb3cuc3RvcmVbdGhpcy5uYW1lU3RvcmVdO1xyXG4gICAgICAgICAgICB3aW5kb3cuc3RvcmVbdGhpcy5uYW1lU3RvcmVdID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuanNvbi5yZW1vdmUoKTtcclxuICAgICAgICAgICAgdGhpcy5zY3JpcHQucmVtb3ZlKCk7XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvL3NldFRpbWVvdXQg0L7RgtC70LDQstC70LjQstCw0LXRgiDQt9Cw0LPRgNGD0LfQutGDINC00LDQvdC90YvRhSDQuCDQv9C10YDQtdC00LDQtdGCINC00LDQvdC90YvQtSDQsiDQutC70LDRgdGBINGA0L7QtNC40YLQtdC70Y9cclxuICAgICAgICBsZXQgdGltZU91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5kYXRhKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucGFyZW50LmRhdGEgPSB0aGlzLmRhdGE7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYNCk0LDQudC7ICR7dGhpcy5uYW1lU3RvcmV9LCDQvtGI0LjQsdC60LAgNDA0LmApO1xyXG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVPdXQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwgMTAwMClcclxuICAgIH1cclxuXHJcblxyXG4gICAgYWRkSnNvblNjcmlwdCgpIHtcclxuXHJcbiAgICAgICAgdGhpcy5qc29uID0gdGhpcy5hZGRTY3JpcHQodGhpcy5zY3JKc29uKTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRDYWxsYmFja1NjcmlwdCgpIHtcclxuXHJcbiAgICAgICAgdGhpcy5zY3JpcHQgPSB0aGlzLmFkZFNjcmlwdCh0aGlzLnNjckNhbGxiYWNrKTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRTY3JpcHQoc3JjKSB7XHJcbiAgICAgICAgbGV0IHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XHJcbiAgICAgICAgc2NyaXB0LnNyYyA9IHNyYztcclxuICAgICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHNjcmlwdCk7XHJcblxyXG4gICAgICAgIHJldHVybiBzY3JpcHQ7XHJcbiAgICB9XHJcbn1cclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9qcy9Kc29uUC5qc1xuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTmFtZUlucHV0IHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmRpdiA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5pbnB1dCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5lcnJvciA9IG51bGw7XHJcblxyXG4gICAgICAgIC8v0KLQtdC60YHRgiDQvtGI0LjQsdC60LhcclxuICAgICAgICB0aGlzLmVycm9yVGV4dCA9IFwi0JjQvNGPINC80L7QttC10YIg0YHQvtC00LXRgNC20LDRgtGMINGC0L7Qu9GM0LrQviDRgdC40LzQstC+0LvRiyDQutC40YDQuNC70LvQuNGG0YsuINCf0YDQuNC80LXRgDog0KHQtdGA0LPQtdC5XCI7XHJcblxyXG4gICAgICAgIC8v0KDQtdCz0YPQu9GP0YDQvdC+0LUg0LLRi9GA0LDQttC10L3QuNC1INC00LvRjyDQv9GA0L7QstC10YDQutC4INGB0YLRgNC+0LrQuCwg0L/RgNC4INC60LvQuNC60LUg0L3QsCDQutC90L7Qv9C60YMg0JTQvtCx0LDQstC40YLRjFxyXG4gICAgICAgIHRoaXMucmVndWxhclN0cmluZ1ZhbGlkYXRlID0gL15b0JAt0K/QsC3Rj11b0LAt0Y9dKyQvO1xyXG5cclxuICAgICAgICAvL9Cg0LXQs9GD0LvRj9GA0L3QvtC1INCy0YvRgNCw0LbQtdC90LjQtSDQtNC70Y8g0L/RgNC+0LLQtdGA0LrQuCDRgdC40LzQstC+0LvQsCAo0YHQvtCx0YvRgtC40LUga2V5ZG93bilcclxuICAgICAgICB0aGlzLnJlZ3VsYXJTdHJpbmdLZXlkb3duID0gL15b0JAt0K/QsC3Rj10kLztcclxuXHJcbiAgICAgICAgdGhpcy5rZXlkb3duT25JbnB1dCA9IHRoaXMua2V5ZG93bk9uSW5wdXQuYmluZCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVFbGVtZW50KCkge1xyXG4gICAgICAgIGxldCBkaXYgPSB0aGlzLmNyZWF0ZU1haW5EaXYoKTtcclxuICAgICAgICBsZXQgbGFiZWwgPSB0aGlzLmNyZWF0ZUxhYmVsKCk7XHJcbiAgICAgICAgbGV0IGlucHV0ID0gdGhpcy5jcmVhdGVJbnB1dCgpO1xyXG4gICAgICAgIGxldCBlcnJvciA9IHRoaXMuY3JlYXRlRXJyb3IoKTtcclxuXHJcbiAgICAgICAgdGhpcy5pbnB1dCA9IGlucHV0O1xyXG4gICAgICAgIHRoaXMuZXJyb3IgPSBlcnJvcjtcclxuXHJcbiAgICAgICAgdGhpcy5pbnB1dC5vbmtleWRvd24gPSB0aGlzLmtleWRvd25PbklucHV0O1xyXG5cclxuICAgICAgICBkaXYuYXBwZW5kQ2hpbGQobGFiZWwpO1xyXG4gICAgICAgIGRpdi5hcHBlbmRDaGlsZChpbnB1dCk7XHJcbiAgICAgICAgZGl2LmFwcGVuZENoaWxkKGVycm9yKTtcclxuXHJcbiAgICAgICAgdGhpcy5kaXYgPSBkaXY7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlTWFpbkRpdigpIHtcclxuICAgICAgICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgZGl2LmNsYXNzTmFtZSA9IFwiZm9ybS1ncm91cFwiO1xyXG5cclxuICAgICAgICByZXR1cm4gZGl2O1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZUxhYmVsKCkge1xyXG4gICAgICAgIGxldCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XHJcbiAgICAgICAgbGFiZWwuY2xhc3NOYW1lID0gXCJjb250cm9sLWxhYmVsXCI7XHJcbiAgICAgICAgbGFiZWwuaW5uZXJUZXh0ID0gXCLQmNC80Y9cIjtcclxuXHJcbiAgICAgICAgcmV0dXJuIGxhYmVsO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZUlucHV0KCkge1xyXG4gICAgICAgIGxldCBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XHJcbiAgICAgICAgaW5wdXQuY2xhc3NOYW1lID0gXCJmb3JtLWNvbnRyb2xcIjtcclxuICAgICAgICBpbnB1dC50eXBlID0gXCJ0ZXh0XCI7XHJcbiAgICAgICAgaW5wdXQucGxhY2Vob2xkZXIgPSBcItCS0LDRiNC1INCY0LzRj1wiO1xyXG4gICAgICAgIGlucHV0Lm5hbWUgPSBcIm5hbWVcIjtcclxuXHJcbiAgICAgICAgcmV0dXJuIGlucHV0O1xyXG4gICAgfVxyXG5cclxuICAgIGdldElucHV0KCkge1xyXG4gICAgICAgIGlmICghdGhpcy5kaXYpIHRoaXMuY3JlYXRlRWxlbWVudCgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRpdjtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVFcnJvcigpIHtcclxuICAgICAgICBsZXQgZXJyb3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XHJcbiAgICAgICAgZXJyb3IuY2xhc3NOYW1lID0gXCJ0ZXh0LWVycm9yXCI7XHJcbiAgICAgICAgZXJyb3IuaW5uZXJUZXh0ID0gdGhpcy5lcnJvclRleHQ7XHJcbiAgICAgICAgZXJyb3Iuc3R5bGUuY29sb3IgPSBcIiNGRjAwMDBcIjtcclxuICAgICAgICBlcnJvci5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcblxyXG4gICAgICAgIHJldHVybiBlcnJvcjtcclxuICAgIH1cclxuXHJcbiAgICAvL9Cf0YDQvtCy0LXRgNC60LAg0YHRgtGA0L7QutC4XHJcbiAgICB2YWxpZGF0ZSgpIHtcclxuXHJcbiAgICAgICAgbGV0IHN0cmluZyA9IHRoaXMuaW5wdXQudmFsdWU7XHJcbiAgICAgICAgc3RyaW5nID0gc3RyaW5nLnRyaW0oKTtcclxuXHJcbiAgICAgICAgaWYgKHN0cmluZyAmJiB0aGlzLnJlZ3VsYXJTdHJpbmdWYWxpZGF0ZS50ZXN0KHN0cmluZykpIHtcclxuICAgICAgICAgICAgdGhpcy5lcnJvci5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgICAgIHRoaXMuaW5wdXQuc3R5bGUuYm9yZGVyQ29sb3IgPSBcIiNjY2NjY2NcIjtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvL9CV0YHQu9C4INGB0YLRgNC+0LrQsCDQvdC1INC/0YDQvtGI0LvQsCDQv9GA0L7QstC10YDQutGDLCDRgtC+INC/0L7QutCw0LfRi9Cy0LDQtdC8INC+0YjQuNCx0LrRg1xyXG4gICAgICAgICAgICB0aGlzLmVycm9yLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgICAgICAgICAgIHRoaXMuaW5wdXQuc3R5bGUuYm9yZGVyQ29sb3IgPSBcIiNGRjAwMDBcIjtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8v0J7QsdGA0LDQsdC+0YLRh9C40Log0YHQvtCx0YvRgtC40Y8ga2V5ZG93blxyXG4gICAga2V5ZG93bk9uSW5wdXQoZXZlbnQpIHtcclxuXHJcbiAgICAgICAgbGV0IGtleSA9IGV2ZW50LmtleTtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLnJlZ3VsYXJTdHJpbmdLZXlkb3duIHx8IGV2ZW50LmtleUNvZGUgPCAzMikgcmV0dXJuIHRydWU7XHJcblxyXG4gICAgICAgIGlmIChrZXkgJiYgdGhpcy5yZWd1bGFyU3RyaW5nS2V5ZG93bikge1xyXG4gICAgICAgICAgICAvL9Cf0YDQvtCy0LXRgNC60LAsINGB0L7QvtGC0LLQtdGC0YHRj9Cy0YPQtdGCINC70Lgg0YHQuNC80LLQvtC7INGA0LXQs9GD0LvRj9GA0L3QvtC80YMg0LLRi9GA0LDQttC10L3QuNGOXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlZ3VsYXJTdHJpbmdLZXlkb3duLnRlc3Qoa2V5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxufTtcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9qcy9mb3JtL05hbWVJbnB1dC5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XHJcblxyXG4vL9Ca0LvQsNGB0YEg0YHQvtC30LTQsNC90LjRjyDRgdC10LvQtdC60YIg0LHQvtC60YHQsFxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZWxlY3RCb3gge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG5hbWUsIG5hbWVBdHRyaWJ1dGUsIGFycmF5LCBvbkNoYW5nZSkge1xyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICAgICAgdGhpcy5uYW1lQXR0cmlidXRlID0gbmFtZUF0dHJpYnV0ZTtcclxuICAgICAgICB0aGlzLmFycmF5ID0gYXJyYXk7XHJcblxyXG4gICAgICAgIGlmIChvbkNoYW5nZSkgdGhpcy5vbkNoYW5nZSA9IG9uQ2hhbmdlO1xyXG5cclxuICAgICAgICB0aGlzLmRpdiA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlRWxlbWVudCgpIHtcclxuICAgICAgICBsZXQgZGl2ID0gdGhpcy5jcmVhdGVNYWluRGl2KCk7XHJcbiAgICAgICAgbGV0IGxhYmVsID0gdGhpcy5jcmVhdGVMYWJlbCgpO1xyXG4gICAgICAgIGxldCBzZWxlY3QgPSB0aGlzLmNyZWF0ZVNlbGVjdCgpO1xyXG5cclxuICAgICAgICBkaXYuYXBwZW5kQ2hpbGQobGFiZWwpO1xyXG4gICAgICAgIGRpdi5hcHBlbmRDaGlsZChzZWxlY3QpO1xyXG5cclxuICAgICAgICB0aGlzLmRpdiA9IGRpdjtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVNYWluRGl2KCkge1xyXG4gICAgICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBkaXYuY2xhc3NOYW1lID0gXCJmb3JtLWdyb3VwIGNvbC1sZy02IGNvbC1tZC02IGNvbC1zbS00XCI7XHJcblxyXG4gICAgICAgIHJldHVybiBkaXY7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlTGFiZWwoKSB7XHJcbiAgICAgICAgbGV0IGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcclxuICAgICAgICBsYWJlbC5jbGFzc05hbWUgPSBcImNvbnRyb2wtbGFiZWxcIjtcclxuICAgICAgICBsYWJlbC5pbm5lclRleHQgPSB0aGlzLm5hbWU7XHJcblxyXG4gICAgICAgIHJldHVybiBsYWJlbDtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVTZWxlY3QoKSB7XHJcbiAgICAgICAgbGV0IHNlbGVjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NlbGVjdCcpO1xyXG4gICAgICAgIHNlbGVjdC5jbGFzc05hbWUgPSBcInNlbGVjdHBpY2tlciBpbnB1dC1zbVwiO1xyXG4gICAgICAgIHNlbGVjdC5uYW1lID0gdGhpcy5uYW1lQXR0cmlidXRlO1xyXG4gICAgICAgIGZvciAobGV0IGVsZW1lbnQgaW4gdGhpcy5hcnJheSkge1xyXG4gICAgICAgICAgICBsZXQgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XHJcbiAgICAgICAgICAgIG9wdGlvbi5pbm5lclRleHQgPSB0aGlzLmFycmF5W2VsZW1lbnRdO1xyXG4gICAgICAgICAgICBvcHRpb24udmFsdWUgPSBlbGVtZW50O1xyXG5cclxuICAgICAgICAgICAgc2VsZWN0LmFwcGVuZENoaWxkKG9wdGlvbik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5vbkNoYW5nZSkgc2VsZWN0Lm9uY2hhbmdlID0gdGhpcy5vbkNoYW5nZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNlbGVjdDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRTZWxlY3RCb3goKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmRpdikgdGhpcy5jcmVhdGVFbGVtZW50KCk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmRpdjtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVMaXN0KGFycmF5KSB7XHJcblxyXG4gICAgICAgIGlmIChhcnJheSkge1xyXG4gICAgICAgICAgICB0aGlzLmFycmF5ID0gYXJyYXk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmRpdi5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2VsZWN0JylbMF0ucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIGxldCBzZWxlY3QgPSB0aGlzLmNyZWF0ZVNlbGVjdCgpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5kaXYuYXBwZW5kQ2hpbGQoc2VsZWN0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY2xlYXJMaXN0KCkge1xyXG4gICAgICAgIHRoaXMuYXJyYXkgPSBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLmRpdi5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2VsZWN0JylbMF0ucmVtb3ZlKCk7XHJcbiAgICAgICAgbGV0IHNlbGVjdCA9IHRoaXMuY3JlYXRlU2VsZWN0KCk7XHJcblxyXG4gICAgICAgIHRoaXMuZGl2LmFwcGVuZENoaWxkKHNlbGVjdCk7XHJcbiAgICB9XHJcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2pzL2Zvcm0vU2VsZWN0Qm94LmpzXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmltcG9ydCBOYW1lSW5wdXQgZnJvbSBcIi4vZm9ybS9OYW1lSW5wdXRcIjtcclxuaW1wb3J0IEVtYWlsSW5wdXQgZnJvbSBcIi4vZm9ybS9FbWFpbElucHV0XCI7XHJcbmltcG9ydCBQaG9uZUlucHV0IGZyb20gXCIuL2Zvcm0vUGhvbmVJbnB1dFwiO1xyXG5pbXBvcnQgU2VsZWN0Qm94Q291bnRyaWVzIGZyb20gXCIuL2Zvcm0vU2VsZWN0Qm94Q291bnRyaWVzXCI7XHJcbmltcG9ydCBTZWxlY3RCb3hDaXRpZXMgZnJvbSBcIi4vZm9ybS9TZWxlY3RCb3hDaXRpZXNcIjtcclxuaW1wb3J0IEJ1dHRvbnNHcm91cCBmcm9tIFwiLi9mb3JtL0J1dHRvbnNHcm91cFwiO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZvcm0ge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBhcmVudEVsZW1lbnQsIHRhYmxlKSB7XHJcblxyXG4gICAgICAgIHRoaXMucGFyZW50RWxlbWVudCA9IHBhcmVudEVsZW1lbnQ7XHJcblxyXG4gICAgICAgIHRoaXMuZGl2ID0gbnVsbDtcclxuICAgICAgICB0aGlzLmZvcm0gPSBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLnRhYmxlID0gdGFibGU7XHJcblxyXG4gICAgICAgIHRoaXMubmFtZSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5lbWFpbCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5waG9uZSA9IG51bGw7XHJcblxyXG4gICAgICAgIHRoaXMuYnV0dG9uc0dyb3VwID0gbnVsbDtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuY2xpY2tPbkJ1dHRvbkFkZCA9IHRoaXMuY2xpY2tPbkJ1dHRvbkFkZC5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZUVsZW1lbnQoKSB7XHJcblxyXG4gICAgICAgIGxldCBkaXYgPSB0aGlzLmNyZWF0ZU1haW5EaXYoKTtcclxuXHJcbiAgICAgICAgbGV0IGZvcm0gPSB0aGlzLmNyZWF0ZUZvcm0oKTtcclxuICAgICAgICB0aGlzLmZvcm0gPSBmb3JtO1xyXG5cclxuICAgICAgICBsZXQgbmFtZUlucHV0ID0gbmV3IE5hbWVJbnB1dCgpO1xyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWVJbnB1dDtcclxuICAgICAgICBuYW1lSW5wdXQgPSBuYW1lSW5wdXQuZ2V0SW5wdXQoKTtcclxuXHJcbiAgICAgICAgbGV0IGVtYWlsSW5wdXQgPSBuZXcgRW1haWxJbnB1dCgpO1xyXG4gICAgICAgIHRoaXMuZW1haWwgPSBlbWFpbElucHV0O1xyXG4gICAgICAgIGVtYWlsSW5wdXQgPSBlbWFpbElucHV0LmdldElucHV0KCk7XHJcblxyXG4gICAgICAgIGxldCBwaG9uZUlucHV0ID0gbmV3IFBob25lSW5wdXQoKTtcclxuICAgICAgICB0aGlzLnBob25lID0gcGhvbmVJbnB1dDtcclxuICAgICAgICBwaG9uZUlucHV0ID0gcGhvbmVJbnB1dC5nZXRJbnB1dCgpO1xyXG5cclxuICAgICAgICBsZXQgc2VsZWN0Qm94ZXMgPSB0aGlzLmNyZWF0ZVNlbGVjdEJveGVzKCk7XHJcblxyXG4gICAgICAgIGxldCBidXR0b25zR3JvdXAgPSBuZXcgQnV0dG9uc0dyb3VwKCk7XHJcbiAgICAgICAgdGhpcy5idXR0b25zR3JvdXAgPSBidXR0b25zR3JvdXA7XHJcbiAgICAgICAgYnV0dG9uc0dyb3VwID0gYnV0dG9uc0dyb3VwLmdldEVsZW1lbnQoKTtcclxuXHJcbiAgICAgICAgZm9ybS5hcHBlbmRDaGlsZChuYW1lSW5wdXQpO1xyXG4gICAgICAgIGZvcm0uYXBwZW5kQ2hpbGQoZW1haWxJbnB1dCk7XHJcbiAgICAgICAgZm9ybS5hcHBlbmRDaGlsZChwaG9uZUlucHV0KTtcclxuICAgICAgICBmb3JtLmFwcGVuZENoaWxkKHNlbGVjdEJveGVzKTtcclxuICAgICAgICBmb3JtLmFwcGVuZENoaWxkKGJ1dHRvbnNHcm91cCk7XHJcblxyXG4gICAgICAgIGRpdi5hcHBlbmRDaGlsZChmb3JtKTtcclxuXHJcbiAgICAgICAgdGhpcy5kaXYgPSBkaXY7XHJcblxyXG4gICAgICAgIHRoaXMucmVtb3ZlRm9ybSgpO1xyXG4gICAgICAgIHRoaXMucGFyZW50RWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmRpdik7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlTWFpbkRpdigpIHtcclxuICAgICAgICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgZGl2LmNsYXNzTmFtZSA9IFwiY29udGFpbmVyXCI7XHJcblxyXG4gICAgICAgIHJldHVybiBkaXY7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlRm9ybSgpIHtcclxuICAgICAgICBsZXQgZm9ybSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Zvcm0nKTtcclxuICAgICAgICBmb3JtLmNsYXNzTmFtZSA9IFwiZm9ybS1ob3Jpem9udGFsIGNvbC1sZy04XCI7XHJcbiAgICAgICAgZm9ybS5yb2xlID0gXCJmb3JtXCI7XHJcblxyXG4gICAgICAgIHJldHVybiBmb3JtO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZVNlbGVjdEJveGVzKCkge1xyXG4gICAgICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBkaXYuY2xhc3NOYW1lID0gXCJyb3dcIjtcclxuXHJcbiAgICAgICAgbGV0IHNlbGVjdEJveENvdW50cmllcyA9IG5ldyBTZWxlY3RCb3hDb3VudHJpZXMoKTtcclxuXHJcbiAgICAgICAgbGV0IHNlbGVjdEJveENpdGllcyA9IG5ldyBTZWxlY3RCb3hDaXRpZXMoKTtcclxuXHJcbiAgICAgICAgc2VsZWN0Qm94Q291bnRyaWVzLnNldFNlbGVjdEJveENpdGllcyhzZWxlY3RCb3hDaXRpZXMpO1xyXG5cclxuICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoc2VsZWN0Qm94Q291bnRyaWVzLmdldFNlbGVjdEJveCgpKTtcclxuICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoc2VsZWN0Qm94Q2l0aWVzLmdldFNlbGVjdEJveCgpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGRpdlxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUVsZW1lbnQoKSB7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVFbGVtZW50KCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGl2O1xyXG4gICAgfVxyXG5cclxuICAgIC8v0JzQtdGC0L7QtCDRgdCy0Y/Qt9GL0LLQsNC10YIg0YTQvtGA0LzRgyDRgSDRgtCw0LHQu9C40YbQtdC5XHJcbiAgICBzZXRUYWJsZSh0YWJsZSkge1xyXG5cclxuICAgICAgICB0aGlzLnRhYmxlID0gdGFibGU7XHJcbiAgICAgICAgdGhpcy5wYXJlbnRFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tuYW1lPVwiYWRkXCJdJykub25jbGljayA9IHRoaXMuY2xpY2tPbkJ1dHRvbkFkZDtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlRm9ybSgpIHtcclxuICAgICAgICBpZiAodGhpcy5wYXJlbnRFbGVtZW50LmZpcnN0RWxlbWVudENoaWxkKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGFyZW50RWxlbWVudC5maXJzdEVsZW1lbnRDaGlsZC5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy/QodC+0LHRi9GC0LjQtSBjbGljayDQvdCwINC60L3QvtC/0LrQtSDQtNC+0LHQsNCy0LvQtdC90LjRj1xyXG4gICAgY2xpY2tPbkJ1dHRvbkFkZChldmVudCkge1xyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnRhYmxlICYmIHRoaXMudmFsaWRhdGUoKSkge1xyXG5cclxuICAgICAgICAgICAgbGV0IG5hbWUgPSB0aGlzLnBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvcignW25hbWU9XCJuYW1lXCJdJykudmFsdWU7XHJcbiAgICAgICAgICAgIGxldCBlbWFpbCA9IHRoaXMucGFyZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yKCdbbmFtZT1cImVtYWlsXCJdJykudmFsdWU7XHJcbiAgICAgICAgICAgIGxldCBwaG9uZSA9IHRoaXMucGFyZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yKCdbbmFtZT1cInBob25lXCJdJykudmFsdWU7XHJcblxyXG4gICAgICAgICAgICBsZXQgY291bnRyeSA9IHRoaXMucGFyZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yKCdbbmFtZT1cImNvdW50cmllc1wiXScpO1xyXG4gICAgICAgICAgICBsZXQgc2VsZWN0ZWRJbmRleCA9IGNvdW50cnkuc2VsZWN0ZWRJbmRleDtcclxuICAgICAgICAgICAgY291bnRyeSA9IGNvdW50cnkub3B0aW9uc1tzZWxlY3RlZEluZGV4XS50ZXh0O1xyXG5cclxuXHJcbiAgICAgICAgICAgIGxldCBjaXR5ID0gdGhpcy5wYXJlbnRFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tuYW1lPVwiY2l0aWVzXCJdJyk7XHJcbiAgICAgICAgICAgIHNlbGVjdGVkSW5kZXggPSBjaXR5LnNlbGVjdGVkSW5kZXg7XHJcbiAgICAgICAgICAgIGNpdHkgPSBjaXR5Lm9wdGlvbnNbc2VsZWN0ZWRJbmRleF0udGV4dDtcclxuXHJcbiAgICAgICAgICAgIGxldCB1c2VyID1cclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpZDogbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBuYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIGVtYWlsOiBlbWFpbCxcclxuICAgICAgICAgICAgICAgICAgICBwaG9uZTogcGhvbmUsXHJcbiAgICAgICAgICAgICAgICAgICAgY291bnRyeTogY291bnRyeSxcclxuICAgICAgICAgICAgICAgICAgICBjaXR5OiBjaXR5XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgdGhpcy50YWJsZS5hZGRSb3codXNlcik7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNHcm91cC5jbGlja1Jlc2V0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8v0JLQsNC70LjQtNCw0YbQuNGPINC40L3Qv9GD0YLQvtCyXHJcbiAgICB2YWxpZGF0ZSgpIHtcclxuXHJcbiAgICAgICAgbGV0IHZhbGlkZSA9IHRydWU7XHJcblxyXG4gICAgICAgIHZhbGlkZSA9IHRoaXMubmFtZS52YWxpZGF0ZSgpICYmIHZhbGlkZTtcclxuICAgICAgICB2YWxpZGUgPSB0aGlzLmVtYWlsLnZhbGlkYXRlKCkgJiYgdmFsaWRlO1xyXG4gICAgICAgIHZhbGlkZSA9IHRoaXMucGhvbmUudmFsaWRhdGUoKSAmJiB2YWxpZGU7XHJcblxyXG4gICAgICAgIHJldHVybiB2YWxpZGU7XHJcbiAgICB9XHJcbn1cclxuXHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vanMvRm9ybS5qc1xuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XHJcblxyXG5pbXBvcnQgSnNvblAgZnJvbSBcIi4vSnNvblBcIjtcclxuaW1wb3J0IFBhbmVsVXNlciBmcm9tIFwiLi9UYWJsZS9QYW5lbFVzZXJcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRhYmxlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwYXJlbnRFbGVtZW50KSB7XHJcblxyXG4gICAgICAgIHRoaXMudXNlcnMgPSBudWxsO1xyXG4gICAgICAgIHRoaXMucGFyZW50RWxlbWVudCA9IHBhcmVudEVsZW1lbnQ7XHJcblxyXG4gICAgICAgIC8v0KLQsNCx0LvQuNGG0LAg0YHQviDQstGB0LXQvNC4INC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRj9C80LhcclxuICAgICAgICB0aGlzLnRhYmxlID0gbnVsbDtcclxuICAgICAgICB0aGlzLnJvd3MgPSBudWxsO1xyXG5cclxuICAgICAgICAvL9Ci0LDQsdC70LjRhtCwINGBINC+0LTQvdC40Lwg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9C10LxcclxuICAgICAgICB0aGlzLnVzZXIgPSBudWxsO1xyXG5cclxuICAgICAgICAvL9Ce0LHRitC10LrRgiDRgSDRgdGC0L7Qu9Cx0YbQsNC80LgsINC60L7RgtC+0YDRi9C1INC90YPQttC90L4g0L7RgtC+0LHRgNCw0LfQuNGC0Ywg0LIg0YLQsNCx0LvQuNGG0LVcclxuICAgICAgICB0aGlzLmhlYWQgPSB7XHJcbiAgICAgICAgICAgIGlkOiBcIuKEllwiLFxyXG4gICAgICAgICAgICBuYW1lOiBcItCY0LzRj1wiLFxyXG4gICAgICAgICAgICBlbWFpbDogXCJFbWFpbFwiXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy/QntCx0YrQtdC60YIg0YEg0LrQu9GO0YfQtdC8INGB0L7RgNGC0LjRgNC+0LLQutC4XHJcbiAgICAgICAgdGhpcy5zb3J0ID0ge1xyXG4gICAgICAgICAgICBrZXk6XCJpZFwiXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5jbGlja09uUm93ID0gdGhpcy5jbGlja09uUm93LmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5jbGlja09uSGVhZE9mQ29sdW1uID0gdGhpcy5jbGlja09uSGVhZE9mQ29sdW1uLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5zb3J0QXJyYXlCeUtleSA9IHRoaXMuc29ydEFycmF5QnlLZXkuYmluZCh0aGlzKTtcclxuXHJcbiAgICAgICAgdGhpcy5iYWNrSGlzdG9yeSA9IHRoaXMuYmFja0hpc3RvcnkuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmtleUJhY2tzcGFjZSA9IHRoaXMua2V5QmFja3NwYWNlLmJpbmQodGhpcyk7XHJcblxyXG4gICAgICAgIGhpc3RvcnkucmVwbGFjZVN0YXRlKHt1c2VyOmZhbHNlfSwgJycsICcnKTtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVUYWJsZSgpIHtcclxuXHJcbiAgICAgICAgbGV0IHRhYmxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGFibGUnKTtcclxuICAgICAgICB0YWJsZS5jbGFzc05hbWUgPSBcInRhYmxlXCI7XHJcblxyXG4gICAgICAgIGxldCB0aGVhZCA9IHRoaXMuY3JlYXRlSGVhZCgpO1xyXG4gICAgICAgIGxldCByb3dzID0gdGhpcy5jcmVhdGVSb3dBbGwoKTtcclxuXHJcblxyXG5cclxuICAgICAgICBpZiAocm93cykge1xyXG4gICAgICAgICAgICB0YWJsZS5hcHBlbmRDaGlsZCh0aGVhZCk7XHJcbiAgICAgICAgICAgIHRhYmxlLmFwcGVuZENoaWxkKHJvd3MpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgIGxldCBkaXZNZXNzYWdlID0gdGhpcy5jcmVhdGVNZXNzYWdlRG93bmxvYWQoKTtcclxuICAgICAgICAgICAgdGFibGUuYXBwZW5kQ2hpbGQoZGl2TWVzc2FnZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnRhYmxlID0gdGFibGU7XHJcbiAgICAgICAgdGhpcy5kaXYgPSB0YWJsZTtcclxuXHJcbiAgICAgICAgdGhpcy5yZW1vdmVUYWJsZSgpO1xyXG4gICAgICAgIHRoaXMucGFyZW50RWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLnRhYmxlKTtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVIZWFkKCkge1xyXG5cclxuICAgICAgICBsZXQgdGhlYWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0aGVhZCcpO1xyXG5cclxuICAgICAgICBsZXQgdHIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0cicpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBjb2x1bSBpbiB0aGlzLmhlYWQpIHtcclxuICAgICAgICAgICAgbGV0IHRoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGgnKTtcclxuXHJcbiAgICAgICAgICAgIHRoLmlubmVyVGV4dCA9IHRoaXMuaGVhZFtjb2x1bV07XHJcbiAgICAgICAgICAgIHRoLmlkID0gYENvbHVtbi0ke2NvbHVtfWA7XHJcbiAgICAgICAgICAgIHRoLnN0eWxlLmN1cnNvciA9ICdwb2ludGVyJztcclxuICAgICAgICAgICAgdGgub25jbGljayA9IHRoaXMuY2xpY2tPbkhlYWRPZkNvbHVtbjtcclxuXHJcbiAgICAgICAgICAgIHRyLmFwcGVuZENoaWxkKHRoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoZWFkLmFwcGVuZENoaWxkKHRyKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoZWFkO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZVJvd0FsbCgpIHtcclxuICAgICAgICBsZXQgdGJvZHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0Ym9keScpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5jaGVja1VzZXJzKCkpIHtcclxuICAgICAgICAgICAgdGhpcy51c2Vycy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdHIgPSB0aGlzLmNyZWF0ZVJvd09uZShlbGVtZW50KTtcclxuICAgICAgICAgICAgICAgIHRib2R5LmFwcGVuZENoaWxkKHRyKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnJvd3MgPSB0Ym9keTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0Ym9keTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZVJvd09uZShjb2x1bW5zKSB7XHJcblxyXG4gICAgICAgIGxldCB0ciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RyJyk7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGNvbHVtIGluIHRoaXMuaGVhZCkge1xyXG4gICAgICAgICAgICBsZXQgdGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0aCcpO1xyXG4gICAgICAgICAgICB0aC5pbm5lclRleHQgPSBjb2x1bW5zW2NvbHVtXTtcclxuXHJcbiAgICAgICAgICAgIHRyLmFwcGVuZENoaWxkKHRoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRyLmlkID0gYHJvdyR7Y29sdW1ucy5pZH1gO1xyXG4gICAgICAgIHRyLnN0eWxlLmN1cnNvciA9IFwicG9pbnRlclwiO1xyXG4gICAgICAgIHRyLm9uY2xpY2sgPSB0aGlzLmNsaWNrT25Sb3c7XHJcblxyXG4gICAgICAgIHJldHVybiB0cjtcclxuICAgIH1cclxuXHJcbiAgICBjaGVja1VzZXJzKCkge1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMudXNlcnMpIHtcclxuICAgICAgICAgICAgdGhpcy5hamF4UmVxdWVzdFVzZXJzKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZU1lc3NhZ2VEb3dubG9hZCgpe1xyXG5cclxuICAgICAgICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgZGl2LmNsYXNzTmFtZSA9IFwiYWxlcnQgYWxlcnQtaW5mb1wiO1xyXG4gICAgICAgIGRpdi5pbm5lclRleHQgPSBcItCX0LDQs9GA0YPQt9C60LAg0YLQsNCx0LvQuNGG0YtcIjtcclxuXHJcbiAgICAgICAgcmV0dXJuIGRpdjtcclxuICAgIH1cclxuXHJcbiAgICBhamF4UmVxdWVzdFVzZXJzKCkge1xyXG5cclxuICAgICAgICAvL9Cf0YDQvtC80LjRgSDQttC00LXRgiDQv9C+0LTQs9GA0YPQt9C60Lgg0LTQsNC90L3Ri9GFXHJcbiAgICAgICAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IG5ldyBKc29uUChcIi9kYXRhL1VzZXJzL3VzZXJzLmpzb25cIiwgXCIvanMvanNvblAvdXNlcnMuanNcIiwgdGhpcywgJ3VzZXJzJykucmVxdWVzdCgpO1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmRhdGEpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51c2VycyA9IHRoaXMuZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIDEwMDApO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvL9Ca0LDQuiDQtNCw0L3QvdGL0LUg0LfQsNCz0YDRg9C30LjQu9C40YHRjCwg0YDQuNGB0YPQtdGCINGC0LDQsdC70LjRhtGDXHJcbiAgICAgICAgcHJvbWlzZS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnRhYmxlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVFbGVtZW50KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUVsZW1lbnQoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuY3JlYXRlVGFibGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy50YWJsZTtcclxuICAgIH1cclxuXHJcbiAgICAvL9CU0L7QsdCw0LLQu9C10L3QuNC1INGB0YLRgNC+0LrQuFxyXG4gICAgYWRkUm93KGNvbHVtbnMpIHtcclxuXHJcbiAgICAgICAgbGV0IGxlbmd0aCA9IHRoaXMudXNlcnMubGVuZ3RoO1xyXG4gICAgICAgIGNvbHVtbnNbJ2lkJ10gPSBsZW5ndGggKyAxO1xyXG5cclxuICAgICAgICB0aGlzLnVzZXJzLnB1c2goY29sdW1ucyk7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVUYWJsZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZVRhYmxlKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnBhcmVudEVsZW1lbnQuZmlyc3RFbGVtZW50Q2hpbGQpIHtcclxuICAgICAgICAgICAgdGhpcy5wYXJlbnRFbGVtZW50LmZpcnN0RWxlbWVudENoaWxkLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvL9Ch0L7QsdGL0YLQuNC1LCDQutC70LjQuiDQv9C+INGB0YLRgNC+0LrQtSwg0YHQvtC30LTQsNC10YIg0YLQsNCx0LvQuNGG0YMg0YEg0L7QtNC90LjQvCDQv9C+0LvRjNC30L7QstCw0YLQtdC70LXQvCDQuCDQv9C+0LrQsNC30YvQstCw0LXRgiDQtdGRXHJcbiAgICBjbGlja09uUm93KGV2ZW50KXtcclxuXHJcbiAgICAgICAgbGV0IHJlZ3VsYXJTdHJpbmcgPSAvXFxkKyQvO1xyXG4gICAgICAgIGxldCBpZCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQuaWQ7XHJcblxyXG4gICAgICAgIGlkID0gcmVndWxhclN0cmluZy5leGVjKGlkKTtcclxuXHJcbiAgICAgICAgaWYoaWQpe1xyXG5cclxuICAgICAgICAgICAgbGV0IHVzZXIgPSB0aGlzLnNlYXJjaFVzZXIoaWQpO1xyXG4gICAgICAgICAgICBsZXQgcGFuZWwgPSBuZXcgUGFuZWxVc2VyKHVzZXIsIHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy51c2VyID0gcGFuZWw7XHJcbiAgICAgICAgICAgIHRoaXMuc2hvd1VzZXIoKTtcclxuXHJcbiAgICAgICAgICAgIGhpc3RvcnkucHVzaFN0YXRlKHt1c2VyOnRydWV9LCAnJywgJycpO1xyXG5cclxuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJwb3BzdGF0ZVwiLCB0aGlzLmJhY2tIaXN0b3J5LCBmYWxzZSk7XHJcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCB0aGlzLmtleUJhY2tzcGFjZSwgZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvL9Ch0L7QsdGL0YLQuNC1LCDQutC70LjQuiDQvdCwINC30LDQs9C+0LvQvtCy0L7QuiDRgdGC0L7Qu9Cx0YbQsCwg0YHQvtGA0YLQuNGA0YPQtdGCINGB0YLRgNC+0LrQuC5cclxuICAgIGNsaWNrT25IZWFkT2ZDb2x1bW4oZXZlbnQpe1xyXG5cclxuICAgICAgICBsZXQgY29sdW1uSWQgPSBldmVudC5jdXJyZW50VGFyZ2V0LmlkO1xyXG5cclxuICAgICAgICBsZXQgcmVndWxhciA9IC9Db2x1bW4tKFxcdyspLztcclxuICAgICAgICBsZXQgbmFtZUNvbHVtbiA9IGNvbHVtbklkLm1hdGNoKHJlZ3VsYXIpWzFdO1xyXG5cclxuICAgICAgICBpZih0aGlzLnNvcnQua2V5ICE9PSBuYW1lQ29sdW1uKXtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc29ydC5rZXkgPSBuYW1lQ29sdW1uO1xyXG4gICAgICAgICAgICB0aGlzLnVzZXJzLnNvcnQodGhpcy5zb3J0QXJyYXlCeUtleSk7XHJcblxyXG4gICAgICAgIH1lbHNlIHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMudXNlcnMucmV2ZXJzZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVSb3dzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy/Qn9C+0LjRgdC6INC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjyDQv9C+IGlkXHJcbiAgICBzZWFyY2hVc2VyKGlkKXtcclxuXHJcbiAgICAgICAgZm9yKGxldCBrZXkgaW4gdGhpcy51c2Vycyl7XHJcblxyXG4gICAgICAgICAgICBsZXQgdXNlciA9IHRoaXMudXNlcnNba2V5XTtcclxuXHJcbiAgICAgICAgICAgIGlmKHVzZXIuaWQgPT0gaWQpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVzZXI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwi0J/QvtC70YzQt9C+0LLQsNGC0LXQu9GMINC90LUg0L3QsNC50LTQtdC9XCIpO1xyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLy/Qn9C+0LrQsNC30YvQstCw0LXRgiDQv9C+0LvRjNC30L7QstCw0YLQtdC70Y9cclxuICAgIHNob3dVc2VyKCl7XHJcblxyXG4gICAgICAgIGlmKHRoaXMudXNlci5nZXRQYW5lbCgpKXtcclxuXHJcbiAgICAgICAgICAgIHRoaXMudGFibGUucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIHRoaXMucGFyZW50RWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLnVzZXIuZ2V0UGFuZWwoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8v0J/QvtC60LDQt9GL0LLQsNC10YIg0YLQsNCx0LvQuNGG0YNcclxuICAgIHNob3dUYWJsZSgpe1xyXG5cclxuICAgICAgICBpZih0aGlzLnRhYmxlKXtcclxuXHJcbiAgICAgICAgICAgIHRoaXMucGFyZW50RWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLnRhYmxlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy/QntCx0L3QvtCy0LvRj9C10YIg0YHRgtGA0L7QutC4ICjQv9C+0YHQu9C1INGB0L7RgNGC0LjRgNC+0LLQutC4KVxyXG4gICAgdXBkYXRlUm93cygpe1xyXG5cclxuICAgICAgICB0aGlzLnJvd3MucmVtb3ZlKCk7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVSb3dBbGwoKTtcclxuICAgICAgICB0aGlzLnRhYmxlLmFwcGVuZENoaWxkKHRoaXMucm93cyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy/QpNGD0L3QutGG0LjRjyDQtNC70Y8g0YHQvtGA0YLQuNGA0L7QstC60Lgg0LzQsNGB0YHQuNCy0LBcclxuICAgIHNvcnRBcnJheUJ5S2V5KGEsYil7XHJcblxyXG4gICAgICAgIGxldCBrZXkgPSB0aGlzLnNvcnRbJ2tleSddO1xyXG4gICAgICAgIGlmKGFba2V5XSA+IGJba2V5XSkgcmV0dXJuIDE7XHJcbiAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgfVxyXG5cclxuICAgIC8v0KHQvtCx0YvRgtC40LUsINC60L3QvtC/0LrQsCDQvdCw0LfQsNC0INCx0YDQsNGD0LfQtdGA0LBcclxuICAgIGJhY2tIaXN0b3J5KGV2ZW50KXtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coZXZlbnQuc3RhdGUpO1xyXG4gICAgICAgIGlmKGV2ZW50LnN0YXRlLnVzZXIgPT09IGZhbHNlKXtcclxuXHJcbiAgICAgICAgICAgIHRoaXMudXNlci5jbGlja09uQnV0dG9uQmFjaygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoZXZlbnQuc3RhdGUudXNlciA9PT0gdHJ1ZSl7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnNob3dVc2VyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8v0JrQvdC+0L/QutCwIEJhY2tzcGFjZVxyXG4gICAga2V5QmFja3NwYWNlKGV2ZW50KXtcclxuXHJcbiAgICAgICAgaWYoZXZlbnQua2V5Q29kZSA9PT0gOCl7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnVzZXIuY2xpY2tPbkJ1dHRvbkJhY2soKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2pzL1RhYmxlLmpzXG4vLyBtb2R1bGUgaWQgPSA0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhbmVsVXNlciB7XHJcblxyXG4gICAgY29uc3RydWN0b3IodXNlciwgcGFyZW50KSB7XHJcblxyXG4gICAgICAgIHRoaXMudXNlciA9IHVzZXI7XHJcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XHJcblxyXG4gICAgICAgIHRoaXMuZGl2ID0gbnVsbDtcclxuICAgICAgICB0aGlzLmJ1dHRvbiA9IG51bGw7XHJcblxyXG4gICAgICAgIHRoaXMuY2xpY2tPbkJ1dHRvbkJhY2sgPSB0aGlzLmNsaWNrT25CdXR0b25CYWNrLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlUGFuZWwoKSB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnVzZXIpIHtcclxuXHJcbiAgICAgICAgICAgIGxldCBkaXYgPSB0aGlzLmNyZWF0ZU1haW5EaXYoKTtcclxuICAgICAgICAgICAgbGV0IGhlYWRpbmcgPSB0aGlzLmNyZWF0ZUhlYWRpbmcoKTtcclxuICAgICAgICAgICAgbGV0IGJvZHkgPSB0aGlzLmNyZWF0ZUJvZHkoKTtcclxuXHJcbiAgICAgICAgICAgIGRpdi5hcHBlbmRDaGlsZChoZWFkaW5nKTtcclxuICAgICAgICAgICAgZGl2LmFwcGVuZENoaWxkKGJvZHkpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5kaXYgPSBkaXY7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZGl2O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVNYWluRGl2KCkge1xyXG5cclxuICAgICAgICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgZGl2LmNsYXNzTmFtZSA9IFwicGFuZWwgcGFuZWwtcHJpbWFyeVwiO1xyXG5cclxuICAgICAgICByZXR1cm4gZGl2O1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZUhlYWRpbmcoKSB7XHJcblxyXG4gICAgICAgIGxldCBoZWFkaW5nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgaGVhZGluZy5jbGFzc05hbWUgPSBcInBhbmVsLWhlYWRpbmdcIjtcclxuXHJcbiAgICAgICAgbGV0IGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGJ1dHRvbi5jbGFzc05hbWUgPSBcImJ0biBidG4tcHJpbWFyeVwiO1xyXG4gICAgICAgIGJ1dHRvbi50eXBlID0gXCJidXR0b25cIjtcclxuICAgICAgICBidXR0b24uaW5uZXJUZXh0ID0gXCLQndCw0LfQsNC0INC6INGB0L/QuNGB0LrRgyDQv9C+0LvRjNC30L7QstCw0YLQtdC70LXQuVwiO1xyXG4gICAgICAgIGJ1dHRvbi5vbmNsaWNrID0gdGhpcy5jbGlja09uQnV0dG9uQmFjaztcclxuXHJcbiAgICAgICAgdGhpcy5idXR0b24gPSBidXR0b247XHJcblxyXG4gICAgICAgIGhlYWRpbmcuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGhlYWRpbmc7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlQm9keSgpIHtcclxuXHJcbiAgICAgICAgbGV0IGJvZHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBib2R5LmNsYXNzTmFtZSA9IFwicGFuZWwtYm9keVwiO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy51c2VyKSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgcm93ID0gdGhpcy5jcmVhdGVSb3coa2V5LCB0aGlzLnVzZXJba2V5XSk7XHJcblxyXG4gICAgICAgICAgICBib2R5LmFwcGVuZENoaWxkKHJvdyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gYm9keTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgY3JlYXRlUm93KG5hbWVJdGVtLCBpdGVtKSB7XHJcblxyXG4gICAgICAgIGxldCByb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICByb3cuY2xhc3NOYW1lID0gXCJyb3dcIjtcclxuXHJcbiAgICAgICAgbmFtZUl0ZW0gPSB0aGlzLmNyZWF0ZURpdkl0ZW0obmFtZUl0ZW0pO1xyXG4gICAgICAgIGl0ZW0gPSB0aGlzLmNyZWF0ZURpdkl0ZW0oaXRlbSk7XHJcblxyXG4gICAgICAgIHJvdy5hcHBlbmRDaGlsZChuYW1lSXRlbSk7XHJcbiAgICAgICAgcm93LmFwcGVuZENoaWxkKGl0ZW0pO1xyXG5cclxuICAgICAgICByZXR1cm4gcm93O1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZURpdkl0ZW0odGV4dCkge1xyXG5cclxuICAgICAgICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgZGl2LmNsYXNzTmFtZSA9IFwiY29sLWxnLTYgY29sLW1kLTYgY29sLXNtLTYgY29sLXhzLTZcIjtcclxuICAgICAgICBkaXYuaW5uZXJUZXh0ID0gdGV4dDtcclxuXHJcbiAgICAgICAgcmV0dXJuIGRpdjtcclxuICAgIH1cclxuXHJcbiAgICBjbGlja09uQnV0dG9uQmFjayhldmVudCkge1xyXG4gICAgICAgIGlmIChldmVudCkgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMucGFyZW50LnNob3dUYWJsZSgpO1xyXG4gICAgICAgIHRoaXMuZGl2LnJlbW92ZSgpO1xyXG5cclxuICAgICAgICBoaXN0b3J5LnB1c2hTdGF0ZSh7dXNlcjogZmFsc2V9LCAnJywgJycpO1xyXG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCB0aGlzLnBhcmVudC5rZXlCYWNrc3BhY2UsIGZhbHNlKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRQYW5lbCgpIHtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLmRpdikgdGhpcy5jcmVhdGVQYW5lbCgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRpdjtcclxuICAgIH1cclxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vanMvVGFibGUvUGFuZWxVc2VyLmpzXG4vLyBtb2R1bGUgaWQgPSA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8v0JPRgNGD0L/Qv9CwINC60L3QvtC/0L7QulxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCdXR0b25zR3JvdXAge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICAgICAgICB0aGlzLmRpdiA9IG51bGw7XHJcblxyXG4gICAgICAgIHRoaXMuYnV0dG9uQWRkID0gbnVsbDtcclxuICAgICAgICB0aGlzLmJ1dHRvblJlc2V0ID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVFbGVtZW50KCkge1xyXG4gICAgICAgIGxldCBkaXYgPSB0aGlzLmNyZWF0ZU1haW5EaXYoKTtcclxuXHJcbiAgICAgICAgbGV0IGJ1dHRvbkFkZCA9IHRoaXMuY3JlYXRlQnV0dG9uQWRkKCk7XHJcbiAgICAgICAgdGhpcy5idXR0b25BZGQgPSBidXR0b25BZGQ7XHJcblxyXG4gICAgICAgIGxldCBidXR0b25SZXNldCA9IHRoaXMuY3JlYXRlQnV0dG9uUmVzZXQoKTtcclxuICAgICAgICB0aGlzLmJ1dHRvblJlc2V0ID0gYnV0dG9uUmVzZXQ7XHJcblxyXG4gICAgICAgIGRpdi5hcHBlbmRDaGlsZChidXR0b25BZGQpO1xyXG4gICAgICAgIGRpdi5hcHBlbmRDaGlsZChidXR0b25SZXNldCk7XHJcblxyXG4gICAgICAgIHRoaXMuZGl2ID0gZGl2O1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZU1haW5EaXYoKSB7XHJcbiAgICAgICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGRpdi5jbGFzc05hbWUgPSBcImZvcm0tZ3JvdXBcIjtcclxuXHJcbiAgICAgICAgcmV0dXJuIGRpdjtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVCdXR0b25BZGQoKSB7XHJcbiAgICAgICAgbGV0IGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xyXG4gICAgICAgIGJ1dHRvbi5jbGFzc05hbWUgPSBcImJ0biBidG4tZGVmYXVsdFwiO1xyXG4gICAgICAgIGJ1dHRvbi50eXBlID0gXCJidXR0b25cIjtcclxuICAgICAgICBidXR0b24uaW5uZXJUZXh0ID0gXCLQlNC+0LHQsNCy0LjRgtGMXCI7XHJcbiAgICAgICAgYnV0dG9uLm5hbWUgPSBcImFkZFwiO1xyXG5cclxuICAgICAgICByZXR1cm4gYnV0dG9uO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZUJ1dHRvblJlc2V0KCkge1xyXG4gICAgICAgIGxldCBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcclxuICAgICAgICBidXR0b24uY2xhc3NOYW1lID0gXCJidG4gYnRuLWRlZmF1bHRcIjtcclxuICAgICAgICBidXR0b24udHlwZSA9IFwicmVzZXRcIjtcclxuICAgICAgICBidXR0b24uaW5uZXJUZXh0ID0gXCLQntGH0LjRgdGC0LjRgtGMXCI7XHJcbiAgICAgICAgYnV0dG9uLm5hbWUgPSBcInJlc2V0XCI7XHJcblxyXG4gICAgICAgIHJldHVybiBidXR0b247XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RWxlbWVudCgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuZGl2KSB0aGlzLmNyZWF0ZUVsZW1lbnQoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGl2O1xyXG4gICAgfVxyXG5cclxuICAgIGNsaWNrQWRkKCkge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5idXR0b25BZGQpIHtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25BZGQuY2xpY2soKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY2xpY2tSZXNldCgpIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuYnV0dG9uUmVzZXQpIHtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25SZXNldC5jbGljaygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2pzL2Zvcm0vQnV0dG9uc0dyb3VwLmpzXG4vLyBtb2R1bGUgaWQgPSA2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCBOYW1lSW5wdXQgZnJvbSBcIi4vTmFtZUlucHV0XCI7XHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4vL9Cd0LDRgdC70LXQtNGD0LXRgtGB0Y8g0L7RgiBOYW1lSW5wdXQsINGC0LDQvCDQutC+0LzQvNC10L3RgtCw0YDQuNC4XHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVtYWlsSW5wdXQgZXh0ZW5kcyBOYW1lSW5wdXQge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICAgICAgICBzdXBlcihhcmd1bWVudHMpO1xyXG5cclxuICAgICAgICB0aGlzLmRpdiA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5pbnB1dCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5lcnJvciA9IG51bGw7XHJcblxyXG4gICAgICAgIHRoaXMuZXJyb3JUZXh0ID0gXCJFbWFpbCDQtNC+0LvQttC10L0g0LjQvNC10YLRjCDRhNC+0YDQvNCw0YI6IGVtYWlsQGVtYWlsLnJ1XCI7XHJcbiAgICAgICAgdGhpcy5yZWd1bGFyU3RyaW5nVmFsaWRhdGUgPSAvXltBLVphLXowLTldXFx3KlxcQFxcdytcXC5bYS16XSskLztcclxuICAgICAgICB0aGlzLnJlZ3VsYXJTdHJpbmdLZXlkb3duID0gL15bXFx3QC4tXSQvO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZUxhYmVsKCkge1xyXG4gICAgICAgIGxldCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XHJcbiAgICAgICAgbGFiZWwuY2xhc3NOYW1lID0gXCJjb250cm9sLWxhYmVsXCI7XHJcbiAgICAgICAgbGFiZWwuaW5uZXJUZXh0ID0gXCJFbWFpbFwiO1xyXG5cclxuICAgICAgICByZXR1cm4gbGFiZWw7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlSW5wdXQoKSB7XHJcbiAgICAgICAgbGV0IGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcclxuICAgICAgICBpbnB1dC5jbGFzc05hbWUgPSBcImZvcm0tY29udHJvbFwiO1xyXG4gICAgICAgIGlucHV0LnR5cGUgPSBcInRleHRcIjtcclxuICAgICAgICBpbnB1dC5wbGFjZWhvbGRlciA9IFwi0JLQsNGIIEVtYWlsXCI7XHJcbiAgICAgICAgaW5wdXQubmFtZSA9IFwiZW1haWxcIjtcclxuXHJcbiAgICAgICAgcmV0dXJuIGlucHV0O1xyXG4gICAgfVxyXG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9qcy9mb3JtL0VtYWlsSW5wdXQuanNcbi8vIG1vZHVsZSBpZCA9IDdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IE5hbWVJbnB1dCBmcm9tIFwiLi9OYW1lSW5wdXRcIjtcclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbi8v0J3QsNGB0LvQtdC00YPQtdGC0YHRjyDQvtGCIE5hbWVJbnB1dCwg0YLQsNC8INC60L7QvNC80LXQvdGC0LDRgNC40LhcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGhvbmVJbnB1dCBleHRlbmRzIE5hbWVJbnB1dCB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcblxyXG4gICAgICAgIHN1cGVyKGFyZ3VtZW50cyk7XHJcblxyXG4gICAgICAgIHRoaXMuZGl2ID0gbnVsbDtcclxuICAgICAgICB0aGlzLmlucHV0ID0gbnVsbDtcclxuICAgICAgICB0aGlzLmVycm9yID0gbnVsbDtcclxuXHJcbiAgICAgICAgdGhpcy5lcnJvclRleHQgPSBcItCd0L7QvNC10YAg0LTQvtC70LbQtdC9INC40LzQtdGC0Ywg0YTQvtGA0LzQsNGCOiArWCAoWFhYKSBYWFgtWFgtWFhcIjtcclxuICAgICAgICB0aGlzLnJlZ3VsYXJTdHJpbmdWYWxpZGF0ZSA9IC9eXFwrXFxkID9cXChcXGR7M31cXCkgP1xcZHszfVxcLVxcZHsyfVxcLVxcZHsyfSQvO1xyXG5cclxuICAgICAgICB0aGlzLnJlZ3VsYXJTdHJpbmdLZXlkb3duID0gL15bXFxkXFwgXFwoXFwpXFwtK10kLztcclxuXHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlTGFiZWwoKSB7XHJcbiAgICAgICAgbGV0IGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcclxuICAgICAgICBsYWJlbC5jbGFzc05hbWUgPSBcImNvbnRyb2wtbGFiZWxcIjtcclxuICAgICAgICBsYWJlbC5pbm5lclRleHQgPSBcItCi0LXQu9C10YTQvtC9XCI7XHJcblxyXG4gICAgICAgIHJldHVybiBsYWJlbDtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVJbnB1dCgpIHtcclxuICAgICAgICBsZXQgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xyXG4gICAgICAgIGlucHV0LmNsYXNzTmFtZSA9IFwiZm9ybS1jb250cm9sXCI7XHJcbiAgICAgICAgaW5wdXQudHlwZSA9IFwidGV4dFwiO1xyXG4gICAgICAgIGlucHV0LnBsYWNlaG9sZGVyID0gXCLQktCw0Ygg0KLQtdC70LXRhNC+0L1cIjtcclxuICAgICAgICBpbnB1dC5uYW1lID0gXCJwaG9uZVwiO1xyXG5cclxuICAgICAgICByZXR1cm4gaW5wdXQ7XHJcbiAgICB9XHJcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2pzL2Zvcm0vUGhvbmVJbnB1dC5qc1xuLy8gbW9kdWxlIGlkID0gOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgU2VsZWN0Qm94IGZyb20gXCIuL1NlbGVjdEJveFwiO1xyXG5pbXBvcnQgSnNvblAgZnJvbSBcIi4uL0pzb25QXCI7XHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4vL9Ch0LXQu9C10LrRgiDQsdC+0LrRgSDQs9C+0YDQvtC00LBcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VsZWN0Qm94Q2l0aWVzIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICAgICAgICB0aGlzLnNlbGVjdEJveENvdW50cmllcyA9IG51bGw7XHJcblxyXG4gICAgICAgIHRoaXMuZGF0YSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5pZENvdW50cnkgPSBcIjFcIjtcclxuICAgICAgICB0aGlzLmxpc3RDaXRpZXMgPSBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLnByb21pc2VKc29uUCgpO1xyXG5cclxuICAgICAgICB0aGlzLnNlbGVjdEJveCA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlU2VsZWN0Qm94KCkge1xyXG4gICAgICAgIGxldCBzZWxlY3RCb3ggPSBuZXcgU2VsZWN0Qm94KFwi0JPQvtGA0L7QtFwiLCBcImNpdGllc1wiLCB0aGlzLmxpc3RDaXRpZXMpO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0Qm94ID0gc2VsZWN0Qm94O1xyXG4gICAgfVxyXG5cclxuICAgIGdldFNlbGVjdEJveCgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuc2VsZWN0Qm94KSB0aGlzLmNyZWF0ZVNlbGVjdEJveCgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLnNlbGVjdEJveC5nZXRTZWxlY3RCb3goKTtcclxuICAgIH1cclxuXHJcbiAgICAvL9Cf0YDQvtC80LjRgSDQttC00LXRgiDQt9Cw0LPRgNGD0LfQutC4INC00LDQvdC90YvRhVxyXG4gICAgLy/Qn9C+0YHQu9C1INC30LDQs9GA0YPQt9C60Lgg0L7QsdC90L7QstC70Y/QtdGCINGB0LXQu9C10LrRgiDQsdC+0LrRgVxyXG4gICAgLy/QktGL0LfRi9Cy0LDQtdGC0YHRjyDQv9GA0Lgg0YHQvtC30LTQsNC90LjQuCDRjdC60LfQtdC80L/Qu9GP0YDQsCDQuCDQutC+0LPQtNCwINC80LXQvdGP0LXRgtGB0Y8gaWQg0YHRgtGA0LDQvdGLICjQtdGB0LvQuCDRgdGC0YDQsNC90LAg0L3QtSDQsdGL0LvQsCDQt9Cw0LPRgNGD0LbQtdC90LAg0YDQsNC90LXQtSlcclxuICAgIHByb21pc2VKc29uUCgpIHtcclxuXHJcbiAgICAgICAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IG5ldyBKc29uUChgL2RhdGEvQ291bnRyaWVzLyR7dGhpcy5pZENvdW50cnl9Lmpzb25gLCBcIi9qcy9qc29uUC9jaXRpZXMuanNcIiwgdGhpcywgJ2NpdGllcycpLnJlcXVlc3QoKTtcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kYXRhKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGlzdENpdGllcyA9IHRoaXMuZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdEJveENvdW50cmllcy5zYXZlQ2l0aWVzKHRoaXMuaWRDb3VudHJ5LCB0aGlzLmxpc3RDaXRpZXMgfHwgbnVsbCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSwgMTAwMCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHByb21pc2UudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zZWxlY3RCb3gpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdEJveC51cGRhdGVMaXN0KHRoaXMubGlzdENpdGllcyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIC8v0KHQstGP0LfRjCDRgSDRgdC10LvQtdC60YIg0LHQvtC60YHQvtC8INGB0YLRgNCw0L3Ri1xyXG4gICAgc2V0U2VsZWN0Qm94Q291bnRyaWVzKHNlbGVjdEJveCkge1xyXG5cclxuICAgICAgICB0aGlzLnNlbGVjdEJveENvdW50cmllcyA9IHNlbGVjdEJveDtcclxuICAgIH1cclxuXHJcbiAgICAvL9CX0LDQvNC10L3QsCBpZENvdW50cnksINC10YHQu9C4INC10YHRgtGMINCw0YDQs9GD0LzQtdC90YIgY2l0aWVzLCDRgtC+INC/0YDQvtC80LjRgSDQvdC1INCy0YvQt9GL0LLQsNC10YLRgdGPXHJcbiAgICBjaGFuZ2VJZENvdW50cnkoaWRDb3VudHJ5LCBjaXRpZXMpIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaWRDb3VudHJ5ICE9IGlkQ291bnRyeSkge1xyXG5cclxuICAgICAgICAgICAgdGhpcy5pZENvdW50cnkgPSBpZENvdW50cnk7XHJcblxyXG4gICAgICAgICAgICBpZiAoY2l0aWVzKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RCb3gudXBkYXRlTGlzdChjaXRpZXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RCb3guY2xlYXJMaXN0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByb21pc2VKc29uUCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vanMvZm9ybS9TZWxlY3RCb3hDaXRpZXMuanNcbi8vIG1vZHVsZSBpZCA9IDlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IFNlbGVjdEJveCBmcm9tIFwiLi9TZWxlY3RCb3hcIjtcclxuaW1wb3J0IEpzb25QIGZyb20gXCIuLi9Kc29uUFwiO1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuLy/QodC10LvQtdC60YIg0LHQvtC60YEg0YHRgtGA0LDQvdGLXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlbGVjdEJveENvdW50cmllcyB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgICAgICAgdGhpcy5zZWxlY3RCb3hDaXRpZXMgPSBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLmRhdGEgPSBudWxsO1xyXG4gICAgICAgIHRoaXMubGlzdENvdW50cmllcyA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5jb3VudHJpZXMgPSBbXTtcclxuXHJcbiAgICAgICAgdGhpcy5wcm9taXNlSnNvblAoKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZWxlY3RCb3ggPSBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLm9uQ2hhbmdlID0gdGhpcy5vbkNoYW5nZS5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8v0J/RgNC+0LzQuNGBINC20LTQtdGCINC30LDQs9GA0YPQt9C60Lgg0LTQsNC90L3Ri9GFXHJcbiAgICAvL9Cf0L7RgdC70LUg0LfQsNCz0YDRg9C30LrQuCDQvtCx0L3QvtCy0LvRj9C10YIg0YHQtdC70LXQutGCINCx0L7QutGBXHJcbiAgICBwcm9taXNlSnNvblAoKSB7XHJcblxyXG4gICAgICAgIGxldCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBuZXcgSnNvblAoXCIvZGF0YS9jb3VudHJpZXMvQ291bnRyaWVzLmpzb25cIiwgXCIvanMvanNvblAvY291bnRyaWVzLmpzXCIsIHRoaXMsICdjb3VudHJpZXMnKS5yZXF1ZXN0KCk7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZGF0YSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxpc3RDb3VudHJpZXMgPSB0aGlzLmRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LCAxMDAwKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcHJvbWlzZS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNlbGVjdEJveCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0Qm94LnVwZGF0ZUxpc3QodGhpcy5saXN0Q291bnRyaWVzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlU2VsZWN0Qm94KCkge1xyXG4gICAgICAgIGxldCBzZWxlY3RCb3ggPSBuZXcgU2VsZWN0Qm94KFwi0KHRgtGA0LDQvdCwXCIsIFwiY291bnRyaWVzXCIsIHRoaXMubGlzdENvdW50cmllcywgdGhpcy5vbkNoYW5nZSk7XHJcbiAgICAgICAgdGhpcy5zZWxlY3RCb3ggPSBzZWxlY3RCb3g7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0U2VsZWN0Qm94KCkge1xyXG4gICAgICAgIGlmICghdGhpcy5zZWxlY3RCb3gpIHRoaXMuY3JlYXRlU2VsZWN0Qm94KCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0Qm94LmdldFNlbGVjdEJveCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8v0KHQstGP0LfRjCDRgSDRgdC10LvQtdC60YIg0LHQvtC60YHQvtC8INCz0L7RgNC+0LTQsFxyXG4gICAgc2V0U2VsZWN0Qm94Q2l0aWVzKHNlbGVjdEJveENpdGllcykge1xyXG5cclxuICAgICAgICB0aGlzLnNlbGVjdEJveENpdGllcyA9IHNlbGVjdEJveENpdGllcztcclxuXHJcbiAgICAgICAgc2VsZWN0Qm94Q2l0aWVzLnNldFNlbGVjdEJveENvdW50cmllcyh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICAvL9Ch0L7RhdGA0LDQvdC10L3QuNC1INC+0LHRitC10LrRgtCwINGBINCz0L7RgNC+0LTQsNC80LhcclxuICAgIHNhdmVDaXRpZXMoaWRDb3VudHJ5LCBsaXN0Q2l0aWVzKSB7XHJcblxyXG4gICAgICAgIGxldCBjb3VudHJ5ID0gdGhpcy5zZWFyY2hDb3VudHJ5T25JZChpZENvdW50cnkpO1xyXG5cclxuICAgICAgICBpZiAoIWNvdW50cnkpIHtcclxuICAgICAgICAgICAgY291bnRyeSA9IHtcclxuICAgICAgICAgICAgICAgIGlkOiBpZENvdW50cnksXHJcbiAgICAgICAgICAgICAgICBjaXRpZXM6IGxpc3RDaXRpZXNcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY291bnRyaWVzLnB1c2goY291bnRyeSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8v0KHQvtCx0YvRgtC40LUsINC/0YDQuCDRgdC80LXQvdC1INCy0YvQsdGA0LDQvdC90L7Qs9C+INC40L3QtNC10LrRgdCwXHJcbiAgICBvbkNoYW5nZShldmVudCkge1xyXG5cclxuICAgICAgICBsZXQgc2VsZWN0Qm94ID0gZXZlbnQuY3VycmVudFRhcmdldDtcclxuICAgICAgICBsZXQgc2VsZWN0ZWRJbmRleCA9IHNlbGVjdEJveC5zZWxlY3RlZEluZGV4O1xyXG5cclxuICAgICAgICBsZXQgaWRDb3VudHJ5ID0gc2VsZWN0Qm94Lm9wdGlvbnNbc2VsZWN0ZWRJbmRleF0udmFsdWU7XHJcblxyXG4gICAgICAgIGxldCBjb3VudHJ5ID0gdGhpcy5zZWFyY2hDb3VudHJ5T25JZChpZENvdW50cnkpO1xyXG5cclxuICAgICAgICAvL9CV0YHQu9C4INCz0L7RgNC+0LTQsCDQstGL0LHRgNCw0L3QvdC+0Lkg0YHRgtGA0LDQvdGLINC30LDQs9GA0YPQttC10L3QvdGLINGA0LDQvdC10LUsINGC0L4g0L7QvdC4INC/0LXRgNC10LTQsNGO0YLRgdGPINCyINGB0LXQu9C10LrRgiDQsdC+0LrRgSwg0Lgg0LfQsNCz0YDRg9C30LrQsCDQs9C+0YDQvtC00L7QsiDQvdC1INC/0YDQvtC40YHRhdC+0LTQuNGCIChjb3VudHJ5LmNpdGllcylcclxuICAgICAgICB0aGlzLnNlbGVjdEJveENpdGllcy5jaGFuZ2VJZENvdW50cnkoaWRDb3VudHJ5LCBjb3VudHJ5LmNpdGllcyk7XHJcbiAgICB9XHJcblxyXG4gICAgc2VhcmNoQ291bnRyeU9uSWQoaWQpIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY291bnRyaWVzKSB7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5jb3VudHJpZXMpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgY291bnRyeSA9IHRoaXMuY291bnRyaWVzW2tleV07XHJcbiAgICAgICAgICAgICAgICBpZiAoY291bnRyeS5pZCA9PT0gaWQpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvdW50cnk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vanMvZm9ybS9TZWxlY3RCb3hDb3VudHJpZXMuanNcbi8vIG1vZHVsZSBpZCA9IDEwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcclxuXHJcblxyXG5pbXBvcnQgY3JlYXRlRm9ybUFuZFRhYmxlIGZyb20gXCIuL2pzL2NyZWF0ZUZvcm1BbmRUYWJsZVwiO1xyXG5cclxuLy/QndCw0YXQvtC00LjQvCDQutC90L7Qv9C60YMg0L/QviBpZCwg0LLQtdGI0LDQtdC8INC90LAg0L3QtdC1INC+0LHRgNCw0LHQvtGC0YfQuNC6INGB0L7QsdGL0YLQuNGPXHJcbmxldCBidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY3JlYXRlLWZvcm0tYW5kLXRhYmxlJyk7XHJcbmJ1dHRvbi5vbmNsaWNrID0gY3JlYXRlRm9ybUFuZFRhYmxlO1xyXG5cclxuXHJcblxyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL21haW4uanNcbi8vIG1vZHVsZSBpZCA9IDExXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmltcG9ydCBGb3JtIGZyb20gXCIuL0Zvcm1cIjtcclxuaW1wb3J0IFRhYmxlIGZyb20gXCIuL1RhYmxlXCI7XHJcblxyXG4vL9Ck0YPQvdC60YbQuNGPINGD0LTQsNC70Y/QtdGCINC60L3QvtC/0LrQuCwg0YHQvtC30LTQsNC10YIg0YTQvtGA0LzRgyDQuCDRgtCw0LHQu9C40YbRgy5cclxuLy/QnNC10YLQvtC0IGNyZWF0ZUVsZW1lbnQoKSDRgdC+0LfQtNCw0LXRgiDRjdC70LXQvNC10L3RgiDQuCDQv9C+0LzQtdGJ0LDQtdGCINC10LPQviDQsiBkb20g0LzQvtC00LXQu9GMXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNyZWF0ZUZvcm1BbmRUYWJsZShldmVudCkge1xyXG5cclxuICAgIGV2ZW50LmN1cnJlbnRUYXJnZXQucmVtb3ZlKCk7XHJcblxyXG4gICAgbGV0IGRpdkZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZm9ybScpO1xyXG4gICAgbGV0IGZvcm0gPSBuZXcgRm9ybShkaXZGb3JtKTtcclxuICAgIGZvcm0uY3JlYXRlRWxlbWVudCgpO1xyXG5cclxuICAgIGxldCBkaXZUYWJsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YWJsZScpO1xyXG4gICAgbGV0IHRhYmxlID0gbmV3IFRhYmxlKGRpdlRhYmxlKTtcclxuICAgIHRhYmxlLmNyZWF0ZVRhYmxlKCk7XHJcblxyXG4gICAgZm9ybS5zZXRUYWJsZSh0YWJsZSk7XHJcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2pzL2NyZWF0ZUZvcm1BbmRUYWJsZS5qc1xuLy8gbW9kdWxlIGlkID0gMTJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==