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
/******/ 	return __webpack_require__(__webpack_require__.s = 12);
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
/* harmony export (immutable) */ __webpack_exports__["a"] = createFormAndTable;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Form__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Table__ = __webpack_require__(5);





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

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__form_NameInput__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__form_EmailInput__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__form_PhoneInput__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__form_SelectBoxCountries__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__form_SelectBoxCities__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__form_ButtonsGroup__ = __webpack_require__(7);










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
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__JsonP__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Table_PanelUser__ = __webpack_require__(6);





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
            this.data = new __WEBPACK_IMPORTED_MODULE_0__JsonP__["a" /* default */]("http://tikhomirov-sergey.ru/data/Users/users.json", "http://tikhomirov-sergey.ru/js/jsonP/users.js", this, 'users').request();
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
/* 6 */
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
/* 7 */
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
/* 8 */
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
/* 9 */
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
/* 10 */
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
            this.data = new __WEBPACK_IMPORTED_MODULE_1__JsonP__["a" /* default */](`http://tikhomirov-sergey.ru/data/Countries/${this.idCountry}.json`, "http://tikhomirov-sergey.ru/js/jsonP/cities.js", this, 'cities').request();
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
/* 11 */
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
            this.data = new __WEBPACK_IMPORTED_MODULE_1__JsonP__["a" /* default */]("http://tikhomirov-sergey.ru/data/Countries/countries.json", "http://tikhomirov-sergey.ru/js/jsonP/countries.js", this, 'countries').request();
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
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__js_createFormAndTable__ = __webpack_require__(3);





//Находим кнопку по id, вешаем на нее обработчик события
let button = document.getElementById('create-form-and-table');
button.onclick = __WEBPACK_IMPORTED_MODULE_0__js_createFormAndTable__["a" /* default */];





/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZjBlYmFmYzM5MzUwNDMwZmQ4NjIiLCJ3ZWJwYWNrOi8vLy4vanMvSnNvblAuanMiLCJ3ZWJwYWNrOi8vLy4vanMvZm9ybS9OYW1lSW5wdXQuanMiLCJ3ZWJwYWNrOi8vLy4vanMvZm9ybS9TZWxlY3RCb3guanMiLCJ3ZWJwYWNrOi8vLy4vanMvY3JlYXRlRm9ybUFuZFRhYmxlLmpzIiwid2VicGFjazovLy8uL2pzL0Zvcm0uanMiLCJ3ZWJwYWNrOi8vLy4vanMvVGFibGUuanMiLCJ3ZWJwYWNrOi8vLy4vanMvVGFibGUvUGFuZWxVc2VyLmpzIiwid2VicGFjazovLy8uL2pzL2Zvcm0vQnV0dG9uc0dyb3VwLmpzIiwid2VicGFjazovLy8uL2pzL2Zvcm0vRW1haWxJbnB1dC5qcyIsIndlYnBhY2s6Ly8vLi9qcy9mb3JtL1Bob25lSW5wdXQuanMiLCJ3ZWJwYWNrOi8vLy4vanMvZm9ybS9TZWxlY3RCb3hDaXRpZXMuanMiLCJ3ZWJwYWNrOi8vLy4vanMvZm9ybS9TZWxlY3RCb3hDb3VudHJpZXMuanMiLCJ3ZWJwYWNrOi8vLy4vbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxtREFBMkMsY0FBYzs7QUFFekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7OztBQ2hFQTs7QUFFQTtBQUNBOzs7QUFHQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhOztBQUViO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0Esb0NBQW9DLGVBQWU7QUFDbkQ7QUFDQTtBQUNBLFNBQVM7QUFDVDs7O0FBR0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7Ozs7Ozs7O0FDcEdBOzs7QUFHQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQUE7QUFBQTs7Ozs7Ozs7QUNwSEE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsQzs7Ozs7Ozs7Ozs7O0FDcEZBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxDOzs7Ozs7Ozs7Ozs7O0FDcEJBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7OztBQUdBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFBQTtBQUFBOzs7Ozs7Ozs7OztBQ3RLQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLDhCQUE4QixXQUFXO0FBQ3pDOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSw4QkFBOEIsTUFBTTtBQUNwQztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTs7QUFFYjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxzQkFBc0IsV0FBVztBQUNqQztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBLCtCQUErQixVQUFVOztBQUV6QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQSxTQUFTOztBQUVUO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBOzs7Ozs7Ozs7O0FDblRBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7OztBQUdBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQSwyQkFBMkIsWUFBWTtBQUN2QztBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEM7Ozs7Ozs7OztBQ2pIQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEM7Ozs7Ozs7Ozs7QUMzRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEM7Ozs7Ozs7Ozs7QUNyQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxrREFBa0QsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRTs7QUFFM0U7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEM7Ozs7Ozs7Ozs7O0FDdkNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esa0lBQWdGLGVBQWU7QUFDL0Y7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBOzs7Ozs7Ozs7Ozs7O0FDL0VBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQUE7QUFBQTs7Ozs7Ozs7Ozs7O0FDNUdBOzs7QUFHQTs7QUFFQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYnVpbGQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBpZGVudGl0eSBmdW5jdGlvbiBmb3IgY2FsbGluZyBoYXJtb255IGltcG9ydHMgd2l0aCB0aGUgY29ycmVjdCBjb250ZXh0XG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmkgPSBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWU7IH07XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDEyKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBmMGViYWZjMzkzNTA0MzBmZDg2MiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8v0JrQu9Cw0YHRgSDQtNC70Y8g0L/QvtC00LPRgNGD0LfQutC4INC00LDQvdC90YvRhSjRgdGC0YDQsNC90YssINCz0L7RgNC+0LTQsCwg0YLQsNCx0LvQuNGG0LApLlxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBKc29uUCB7XHJcblxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHNjckpzb24sIHNjckNhbGxiYWNrLCBwYXJlbnQsIG5hbWVTdG9yZSkge1xyXG5cclxuICAgICAgICB0aGlzLm5hbWVTdG9yZSA9IG5hbWVTdG9yZTtcclxuICAgICAgICB0aGlzLnNjckpzb24gPSBzY3JKc29uO1xyXG4gICAgICAgIHRoaXMuc2NyQ2FsbGJhY2sgPSBzY3JDYWxsYmFjaztcclxuICAgICAgICB0aGlzLmpzb24gPSBudWxsO1xyXG4gICAgICAgIHRoaXMuc2NyaXB0ID0gbnVsbDtcclxuXHJcbiAgICAgICAgdGhpcy5kYXRhID0gbnVsbDtcclxuICAgICAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcclxuXHJcbiAgICAgICAgaWYgKCF3aW5kb3cuc3RvcmUpIHdpbmRvdy5zdG9yZSA9IHt9O1xyXG4gICAgfVxyXG5cclxuICAgIHJlcXVlc3QoKSB7XHJcbiAgICAgICAgbGV0IGVycm9yID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHRoaXMuYWRkQ2FsbGJhY2tTY3JpcHQoKTtcclxuXHJcbiAgICAgICAgLy/Qn9GA0L7QvNC40YEg0LbQtNC10YIg0L/QvtC00LPRgNGD0LfQutC4IGNhbGxiYWNrINGE0YPQvdC60YbQuNC4XHJcbiAgICAgICAgbGV0IHByb21pc2VDYWxsYmFja1NjcmlwdCA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc2NyaXB0Lm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc2NyaXB0Lm9uZXJyb3IgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBlcnJvciA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZXJyb3JKc29uJywgdGhpcy5uYW1lU3RvcmUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8v0J/QvtGB0LvQtSDQv9C+0LTQs9GA0YPQt9C60Lgg0YTRg9C90LrRhtC40Lgg0L3QsNGH0LjQvdCw0LXRgtGB0Y8g0LfQsNCz0YDRg9C30LrQsCBqc29ucCDRhNCw0LnQu9CwXHJcbiAgICAgICAgcHJvbWlzZUNhbGxiYWNrU2NyaXB0LnRoZW4oKCkgPT4ge1xyXG5cclxuICAgICAgICAgICAgdGhpcy5hZGRKc29uU2NyaXB0KCk7XHJcbiAgICAgICAgICAgIC8v0J/RgNC+0LzQuNGBINC20LTQtdGCINC30LDQs9GA0YPQt9C60Lgg0YTQsNC50LvQsFxyXG4gICAgICAgICAgICBsZXQgcHJvbWlzZUpzb24gPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmpzb24ub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuanNvbi5vbmVycm9yID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGVycm9yID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZXJyb3JKc29uJywgdGhpcy5uYW1lU3RvcmUpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZUpzb247XHJcbiAgICAgICAgfSkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgIC8vQ2FsbGJhY2sg0YTRg9C90LrRhtC40Y8g0YHQvtGF0YDQsNC90Y/QtdGCINC00LDQvdC90YvQtSDQsiDQs9C70L7QsdCw0LvRjNC90YvQuSDQvtCx0YrQtdC60YIgd2luZG93LnN0b3JlWyduYW1lU3RvcmUnXVxyXG4gICAgICAgICAgICAvL9CjINC60LDQttC00L7QuSDRhNGD0L3QutGG0LjQuCDRgdCy0L7QtSDRgdCy0L7QudGB0YLQstC+INCyINC+0LHRitC10LrRgtC1IHdpbmRvdy5zdG9yZVxyXG4gICAgICAgICAgICB0aGlzLmRhdGEgPSB3aW5kb3cuc3RvcmVbdGhpcy5uYW1lU3RvcmVdO1xyXG4gICAgICAgICAgICB3aW5kb3cuc3RvcmVbdGhpcy5uYW1lU3RvcmVdID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuanNvbi5yZW1vdmUoKTtcclxuICAgICAgICAgICAgdGhpcy5zY3JpcHQucmVtb3ZlKCk7XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvL3NldFRpbWVvdXQg0L7RgtC70LDQstC70LjQstCw0LXRgiDQt9Cw0LPRgNGD0LfQutGDINC00LDQvdC90YvRhSDQuCDQv9C10YDQtdC00LDQtdGCINC00LDQvdC90YvQtSDQsiDQutC70LDRgdGBINGA0L7QtNC40YLQtdC70Y9cclxuICAgICAgICBsZXQgdGltZU91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5kYXRhKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucGFyZW50LmRhdGEgPSB0aGlzLmRhdGE7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYNCk0LDQudC7ICR7dGhpcy5uYW1lU3RvcmV9LCDQvtGI0LjQsdC60LAgNDA0LmApO1xyXG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVPdXQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwgMTAwMClcclxuICAgIH1cclxuXHJcblxyXG4gICAgYWRkSnNvblNjcmlwdCgpIHtcclxuXHJcbiAgICAgICAgdGhpcy5qc29uID0gdGhpcy5hZGRTY3JpcHQodGhpcy5zY3JKc29uKTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRDYWxsYmFja1NjcmlwdCgpIHtcclxuXHJcbiAgICAgICAgdGhpcy5zY3JpcHQgPSB0aGlzLmFkZFNjcmlwdCh0aGlzLnNjckNhbGxiYWNrKTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRTY3JpcHQoc3JjKSB7XHJcbiAgICAgICAgbGV0IHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XHJcbiAgICAgICAgc2NyaXB0LnNyYyA9IHNyYztcclxuICAgICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHNjcmlwdCk7XHJcblxyXG4gICAgICAgIHJldHVybiBzY3JpcHQ7XHJcbiAgICB9XHJcbn1cclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9qcy9Kc29uUC5qc1xuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTmFtZUlucHV0IHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmRpdiA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5pbnB1dCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5lcnJvciA9IG51bGw7XHJcblxyXG4gICAgICAgIC8v0KLQtdC60YHRgiDQvtGI0LjQsdC60LhcclxuICAgICAgICB0aGlzLmVycm9yVGV4dCA9IFwi0JjQvNGPINC80L7QttC10YIg0YHQvtC00LXRgNC20LDRgtGMINGC0L7Qu9GM0LrQviDRgdC40LzQstC+0LvRiyDQutC40YDQuNC70LvQuNGG0YsuINCf0YDQuNC80LXRgDog0KHQtdGA0LPQtdC5XCI7XHJcblxyXG4gICAgICAgIC8v0KDQtdCz0YPQu9GP0YDQvdC+0LUg0LLRi9GA0LDQttC10L3QuNC1INC00LvRjyDQv9GA0L7QstC10YDQutC4INGB0YLRgNC+0LrQuCwg0L/RgNC4INC60LvQuNC60LUg0L3QsCDQutC90L7Qv9C60YMg0JTQvtCx0LDQstC40YLRjFxyXG4gICAgICAgIHRoaXMucmVndWxhclN0cmluZ1ZhbGlkYXRlID0gL15b0JAt0K/QsC3Rj11b0LAt0Y9dKyQvO1xyXG5cclxuICAgICAgICAvL9Cg0LXQs9GD0LvRj9GA0L3QvtC1INCy0YvRgNCw0LbQtdC90LjQtSDQtNC70Y8g0L/RgNC+0LLQtdGA0LrQuCDRgdC40LzQstC+0LvQsCAo0YHQvtCx0YvRgtC40LUga2V5ZG93bilcclxuICAgICAgICB0aGlzLnJlZ3VsYXJTdHJpbmdLZXlkb3duID0gL15b0JAt0K/QsC3Rj10kLztcclxuXHJcbiAgICAgICAgdGhpcy5rZXlkb3duT25JbnB1dCA9IHRoaXMua2V5ZG93bk9uSW5wdXQuYmluZCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVFbGVtZW50KCkge1xyXG4gICAgICAgIGxldCBkaXYgPSB0aGlzLmNyZWF0ZU1haW5EaXYoKTtcclxuICAgICAgICBsZXQgbGFiZWwgPSB0aGlzLmNyZWF0ZUxhYmVsKCk7XHJcbiAgICAgICAgbGV0IGlucHV0ID0gdGhpcy5jcmVhdGVJbnB1dCgpO1xyXG4gICAgICAgIGxldCBlcnJvciA9IHRoaXMuY3JlYXRlRXJyb3IoKTtcclxuXHJcbiAgICAgICAgdGhpcy5pbnB1dCA9IGlucHV0O1xyXG4gICAgICAgIHRoaXMuZXJyb3IgPSBlcnJvcjtcclxuXHJcbiAgICAgICAgdGhpcy5pbnB1dC5vbmtleWRvd24gPSB0aGlzLmtleWRvd25PbklucHV0O1xyXG5cclxuICAgICAgICBkaXYuYXBwZW5kQ2hpbGQobGFiZWwpO1xyXG4gICAgICAgIGRpdi5hcHBlbmRDaGlsZChpbnB1dCk7XHJcbiAgICAgICAgZGl2LmFwcGVuZENoaWxkKGVycm9yKTtcclxuXHJcbiAgICAgICAgdGhpcy5kaXYgPSBkaXY7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlTWFpbkRpdigpIHtcclxuICAgICAgICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgZGl2LmNsYXNzTmFtZSA9IFwiZm9ybS1ncm91cFwiO1xyXG5cclxuICAgICAgICByZXR1cm4gZGl2O1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZUxhYmVsKCkge1xyXG4gICAgICAgIGxldCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XHJcbiAgICAgICAgbGFiZWwuY2xhc3NOYW1lID0gXCJjb250cm9sLWxhYmVsXCI7XHJcbiAgICAgICAgbGFiZWwuaW5uZXJUZXh0ID0gXCLQmNC80Y9cIjtcclxuXHJcbiAgICAgICAgcmV0dXJuIGxhYmVsO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZUlucHV0KCkge1xyXG4gICAgICAgIGxldCBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XHJcbiAgICAgICAgaW5wdXQuY2xhc3NOYW1lID0gXCJmb3JtLWNvbnRyb2xcIjtcclxuICAgICAgICBpbnB1dC50eXBlID0gXCJ0ZXh0XCI7XHJcbiAgICAgICAgaW5wdXQucGxhY2Vob2xkZXIgPSBcItCS0LDRiNC1INCY0LzRj1wiO1xyXG4gICAgICAgIGlucHV0Lm5hbWUgPSBcIm5hbWVcIjtcclxuXHJcbiAgICAgICAgcmV0dXJuIGlucHV0O1xyXG4gICAgfVxyXG5cclxuICAgIGdldElucHV0KCkge1xyXG4gICAgICAgIGlmICghdGhpcy5kaXYpIHRoaXMuY3JlYXRlRWxlbWVudCgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRpdjtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVFcnJvcigpIHtcclxuICAgICAgICBsZXQgZXJyb3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XHJcbiAgICAgICAgZXJyb3IuY2xhc3NOYW1lID0gXCJ0ZXh0LWVycm9yXCI7XHJcbiAgICAgICAgZXJyb3IuaW5uZXJUZXh0ID0gdGhpcy5lcnJvclRleHQ7XHJcbiAgICAgICAgZXJyb3Iuc3R5bGUuY29sb3IgPSBcIiNGRjAwMDBcIjtcclxuICAgICAgICBlcnJvci5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcblxyXG4gICAgICAgIHJldHVybiBlcnJvcjtcclxuICAgIH1cclxuXHJcbiAgICAvL9Cf0YDQvtCy0LXRgNC60LAg0YHRgtGA0L7QutC4XHJcbiAgICB2YWxpZGF0ZSgpIHtcclxuXHJcbiAgICAgICAgbGV0IHN0cmluZyA9IHRoaXMuaW5wdXQudmFsdWU7XHJcbiAgICAgICAgc3RyaW5nID0gc3RyaW5nLnRyaW0oKTtcclxuXHJcbiAgICAgICAgaWYgKHN0cmluZyAmJiB0aGlzLnJlZ3VsYXJTdHJpbmdWYWxpZGF0ZS50ZXN0KHN0cmluZykpIHtcclxuICAgICAgICAgICAgdGhpcy5lcnJvci5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgICAgIHRoaXMuaW5wdXQuc3R5bGUuYm9yZGVyQ29sb3IgPSBcIiNjY2NjY2NcIjtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvL9CV0YHQu9C4INGB0YLRgNC+0LrQsCDQvdC1INC/0YDQvtGI0LvQsCDQv9GA0L7QstC10YDQutGDLCDRgtC+INC/0L7QutCw0LfRi9Cy0LDQtdC8INC+0YjQuNCx0LrRg1xyXG4gICAgICAgICAgICB0aGlzLmVycm9yLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgICAgICAgICAgIHRoaXMuaW5wdXQuc3R5bGUuYm9yZGVyQ29sb3IgPSBcIiNGRjAwMDBcIjtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8v0J7QsdGA0LDQsdC+0YLRh9C40Log0YHQvtCx0YvRgtC40Y8ga2V5ZG93blxyXG4gICAga2V5ZG93bk9uSW5wdXQoZXZlbnQpIHtcclxuXHJcbiAgICAgICAgbGV0IGtleSA9IGV2ZW50LmtleTtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLnJlZ3VsYXJTdHJpbmdLZXlkb3duIHx8IGV2ZW50LmtleUNvZGUgPCAzMikgcmV0dXJuIHRydWU7XHJcblxyXG4gICAgICAgIGlmIChrZXkgJiYgdGhpcy5yZWd1bGFyU3RyaW5nS2V5ZG93bikge1xyXG4gICAgICAgICAgICAvL9Cf0YDQvtCy0LXRgNC60LAsINGB0L7QvtGC0LLQtdGC0YHRj9Cy0YPQtdGCINC70Lgg0YHQuNC80LLQvtC7INGA0LXQs9GD0LvRj9GA0L3QvtC80YMg0LLRi9GA0LDQttC10L3QuNGOXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlZ3VsYXJTdHJpbmdLZXlkb3duLnRlc3Qoa2V5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxufTtcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9qcy9mb3JtL05hbWVJbnB1dC5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XHJcblxyXG4vL9Ca0LvQsNGB0YEg0YHQvtC30LTQsNC90LjRjyDRgdC10LvQtdC60YIg0LHQvtC60YHQsFxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZWxlY3RCb3gge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG5hbWUsIG5hbWVBdHRyaWJ1dGUsIGFycmF5LCBvbkNoYW5nZSkge1xyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICAgICAgdGhpcy5uYW1lQXR0cmlidXRlID0gbmFtZUF0dHJpYnV0ZTtcclxuICAgICAgICB0aGlzLmFycmF5ID0gYXJyYXk7XHJcblxyXG4gICAgICAgIGlmIChvbkNoYW5nZSkgdGhpcy5vbkNoYW5nZSA9IG9uQ2hhbmdlO1xyXG5cclxuICAgICAgICB0aGlzLmRpdiA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlRWxlbWVudCgpIHtcclxuICAgICAgICBsZXQgZGl2ID0gdGhpcy5jcmVhdGVNYWluRGl2KCk7XHJcbiAgICAgICAgbGV0IGxhYmVsID0gdGhpcy5jcmVhdGVMYWJlbCgpO1xyXG4gICAgICAgIGxldCBzZWxlY3QgPSB0aGlzLmNyZWF0ZVNlbGVjdCgpO1xyXG5cclxuICAgICAgICBkaXYuYXBwZW5kQ2hpbGQobGFiZWwpO1xyXG4gICAgICAgIGRpdi5hcHBlbmRDaGlsZChzZWxlY3QpO1xyXG5cclxuICAgICAgICB0aGlzLmRpdiA9IGRpdjtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVNYWluRGl2KCkge1xyXG4gICAgICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBkaXYuY2xhc3NOYW1lID0gXCJmb3JtLWdyb3VwIGNvbC1sZy02IGNvbC1tZC02IGNvbC1zbS00XCI7XHJcblxyXG4gICAgICAgIHJldHVybiBkaXY7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlTGFiZWwoKSB7XHJcbiAgICAgICAgbGV0IGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcclxuICAgICAgICBsYWJlbC5jbGFzc05hbWUgPSBcImNvbnRyb2wtbGFiZWxcIjtcclxuICAgICAgICBsYWJlbC5pbm5lclRleHQgPSB0aGlzLm5hbWU7XHJcblxyXG4gICAgICAgIHJldHVybiBsYWJlbDtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVTZWxlY3QoKSB7XHJcbiAgICAgICAgbGV0IHNlbGVjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NlbGVjdCcpO1xyXG4gICAgICAgIHNlbGVjdC5jbGFzc05hbWUgPSBcInNlbGVjdHBpY2tlciBpbnB1dC1zbVwiO1xyXG4gICAgICAgIHNlbGVjdC5uYW1lID0gdGhpcy5uYW1lQXR0cmlidXRlO1xyXG4gICAgICAgIGZvciAobGV0IGVsZW1lbnQgaW4gdGhpcy5hcnJheSkge1xyXG4gICAgICAgICAgICBsZXQgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XHJcbiAgICAgICAgICAgIG9wdGlvbi5pbm5lclRleHQgPSB0aGlzLmFycmF5W2VsZW1lbnRdO1xyXG4gICAgICAgICAgICBvcHRpb24udmFsdWUgPSBlbGVtZW50O1xyXG5cclxuICAgICAgICAgICAgc2VsZWN0LmFwcGVuZENoaWxkKG9wdGlvbik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5vbkNoYW5nZSkgc2VsZWN0Lm9uY2hhbmdlID0gdGhpcy5vbkNoYW5nZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNlbGVjdDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRTZWxlY3RCb3goKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmRpdikgdGhpcy5jcmVhdGVFbGVtZW50KCk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmRpdjtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVMaXN0KGFycmF5KSB7XHJcblxyXG4gICAgICAgIGlmIChhcnJheSkge1xyXG4gICAgICAgICAgICB0aGlzLmFycmF5ID0gYXJyYXk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmRpdi5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2VsZWN0JylbMF0ucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIGxldCBzZWxlY3QgPSB0aGlzLmNyZWF0ZVNlbGVjdCgpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5kaXYuYXBwZW5kQ2hpbGQoc2VsZWN0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY2xlYXJMaXN0KCkge1xyXG4gICAgICAgIHRoaXMuYXJyYXkgPSBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLmRpdi5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2VsZWN0JylbMF0ucmVtb3ZlKCk7XHJcbiAgICAgICAgbGV0IHNlbGVjdCA9IHRoaXMuY3JlYXRlU2VsZWN0KCk7XHJcblxyXG4gICAgICAgIHRoaXMuZGl2LmFwcGVuZENoaWxkKHNlbGVjdCk7XHJcbiAgICB9XHJcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2pzL2Zvcm0vU2VsZWN0Qm94LmpzXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmltcG9ydCBGb3JtIGZyb20gXCIuL0Zvcm1cIjtcclxuaW1wb3J0IFRhYmxlIGZyb20gXCIuL1RhYmxlXCI7XHJcblxyXG4vL9Ck0YPQvdC60YbQuNGPINGD0LTQsNC70Y/QtdGCINC60L3QvtC/0LrQuCwg0YHQvtC30LTQsNC10YIg0YTQvtGA0LzRgyDQuCDRgtCw0LHQu9C40YbRgy5cclxuLy/QnNC10YLQvtC0IGNyZWF0ZUVsZW1lbnQoKSDRgdC+0LfQtNCw0LXRgiDRjdC70LXQvNC10L3RgiDQuCDQv9C+0LzQtdGJ0LDQtdGCINC10LPQviDQsiBkb20g0LzQvtC00LXQu9GMXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNyZWF0ZUZvcm1BbmRUYWJsZShldmVudCkge1xyXG5cclxuICAgIGV2ZW50LmN1cnJlbnRUYXJnZXQucmVtb3ZlKCk7XHJcblxyXG4gICAgbGV0IGRpdkZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZm9ybScpO1xyXG4gICAgbGV0IGZvcm0gPSBuZXcgRm9ybShkaXZGb3JtKTtcclxuICAgIGZvcm0uY3JlYXRlRWxlbWVudCgpO1xyXG5cclxuICAgIGxldCBkaXZUYWJsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YWJsZScpO1xyXG4gICAgbGV0IHRhYmxlID0gbmV3IFRhYmxlKGRpdlRhYmxlKTtcclxuICAgIHRhYmxlLmNyZWF0ZVRhYmxlKCk7XHJcblxyXG4gICAgZm9ybS5zZXRUYWJsZSh0YWJsZSk7XHJcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2pzL2NyZWF0ZUZvcm1BbmRUYWJsZS5qc1xuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XHJcblxyXG5pbXBvcnQgTmFtZUlucHV0IGZyb20gXCIuL2Zvcm0vTmFtZUlucHV0XCI7XHJcbmltcG9ydCBFbWFpbElucHV0IGZyb20gXCIuL2Zvcm0vRW1haWxJbnB1dFwiO1xyXG5pbXBvcnQgUGhvbmVJbnB1dCBmcm9tIFwiLi9mb3JtL1Bob25lSW5wdXRcIjtcclxuaW1wb3J0IFNlbGVjdEJveENvdW50cmllcyBmcm9tIFwiLi9mb3JtL1NlbGVjdEJveENvdW50cmllc1wiO1xyXG5pbXBvcnQgU2VsZWN0Qm94Q2l0aWVzIGZyb20gXCIuL2Zvcm0vU2VsZWN0Qm94Q2l0aWVzXCI7XHJcbmltcG9ydCBCdXR0b25zR3JvdXAgZnJvbSBcIi4vZm9ybS9CdXR0b25zR3JvdXBcIjtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGb3JtIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwYXJlbnRFbGVtZW50LCB0YWJsZSkge1xyXG5cclxuICAgICAgICB0aGlzLnBhcmVudEVsZW1lbnQgPSBwYXJlbnRFbGVtZW50O1xyXG5cclxuICAgICAgICB0aGlzLmRpdiA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5mb3JtID0gbnVsbDtcclxuXHJcbiAgICAgICAgdGhpcy50YWJsZSA9IHRhYmxlO1xyXG5cclxuICAgICAgICB0aGlzLm5hbWUgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuZW1haWwgPSBudWxsO1xyXG4gICAgICAgIHRoaXMucGhvbmUgPSBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLmJ1dHRvbnNHcm91cCA9IG51bGw7XHJcblxyXG5cclxuICAgICAgICB0aGlzLmNsaWNrT25CdXR0b25BZGQgPSB0aGlzLmNsaWNrT25CdXR0b25BZGQuYmluZCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVFbGVtZW50KCkge1xyXG5cclxuICAgICAgICBsZXQgZGl2ID0gdGhpcy5jcmVhdGVNYWluRGl2KCk7XHJcblxyXG4gICAgICAgIGxldCBmb3JtID0gdGhpcy5jcmVhdGVGb3JtKCk7XHJcbiAgICAgICAgdGhpcy5mb3JtID0gZm9ybTtcclxuXHJcbiAgICAgICAgbGV0IG5hbWVJbnB1dCA9IG5ldyBOYW1lSW5wdXQoKTtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lSW5wdXQ7XHJcbiAgICAgICAgbmFtZUlucHV0ID0gbmFtZUlucHV0LmdldElucHV0KCk7XHJcblxyXG4gICAgICAgIGxldCBlbWFpbElucHV0ID0gbmV3IEVtYWlsSW5wdXQoKTtcclxuICAgICAgICB0aGlzLmVtYWlsID0gZW1haWxJbnB1dDtcclxuICAgICAgICBlbWFpbElucHV0ID0gZW1haWxJbnB1dC5nZXRJbnB1dCgpO1xyXG5cclxuICAgICAgICBsZXQgcGhvbmVJbnB1dCA9IG5ldyBQaG9uZUlucHV0KCk7XHJcbiAgICAgICAgdGhpcy5waG9uZSA9IHBob25lSW5wdXQ7XHJcbiAgICAgICAgcGhvbmVJbnB1dCA9IHBob25lSW5wdXQuZ2V0SW5wdXQoKTtcclxuXHJcbiAgICAgICAgbGV0IHNlbGVjdEJveGVzID0gdGhpcy5jcmVhdGVTZWxlY3RCb3hlcygpO1xyXG5cclxuICAgICAgICBsZXQgYnV0dG9uc0dyb3VwID0gbmV3IEJ1dHRvbnNHcm91cCgpO1xyXG4gICAgICAgIHRoaXMuYnV0dG9uc0dyb3VwID0gYnV0dG9uc0dyb3VwO1xyXG4gICAgICAgIGJ1dHRvbnNHcm91cCA9IGJ1dHRvbnNHcm91cC5nZXRFbGVtZW50KCk7XHJcblxyXG4gICAgICAgIGZvcm0uYXBwZW5kQ2hpbGQobmFtZUlucHV0KTtcclxuICAgICAgICBmb3JtLmFwcGVuZENoaWxkKGVtYWlsSW5wdXQpO1xyXG4gICAgICAgIGZvcm0uYXBwZW5kQ2hpbGQocGhvbmVJbnB1dCk7XHJcbiAgICAgICAgZm9ybS5hcHBlbmRDaGlsZChzZWxlY3RCb3hlcyk7XHJcbiAgICAgICAgZm9ybS5hcHBlbmRDaGlsZChidXR0b25zR3JvdXApO1xyXG5cclxuICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoZm9ybSk7XHJcblxyXG4gICAgICAgIHRoaXMuZGl2ID0gZGl2O1xyXG5cclxuICAgICAgICB0aGlzLnJlbW92ZUZvcm0oKTtcclxuICAgICAgICB0aGlzLnBhcmVudEVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5kaXYpO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZU1haW5EaXYoKSB7XHJcbiAgICAgICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGRpdi5jbGFzc05hbWUgPSBcImNvbnRhaW5lclwiO1xyXG5cclxuICAgICAgICByZXR1cm4gZGl2O1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZUZvcm0oKSB7XHJcbiAgICAgICAgbGV0IGZvcm0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdmb3JtJyk7XHJcbiAgICAgICAgZm9ybS5jbGFzc05hbWUgPSBcImZvcm0taG9yaXpvbnRhbCBjb2wtbGctOFwiO1xyXG4gICAgICAgIGZvcm0ucm9sZSA9IFwiZm9ybVwiO1xyXG5cclxuICAgICAgICByZXR1cm4gZm9ybTtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVTZWxlY3RCb3hlcygpIHtcclxuICAgICAgICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgZGl2LmNsYXNzTmFtZSA9IFwicm93XCI7XHJcblxyXG4gICAgICAgIGxldCBzZWxlY3RCb3hDb3VudHJpZXMgPSBuZXcgU2VsZWN0Qm94Q291bnRyaWVzKCk7XHJcblxyXG4gICAgICAgIGxldCBzZWxlY3RCb3hDaXRpZXMgPSBuZXcgU2VsZWN0Qm94Q2l0aWVzKCk7XHJcblxyXG4gICAgICAgIHNlbGVjdEJveENvdW50cmllcy5zZXRTZWxlY3RCb3hDaXRpZXMoc2VsZWN0Qm94Q2l0aWVzKTtcclxuXHJcbiAgICAgICAgZGl2LmFwcGVuZENoaWxkKHNlbGVjdEJveENvdW50cmllcy5nZXRTZWxlY3RCb3goKSk7XHJcbiAgICAgICAgZGl2LmFwcGVuZENoaWxkKHNlbGVjdEJveENpdGllcy5nZXRTZWxlY3RCb3goKSk7XHJcblxyXG4gICAgICAgIHJldHVybiBkaXZcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVFbGVtZW50KCkge1xyXG4gICAgICAgIHRoaXMuY3JlYXRlRWxlbWVudCgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRpdjtcclxuICAgIH1cclxuXHJcbiAgICAvL9Cc0LXRgtC+0LQg0YHQstGP0LfRi9Cy0LDQtdGCINGE0L7RgNC80YMg0YEg0YLQsNCx0LvQuNGG0LXQuVxyXG4gICAgc2V0VGFibGUodGFibGUpIHtcclxuXHJcbiAgICAgICAgdGhpcy50YWJsZSA9IHRhYmxlO1xyXG4gICAgICAgIHRoaXMucGFyZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yKCdbbmFtZT1cImFkZFwiXScpLm9uY2xpY2sgPSB0aGlzLmNsaWNrT25CdXR0b25BZGQ7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZUZvcm0oKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucGFyZW50RWxlbWVudC5maXJzdEVsZW1lbnRDaGlsZCkge1xyXG4gICAgICAgICAgICB0aGlzLnBhcmVudEVsZW1lbnQuZmlyc3RFbGVtZW50Q2hpbGQucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8v0KHQvtCx0YvRgtC40LUgY2xpY2sg0L3QsCDQutC90L7Qv9C60LUg0LTQvtCx0LDQstC70LXQvdC40Y9cclxuICAgIGNsaWNrT25CdXR0b25BZGQoZXZlbnQpIHtcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy50YWJsZSAmJiB0aGlzLnZhbGlkYXRlKCkpIHtcclxuXHJcbiAgICAgICAgICAgIGxldCBuYW1lID0gdGhpcy5wYXJlbnRFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tuYW1lPVwibmFtZVwiXScpLnZhbHVlO1xyXG4gICAgICAgICAgICBsZXQgZW1haWwgPSB0aGlzLnBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvcignW25hbWU9XCJlbWFpbFwiXScpLnZhbHVlO1xyXG4gICAgICAgICAgICBsZXQgcGhvbmUgPSB0aGlzLnBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvcignW25hbWU9XCJwaG9uZVwiXScpLnZhbHVlO1xyXG5cclxuICAgICAgICAgICAgbGV0IGNvdW50cnkgPSB0aGlzLnBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvcignW25hbWU9XCJjb3VudHJpZXNcIl0nKTtcclxuICAgICAgICAgICAgbGV0IHNlbGVjdGVkSW5kZXggPSBjb3VudHJ5LnNlbGVjdGVkSW5kZXg7XHJcbiAgICAgICAgICAgIGNvdW50cnkgPSBjb3VudHJ5Lm9wdGlvbnNbc2VsZWN0ZWRJbmRleF0udGV4dDtcclxuXHJcblxyXG4gICAgICAgICAgICBsZXQgY2l0eSA9IHRoaXMucGFyZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yKCdbbmFtZT1cImNpdGllc1wiXScpO1xyXG4gICAgICAgICAgICBzZWxlY3RlZEluZGV4ID0gY2l0eS5zZWxlY3RlZEluZGV4O1xyXG4gICAgICAgICAgICBjaXR5ID0gY2l0eS5vcHRpb25zW3NlbGVjdGVkSW5kZXhdLnRleHQ7XHJcblxyXG4gICAgICAgICAgICBsZXQgdXNlciA9XHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWQ6IG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogbmFtZSxcclxuICAgICAgICAgICAgICAgICAgICBlbWFpbDogZW1haWwsXHJcbiAgICAgICAgICAgICAgICAgICAgcGhvbmU6IHBob25lLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvdW50cnk6IGNvdW50cnksXHJcbiAgICAgICAgICAgICAgICAgICAgY2l0eTogY2l0eVxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMudGFibGUuYWRkUm93KHVzZXIpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5idXR0b25zR3JvdXAuY2xpY2tSZXNldCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvL9CS0LDQu9C40LTQsNGG0LjRjyDQuNC90L/Rg9GC0L7QslxyXG4gICAgdmFsaWRhdGUoKSB7XHJcblxyXG4gICAgICAgIGxldCB2YWxpZGUgPSB0cnVlO1xyXG5cclxuICAgICAgICB2YWxpZGUgPSB0aGlzLm5hbWUudmFsaWRhdGUoKSAmJiB2YWxpZGU7XHJcbiAgICAgICAgdmFsaWRlID0gdGhpcy5lbWFpbC52YWxpZGF0ZSgpICYmIHZhbGlkZTtcclxuICAgICAgICB2YWxpZGUgPSB0aGlzLnBob25lLnZhbGlkYXRlKCkgJiYgdmFsaWRlO1xyXG5cclxuICAgICAgICByZXR1cm4gdmFsaWRlO1xyXG4gICAgfVxyXG59XHJcblxyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2pzL0Zvcm0uanNcbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuaW1wb3J0IEpzb25QIGZyb20gXCIuL0pzb25QXCI7XHJcbmltcG9ydCBQYW5lbFVzZXIgZnJvbSBcIi4vVGFibGUvUGFuZWxVc2VyXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUYWJsZSB7XHJcblxyXG4gICAgY29uc3RydWN0b3IocGFyZW50RWxlbWVudCkge1xyXG5cclxuICAgICAgICB0aGlzLnVzZXJzID0gbnVsbDtcclxuICAgICAgICB0aGlzLnBhcmVudEVsZW1lbnQgPSBwYXJlbnRFbGVtZW50O1xyXG5cclxuICAgICAgICAvL9Ci0LDQsdC70LjRhtCwINGB0L4g0LLRgdC10LzQuCDQv9C+0LvRjNC30L7QstCw0YLQtdC70Y/QvNC4XHJcbiAgICAgICAgdGhpcy50YWJsZSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5yb3dzID0gbnVsbDtcclxuXHJcbiAgICAgICAgLy/QotCw0LHQu9C40YbQsCDRgSDQvtC00L3QuNC8INC/0L7Qu9GM0LfQvtCy0LDRgtC10LvQtdC8XHJcbiAgICAgICAgdGhpcy51c2VyID0gbnVsbDtcclxuXHJcbiAgICAgICAgLy/QntCx0YrQtdC60YIg0YEg0YHRgtC+0LvQsdGG0LDQvNC4LCDQutC+0YLQvtGA0YvQtSDQvdGD0LbQvdC+INC+0YLQvtCx0YDQsNC30LjRgtGMINCyINGC0LDQsdC70LjRhtC1XHJcbiAgICAgICAgdGhpcy5oZWFkID0ge1xyXG4gICAgICAgICAgICBpZDogXCLihJZcIixcclxuICAgICAgICAgICAgbmFtZTogXCLQmNC80Y9cIixcclxuICAgICAgICAgICAgZW1haWw6IFwiRW1haWxcIlxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8v0J7QsdGK0LXQutGCINGBINC60LvRjtGH0LXQvCDRgdC+0YDRgtC40YDQvtCy0LrQuFxyXG4gICAgICAgIHRoaXMuc29ydCA9IHtcclxuICAgICAgICAgICAga2V5OlwiaWRcIlxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuY2xpY2tPblJvdyA9IHRoaXMuY2xpY2tPblJvdy5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuY2xpY2tPbkhlYWRPZkNvbHVtbiA9IHRoaXMuY2xpY2tPbkhlYWRPZkNvbHVtbi5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuc29ydEFycmF5QnlLZXkgPSB0aGlzLnNvcnRBcnJheUJ5S2V5LmJpbmQodGhpcyk7XHJcblxyXG4gICAgICAgIHRoaXMuYmFja0hpc3RvcnkgPSB0aGlzLmJhY2tIaXN0b3J5LmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5rZXlCYWNrc3BhY2UgPSB0aGlzLmtleUJhY2tzcGFjZS5iaW5kKHRoaXMpO1xyXG5cclxuICAgICAgICBoaXN0b3J5LnJlcGxhY2VTdGF0ZSh7dXNlcjpmYWxzZX0sICcnLCAnJyk7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlVGFibGUoKSB7XHJcblxyXG4gICAgICAgIGxldCB0YWJsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RhYmxlJyk7XHJcbiAgICAgICAgdGFibGUuY2xhc3NOYW1lID0gXCJ0YWJsZVwiO1xyXG5cclxuICAgICAgICBsZXQgdGhlYWQgPSB0aGlzLmNyZWF0ZUhlYWQoKTtcclxuICAgICAgICBsZXQgcm93cyA9IHRoaXMuY3JlYXRlUm93QWxsKCk7XHJcblxyXG5cclxuXHJcbiAgICAgICAgaWYgKHJvd3MpIHtcclxuICAgICAgICAgICAgdGFibGUuYXBwZW5kQ2hpbGQodGhlYWQpO1xyXG4gICAgICAgICAgICB0YWJsZS5hcHBlbmRDaGlsZChyb3dzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgZGl2TWVzc2FnZSA9IHRoaXMuY3JlYXRlTWVzc2FnZURvd25sb2FkKCk7XHJcbiAgICAgICAgICAgIHRhYmxlLmFwcGVuZENoaWxkKGRpdk1lc3NhZ2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy50YWJsZSA9IHRhYmxlO1xyXG4gICAgICAgIHRoaXMuZGl2ID0gdGFibGU7XHJcblxyXG4gICAgICAgIHRoaXMucmVtb3ZlVGFibGUoKTtcclxuICAgICAgICB0aGlzLnBhcmVudEVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy50YWJsZSk7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlSGVhZCgpIHtcclxuXHJcbiAgICAgICAgbGV0IHRoZWFkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGhlYWQnKTtcclxuXHJcbiAgICAgICAgbGV0IHRyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndHInKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgY29sdW0gaW4gdGhpcy5oZWFkKSB7XHJcbiAgICAgICAgICAgIGxldCB0aCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RoJyk7XHJcblxyXG4gICAgICAgICAgICB0aC5pbm5lclRleHQgPSB0aGlzLmhlYWRbY29sdW1dO1xyXG4gICAgICAgICAgICB0aC5pZCA9IGBDb2x1bW4tJHtjb2x1bX1gO1xyXG4gICAgICAgICAgICB0aC5zdHlsZS5jdXJzb3IgPSAncG9pbnRlcic7XHJcbiAgICAgICAgICAgIHRoLm9uY2xpY2sgPSB0aGlzLmNsaWNrT25IZWFkT2ZDb2x1bW47XHJcblxyXG4gICAgICAgICAgICB0ci5hcHBlbmRDaGlsZCh0aCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGVhZC5hcHBlbmRDaGlsZCh0cik7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGVhZDtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVSb3dBbGwoKSB7XHJcbiAgICAgICAgbGV0IHRib2R5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGJvZHknKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY2hlY2tVc2VycygpKSB7XHJcbiAgICAgICAgICAgIHRoaXMudXNlcnMuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IHRyID0gdGhpcy5jcmVhdGVSb3dPbmUoZWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgICB0Ym9keS5hcHBlbmRDaGlsZCh0cik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5yb3dzID0gdGJvZHk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGJvZHk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVSb3dPbmUoY29sdW1ucykge1xyXG5cclxuICAgICAgICBsZXQgdHIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0cicpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBjb2x1bSBpbiB0aGlzLmhlYWQpIHtcclxuICAgICAgICAgICAgbGV0IHRoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGgnKTtcclxuICAgICAgICAgICAgdGguaW5uZXJUZXh0ID0gY29sdW1uc1tjb2x1bV07XHJcblxyXG4gICAgICAgICAgICB0ci5hcHBlbmRDaGlsZCh0aCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0ci5pZCA9IGByb3cke2NvbHVtbnMuaWR9YDtcclxuICAgICAgICB0ci5zdHlsZS5jdXJzb3IgPSBcInBvaW50ZXJcIjtcclxuICAgICAgICB0ci5vbmNsaWNrID0gdGhpcy5jbGlja09uUm93O1xyXG5cclxuICAgICAgICByZXR1cm4gdHI7XHJcbiAgICB9XHJcblxyXG4gICAgY2hlY2tVc2VycygpIHtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLnVzZXJzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWpheFJlcXVlc3RVc2VycygpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVNZXNzYWdlRG93bmxvYWQoKXtcclxuXHJcbiAgICAgICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGRpdi5jbGFzc05hbWUgPSBcImFsZXJ0IGFsZXJ0LWluZm9cIjtcclxuICAgICAgICBkaXYuaW5uZXJUZXh0ID0gXCLQl9Cw0LPRgNGD0LfQutCwINGC0LDQsdC70LjRhtGLXCI7XHJcblxyXG4gICAgICAgIHJldHVybiBkaXY7XHJcbiAgICB9XHJcblxyXG4gICAgYWpheFJlcXVlc3RVc2VycygpIHtcclxuXHJcbiAgICAgICAgLy/Qn9GA0L7QvNC40YEg0LbQtNC10YIg0L/QvtC00LPRgNGD0LfQutC4INC00LDQvdC90YvRhVxyXG4gICAgICAgIGxldCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBuZXcgSnNvblAoXCJodHRwOi8vdGlraG9taXJvdi1zZXJnZXkucnUvZGF0YS9Vc2Vycy91c2Vycy5qc29uXCIsIFwiaHR0cDovL3Rpa2hvbWlyb3Ytc2VyZ2V5LnJ1L2pzL2pzb25QL3VzZXJzLmpzXCIsIHRoaXMsICd1c2VycycpLnJlcXVlc3QoKTtcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kYXRhKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXNlcnMgPSB0aGlzLmRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LCAxMDAwKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy/QmtCw0Log0LTQsNC90L3Ri9C1INC30LDQs9GA0YPQt9C40LvQuNGB0YwsINGA0LjRgdGD0LXRgiDRgtCw0LHQu9C40YbRg1xyXG4gICAgICAgIHByb21pc2UudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50YWJsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlRWxlbWVudCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVFbGVtZW50KCkge1xyXG5cclxuICAgICAgICB0aGlzLmNyZWF0ZVRhYmxlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudGFibGU7XHJcbiAgICB9XHJcblxyXG4gICAgLy/QlNC+0LHQsNCy0LvQtdC90LjQtSDRgdGC0YDQvtC60LhcclxuICAgIGFkZFJvdyhjb2x1bW5zKSB7XHJcblxyXG4gICAgICAgIGxldCBsZW5ndGggPSB0aGlzLnVzZXJzLmxlbmd0aDtcclxuICAgICAgICBjb2x1bW5zWydpZCddID0gbGVuZ3RoICsgMTtcclxuXHJcbiAgICAgICAgdGhpcy51c2Vycy5wdXNoKGNvbHVtbnMpO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlVGFibGUoKTtcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmVUYWJsZSgpIHtcclxuICAgICAgICBpZiAodGhpcy5wYXJlbnRFbGVtZW50LmZpcnN0RWxlbWVudENoaWxkKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGFyZW50RWxlbWVudC5maXJzdEVsZW1lbnRDaGlsZC5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy/QodC+0LHRi9GC0LjQtSwg0LrQu9C40Log0L/QviDRgdGC0YDQvtC60LUsINGB0L7Qt9C00LDQtdGCINGC0LDQsdC70LjRhtGDINGBINC+0LTQvdC40Lwg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9C10Lwg0Lgg0L/QvtC60LDQt9GL0LLQsNC10YIg0LXRkVxyXG4gICAgY2xpY2tPblJvdyhldmVudCl7XHJcblxyXG4gICAgICAgIGxldCByZWd1bGFyU3RyaW5nID0gL1xcZCskLztcclxuICAgICAgICBsZXQgaWQgPSBldmVudC5jdXJyZW50VGFyZ2V0LmlkO1xyXG5cclxuICAgICAgICBpZCA9IHJlZ3VsYXJTdHJpbmcuZXhlYyhpZCk7XHJcblxyXG4gICAgICAgIGlmKGlkKXtcclxuXHJcbiAgICAgICAgICAgIGxldCB1c2VyID0gdGhpcy5zZWFyY2hVc2VyKGlkKTtcclxuICAgICAgICAgICAgbGV0IHBhbmVsID0gbmV3IFBhbmVsVXNlcih1c2VyLCB0aGlzKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMudXNlciA9IHBhbmVsO1xyXG4gICAgICAgICAgICB0aGlzLnNob3dVc2VyKCk7XHJcblxyXG4gICAgICAgICAgICBoaXN0b3J5LnB1c2hTdGF0ZSh7dXNlcjp0cnVlfSwgJycsICcnKTtcclxuXHJcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicG9wc3RhdGVcIiwgdGhpcy5iYWNrSGlzdG9yeSwgZmFsc2UpO1xyXG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgdGhpcy5rZXlCYWNrc3BhY2UsIGZhbHNlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy/QodC+0LHRi9GC0LjQtSwg0LrQu9C40Log0L3QsCDQt9Cw0LPQvtC70L7QstC+0Log0YHRgtC+0LvQsdGG0LAsINGB0L7RgNGC0LjRgNGD0LXRgiDRgdGC0YDQvtC60LguXHJcbiAgICBjbGlja09uSGVhZE9mQ29sdW1uKGV2ZW50KXtcclxuXHJcbiAgICAgICAgbGV0IGNvbHVtbklkID0gZXZlbnQuY3VycmVudFRhcmdldC5pZDtcclxuXHJcbiAgICAgICAgbGV0IHJlZ3VsYXIgPSAvQ29sdW1uLShcXHcrKS87XHJcbiAgICAgICAgbGV0IG5hbWVDb2x1bW4gPSBjb2x1bW5JZC5tYXRjaChyZWd1bGFyKVsxXTtcclxuXHJcbiAgICAgICAgaWYodGhpcy5zb3J0LmtleSAhPT0gbmFtZUNvbHVtbil7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnNvcnQua2V5ID0gbmFtZUNvbHVtbjtcclxuICAgICAgICAgICAgdGhpcy51c2Vycy5zb3J0KHRoaXMuc29ydEFycmF5QnlLZXkpO1xyXG5cclxuICAgICAgICB9ZWxzZSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnVzZXJzLnJldmVyc2UoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlUm93cygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8v0J/QvtC40YHQuiDQv9C+0LvRjNC30L7QstCw0YLQtdC70Y8g0L/QviBpZFxyXG4gICAgc2VhcmNoVXNlcihpZCl7XHJcblxyXG4gICAgICAgIGZvcihsZXQga2V5IGluIHRoaXMudXNlcnMpe1xyXG5cclxuICAgICAgICAgICAgbGV0IHVzZXIgPSB0aGlzLnVzZXJzW2tleV07XHJcblxyXG4gICAgICAgICAgICBpZih1c2VyLmlkID09IGlkKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiB1c2VyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhcItCf0L7Qu9GM0LfQvtCy0LDRgtC10LvRjCDQvdC1INC90LDQudC00LXQvVwiKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8v0J/QvtC60LDQt9GL0LLQsNC10YIg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GPXHJcbiAgICBzaG93VXNlcigpe1xyXG5cclxuICAgICAgICBpZih0aGlzLnVzZXIuZ2V0UGFuZWwoKSl7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnRhYmxlLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLnBhcmVudEVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy51c2VyLmdldFBhbmVsKCkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvL9Cf0L7QutCw0LfRi9Cy0LDQtdGCINGC0LDQsdC70LjRhtGDXHJcbiAgICBzaG93VGFibGUoKXtcclxuXHJcbiAgICAgICAgaWYodGhpcy50YWJsZSl7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnBhcmVudEVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy50YWJsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8v0J7QsdC90L7QstC70Y/QtdGCINGB0YLRgNC+0LrQuCAo0L/QvtGB0LvQtSDRgdC+0YDRgtC40YDQvtCy0LrQuClcclxuICAgIHVwZGF0ZVJvd3MoKXtcclxuXHJcbiAgICAgICAgdGhpcy5yb3dzLnJlbW92ZSgpO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlUm93QWxsKCk7XHJcbiAgICAgICAgdGhpcy50YWJsZS5hcHBlbmRDaGlsZCh0aGlzLnJvd3MpO1xyXG4gICAgfVxyXG5cclxuICAgIC8v0KTRg9C90LrRhtC40Y8g0LTQu9GPINGB0L7RgNGC0LjRgNC+0LLQutC4INC80LDRgdGB0LjQstCwXHJcbiAgICBzb3J0QXJyYXlCeUtleShhLGIpe1xyXG5cclxuICAgICAgICBsZXQga2V5ID0gdGhpcy5zb3J0WydrZXknXTtcclxuICAgICAgICBpZihhW2tleV0gPiBiW2tleV0pIHJldHVybiAxO1xyXG4gICAgICAgIHJldHVybiAtMTtcclxuICAgIH1cclxuXHJcbiAgICAvL9Ch0L7QsdGL0YLQuNC1LCDQutC90L7Qv9C60LAg0L3QsNC30LDQtCDQsdGA0LDRg9C30LXRgNCwXHJcbiAgICBiYWNrSGlzdG9yeShldmVudCl7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKGV2ZW50LnN0YXRlKTtcclxuICAgICAgICBpZihldmVudC5zdGF0ZS51c2VyID09PSBmYWxzZSl7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnVzZXIuY2xpY2tPbkJ1dHRvbkJhY2soKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKGV2ZW50LnN0YXRlLnVzZXIgPT09IHRydWUpe1xyXG5cclxuICAgICAgICAgICAgdGhpcy5zaG93VXNlcigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvL9Ca0L3QvtC/0LrQsCBCYWNrc3BhY2VcclxuICAgIGtleUJhY2tzcGFjZShldmVudCl7XHJcblxyXG4gICAgICAgIGlmKGV2ZW50LmtleUNvZGUgPT09IDgpe1xyXG5cclxuICAgICAgICAgICAgdGhpcy51c2VyLmNsaWNrT25CdXR0b25CYWNrKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9qcy9UYWJsZS5qc1xuLy8gbW9kdWxlIGlkID0gNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYW5lbFVzZXIge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHVzZXIsIHBhcmVudCkge1xyXG5cclxuICAgICAgICB0aGlzLnVzZXIgPSB1c2VyO1xyXG4gICAgICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xyXG5cclxuICAgICAgICB0aGlzLmRpdiA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5idXR0b24gPSBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLmNsaWNrT25CdXR0b25CYWNrID0gdGhpcy5jbGlja09uQnV0dG9uQmFjay5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZVBhbmVsKCkge1xyXG5cclxuICAgICAgICBpZiAodGhpcy51c2VyKSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgZGl2ID0gdGhpcy5jcmVhdGVNYWluRGl2KCk7XHJcbiAgICAgICAgICAgIGxldCBoZWFkaW5nID0gdGhpcy5jcmVhdGVIZWFkaW5nKCk7XHJcbiAgICAgICAgICAgIGxldCBib2R5ID0gdGhpcy5jcmVhdGVCb2R5KCk7XHJcblxyXG4gICAgICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoaGVhZGluZyk7XHJcbiAgICAgICAgICAgIGRpdi5hcHBlbmRDaGlsZChib2R5KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZGl2ID0gZGl2O1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGRpdjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlTWFpbkRpdigpIHtcclxuXHJcbiAgICAgICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGRpdi5jbGFzc05hbWUgPSBcInBhbmVsIHBhbmVsLXByaW1hcnlcIjtcclxuXHJcbiAgICAgICAgcmV0dXJuIGRpdjtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVIZWFkaW5nKCkge1xyXG5cclxuICAgICAgICBsZXQgaGVhZGluZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGhlYWRpbmcuY2xhc3NOYW1lID0gXCJwYW5lbC1oZWFkaW5nXCI7XHJcblxyXG4gICAgICAgIGxldCBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBidXR0b24uY2xhc3NOYW1lID0gXCJidG4gYnRuLXByaW1hcnlcIjtcclxuICAgICAgICBidXR0b24udHlwZSA9IFwiYnV0dG9uXCI7XHJcbiAgICAgICAgYnV0dG9uLmlubmVyVGV4dCA9IFwi0J3QsNC30LDQtCDQuiDRgdC/0LjRgdC60YMg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9C10LlcIjtcclxuICAgICAgICBidXR0b24ub25jbGljayA9IHRoaXMuY2xpY2tPbkJ1dHRvbkJhY2s7XHJcblxyXG4gICAgICAgIHRoaXMuYnV0dG9uID0gYnV0dG9uO1xyXG5cclxuICAgICAgICBoZWFkaW5nLmFwcGVuZENoaWxkKGJ1dHRvbik7XHJcblxyXG4gICAgICAgIHJldHVybiBoZWFkaW5nO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZUJvZHkoKSB7XHJcblxyXG4gICAgICAgIGxldCBib2R5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgYm9keS5jbGFzc05hbWUgPSBcInBhbmVsLWJvZHlcIjtcclxuXHJcbiAgICAgICAgZm9yIChsZXQga2V5IGluIHRoaXMudXNlcikge1xyXG5cclxuICAgICAgICAgICAgbGV0IHJvdyA9IHRoaXMuY3JlYXRlUm93KGtleSwgdGhpcy51c2VyW2tleV0pO1xyXG5cclxuICAgICAgICAgICAgYm9keS5hcHBlbmRDaGlsZChyb3cpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGJvZHk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGNyZWF0ZVJvdyhuYW1lSXRlbSwgaXRlbSkge1xyXG5cclxuICAgICAgICBsZXQgcm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgcm93LmNsYXNzTmFtZSA9IFwicm93XCI7XHJcblxyXG4gICAgICAgIG5hbWVJdGVtID0gdGhpcy5jcmVhdGVEaXZJdGVtKG5hbWVJdGVtKTtcclxuICAgICAgICBpdGVtID0gdGhpcy5jcmVhdGVEaXZJdGVtKGl0ZW0pO1xyXG5cclxuICAgICAgICByb3cuYXBwZW5kQ2hpbGQobmFtZUl0ZW0pO1xyXG4gICAgICAgIHJvdy5hcHBlbmRDaGlsZChpdGVtKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJvdztcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVEaXZJdGVtKHRleHQpIHtcclxuXHJcbiAgICAgICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGRpdi5jbGFzc05hbWUgPSBcImNvbC1sZy02IGNvbC1tZC02IGNvbC1zbS02IGNvbC14cy02XCI7XHJcbiAgICAgICAgZGl2LmlubmVyVGV4dCA9IHRleHQ7XHJcblxyXG4gICAgICAgIHJldHVybiBkaXY7XHJcbiAgICB9XHJcblxyXG4gICAgY2xpY2tPbkJ1dHRvbkJhY2soZXZlbnQpIHtcclxuICAgICAgICBpZiAoZXZlbnQpIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cclxuICAgICAgICB0aGlzLnBhcmVudC5zaG93VGFibGUoKTtcclxuICAgICAgICB0aGlzLmRpdi5yZW1vdmUoKTtcclxuXHJcbiAgICAgICAgaGlzdG9yeS5wdXNoU3RhdGUoe3VzZXI6IGZhbHNlfSwgJycsICcnKTtcclxuICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgdGhpcy5wYXJlbnQua2V5QmFja3NwYWNlLCBmYWxzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UGFuZWwoKSB7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5kaXYpIHRoaXMuY3JlYXRlUGFuZWwoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5kaXY7XHJcbiAgICB9XHJcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2pzL1RhYmxlL1BhbmVsVXNlci5qc1xuLy8gbW9kdWxlIGlkID0gNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XHJcblxyXG4vL9CT0YDRg9C/0L/QsCDQutC90L7Qv9C+0LpcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnV0dG9uc0dyb3VwIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgICAgICAgdGhpcy5kaXYgPSBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLmJ1dHRvbkFkZCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5idXR0b25SZXNldCA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlRWxlbWVudCgpIHtcclxuICAgICAgICBsZXQgZGl2ID0gdGhpcy5jcmVhdGVNYWluRGl2KCk7XHJcblxyXG4gICAgICAgIGxldCBidXR0b25BZGQgPSB0aGlzLmNyZWF0ZUJ1dHRvbkFkZCgpO1xyXG4gICAgICAgIHRoaXMuYnV0dG9uQWRkID0gYnV0dG9uQWRkO1xyXG5cclxuICAgICAgICBsZXQgYnV0dG9uUmVzZXQgPSB0aGlzLmNyZWF0ZUJ1dHRvblJlc2V0KCk7XHJcbiAgICAgICAgdGhpcy5idXR0b25SZXNldCA9IGJ1dHRvblJlc2V0O1xyXG5cclxuICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoYnV0dG9uQWRkKTtcclxuICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoYnV0dG9uUmVzZXQpO1xyXG5cclxuICAgICAgICB0aGlzLmRpdiA9IGRpdjtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVNYWluRGl2KCkge1xyXG4gICAgICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBkaXYuY2xhc3NOYW1lID0gXCJmb3JtLWdyb3VwXCI7XHJcblxyXG4gICAgICAgIHJldHVybiBkaXY7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlQnV0dG9uQWRkKCkge1xyXG4gICAgICAgIGxldCBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcclxuICAgICAgICBidXR0b24uY2xhc3NOYW1lID0gXCJidG4gYnRuLWRlZmF1bHRcIjtcclxuICAgICAgICBidXR0b24udHlwZSA9IFwiYnV0dG9uXCI7XHJcbiAgICAgICAgYnV0dG9uLmlubmVyVGV4dCA9IFwi0JTQvtCx0LDQstC40YLRjFwiO1xyXG4gICAgICAgIGJ1dHRvbi5uYW1lID0gXCJhZGRcIjtcclxuXHJcbiAgICAgICAgcmV0dXJuIGJ1dHRvbjtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVCdXR0b25SZXNldCgpIHtcclxuICAgICAgICBsZXQgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XHJcbiAgICAgICAgYnV0dG9uLmNsYXNzTmFtZSA9IFwiYnRuIGJ0bi1kZWZhdWx0XCI7XHJcbiAgICAgICAgYnV0dG9uLnR5cGUgPSBcInJlc2V0XCI7XHJcbiAgICAgICAgYnV0dG9uLmlubmVyVGV4dCA9IFwi0J7Rh9C40YHRgtC40YLRjFwiO1xyXG4gICAgICAgIGJ1dHRvbi5uYW1lID0gXCJyZXNldFwiO1xyXG5cclxuICAgICAgICByZXR1cm4gYnV0dG9uO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEVsZW1lbnQoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmRpdikgdGhpcy5jcmVhdGVFbGVtZW50KCk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmRpdjtcclxuICAgIH1cclxuXHJcbiAgICBjbGlja0FkZCgpIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuYnV0dG9uQWRkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uQWRkLmNsaWNrKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNsaWNrUmVzZXQoKSB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmJ1dHRvblJlc2V0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uUmVzZXQuY2xpY2soKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9qcy9mb3JtL0J1dHRvbnNHcm91cC5qc1xuLy8gbW9kdWxlIGlkID0gN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgTmFtZUlucHV0IGZyb20gXCIuL05hbWVJbnB1dFwiO1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuLy/QndCw0YHQu9C10LTRg9C10YLRgdGPINC+0YIgTmFtZUlucHV0LCDRgtCw0Lwg0LrQvtC80LzQtdC90YLQsNGA0LjQuFxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFbWFpbElucHV0IGV4dGVuZHMgTmFtZUlucHV0IHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgICAgICAgc3VwZXIoYXJndW1lbnRzKTtcclxuXHJcbiAgICAgICAgdGhpcy5kaXYgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuaW5wdXQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuZXJyb3IgPSBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLmVycm9yVGV4dCA9IFwiRW1haWwg0LTQvtC70LbQtdC9INC40LzQtdGC0Ywg0YTQvtGA0LzQsNGCOiBlbWFpbEBlbWFpbC5ydVwiO1xyXG4gICAgICAgIHRoaXMucmVndWxhclN0cmluZ1ZhbGlkYXRlID0gL15bQS1aYS16MC05XVxcdypcXEBcXHcrXFwuW2Etel0rJC87XHJcbiAgICAgICAgdGhpcy5yZWd1bGFyU3RyaW5nS2V5ZG93biA9IC9eW1xcd0AuLV0kLztcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVMYWJlbCgpIHtcclxuICAgICAgICBsZXQgbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xyXG4gICAgICAgIGxhYmVsLmNsYXNzTmFtZSA9IFwiY29udHJvbC1sYWJlbFwiO1xyXG4gICAgICAgIGxhYmVsLmlubmVyVGV4dCA9IFwiRW1haWxcIjtcclxuXHJcbiAgICAgICAgcmV0dXJuIGxhYmVsO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZUlucHV0KCkge1xyXG4gICAgICAgIGxldCBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XHJcbiAgICAgICAgaW5wdXQuY2xhc3NOYW1lID0gXCJmb3JtLWNvbnRyb2xcIjtcclxuICAgICAgICBpbnB1dC50eXBlID0gXCJ0ZXh0XCI7XHJcbiAgICAgICAgaW5wdXQucGxhY2Vob2xkZXIgPSBcItCS0LDRiCBFbWFpbFwiO1xyXG4gICAgICAgIGlucHV0Lm5hbWUgPSBcImVtYWlsXCI7XHJcblxyXG4gICAgICAgIHJldHVybiBpbnB1dDtcclxuICAgIH1cclxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vanMvZm9ybS9FbWFpbElucHV0LmpzXG4vLyBtb2R1bGUgaWQgPSA4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCBOYW1lSW5wdXQgZnJvbSBcIi4vTmFtZUlucHV0XCI7XHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4vL9Cd0LDRgdC70LXQtNGD0LXRgtGB0Y8g0L7RgiBOYW1lSW5wdXQsINGC0LDQvCDQutC+0LzQvNC10L3RgtCw0YDQuNC4XHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBob25lSW5wdXQgZXh0ZW5kcyBOYW1lSW5wdXQge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICAgICAgICBzdXBlcihhcmd1bWVudHMpO1xyXG5cclxuICAgICAgICB0aGlzLmRpdiA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5pbnB1dCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5lcnJvciA9IG51bGw7XHJcblxyXG4gICAgICAgIHRoaXMuZXJyb3JUZXh0ID0gXCLQndC+0LzQtdGAINC00L7Qu9C20LXQvSDQuNC80LXRgtGMINGE0L7RgNC80LDRgjogK1ggKFhYWCkgWFhYLVhYLVhYXCI7XHJcbiAgICAgICAgdGhpcy5yZWd1bGFyU3RyaW5nVmFsaWRhdGUgPSAvXlxcK1xcZCA/XFwoXFxkezN9XFwpID9cXGR7M31cXC1cXGR7Mn1cXC1cXGR7Mn0kLztcclxuXHJcbiAgICAgICAgdGhpcy5yZWd1bGFyU3RyaW5nS2V5ZG93biA9IC9eW1xcZFxcIFxcKFxcKVxcLStdJC87XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZUxhYmVsKCkge1xyXG4gICAgICAgIGxldCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XHJcbiAgICAgICAgbGFiZWwuY2xhc3NOYW1lID0gXCJjb250cm9sLWxhYmVsXCI7XHJcbiAgICAgICAgbGFiZWwuaW5uZXJUZXh0ID0gXCLQotC10LvQtdGE0L7QvVwiO1xyXG5cclxuICAgICAgICByZXR1cm4gbGFiZWw7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlSW5wdXQoKSB7XHJcbiAgICAgICAgbGV0IGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcclxuICAgICAgICBpbnB1dC5jbGFzc05hbWUgPSBcImZvcm0tY29udHJvbFwiO1xyXG4gICAgICAgIGlucHV0LnR5cGUgPSBcInRleHRcIjtcclxuICAgICAgICBpbnB1dC5wbGFjZWhvbGRlciA9IFwi0JLQsNGIINCi0LXQu9C10YTQvtC9XCI7XHJcbiAgICAgICAgaW5wdXQubmFtZSA9IFwicGhvbmVcIjtcclxuXHJcbiAgICAgICAgcmV0dXJuIGlucHV0O1xyXG4gICAgfVxyXG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9qcy9mb3JtL1Bob25lSW5wdXQuanNcbi8vIG1vZHVsZSBpZCA9IDlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IFNlbGVjdEJveCBmcm9tIFwiLi9TZWxlY3RCb3hcIjtcclxuaW1wb3J0IEpzb25QIGZyb20gXCIuLi9Kc29uUFwiO1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuLy/QodC10LvQtdC60YIg0LHQvtC60YEg0LPQvtGA0L7QtNCwXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlbGVjdEJveENpdGllcyB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgICAgICAgdGhpcy5zZWxlY3RCb3hDb3VudHJpZXMgPSBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLmRhdGEgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuaWRDb3VudHJ5ID0gXCIxXCI7XHJcbiAgICAgICAgdGhpcy5saXN0Q2l0aWVzID0gbnVsbDtcclxuXHJcbiAgICAgICAgdGhpcy5wcm9taXNlSnNvblAoKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZWxlY3RCb3ggPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZVNlbGVjdEJveCgpIHtcclxuICAgICAgICBsZXQgc2VsZWN0Qm94ID0gbmV3IFNlbGVjdEJveChcItCT0L7RgNC+0LRcIiwgXCJjaXRpZXNcIiwgdGhpcy5saXN0Q2l0aWVzKTtcclxuICAgICAgICB0aGlzLnNlbGVjdEJveCA9IHNlbGVjdEJveDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRTZWxlY3RCb3goKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnNlbGVjdEJveCkgdGhpcy5jcmVhdGVTZWxlY3RCb3goKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3RCb3guZ2V0U2VsZWN0Qm94KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy/Qn9GA0L7QvNC40YEg0LbQtNC10YIg0LfQsNCz0YDRg9C30LrQuCDQtNCw0L3QvdGL0YVcclxuICAgIC8v0J/QvtGB0LvQtSDQt9Cw0LPRgNGD0LfQutC4INC+0LHQvdC+0LLQu9GP0LXRgiDRgdC10LvQtdC60YIg0LHQvtC60YFcclxuICAgIC8v0JLRi9C30YvQstCw0LXRgtGB0Y8g0L/RgNC4INGB0L7Qt9C00LDQvdC40Lgg0Y3QutC30LXQvNC/0LvRj9GA0LAg0Lgg0LrQvtCz0LTQsCDQvNC10L3Rj9C10YLRgdGPIGlkINGB0YLRgNCw0L3RiyAo0LXRgdC70Lgg0YHRgtGA0LDQvdCwINC90LUg0LHRi9C70LAg0LfQsNCz0YDRg9C20LXQvdCwINGA0LDQvdC10LUpXHJcbiAgICBwcm9taXNlSnNvblAoKSB7XHJcblxyXG4gICAgICAgIGxldCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBuZXcgSnNvblAoYGh0dHA6Ly90aWtob21pcm92LXNlcmdleS5ydS9kYXRhL0NvdW50cmllcy8ke3RoaXMuaWRDb3VudHJ5fS5qc29uYCwgXCJodHRwOi8vdGlraG9taXJvdi1zZXJnZXkucnUvanMvanNvblAvY2l0aWVzLmpzXCIsIHRoaXMsICdjaXRpZXMnKS5yZXF1ZXN0KCk7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZGF0YSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxpc3RDaXRpZXMgPSB0aGlzLmRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RCb3hDb3VudHJpZXMuc2F2ZUNpdGllcyh0aGlzLmlkQ291bnRyeSwgdGhpcy5saXN0Q2l0aWVzIHx8IG51bGwpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIDEwMDApO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBwcm9taXNlLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc2VsZWN0Qm94KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RCb3gudXBkYXRlTGlzdCh0aGlzLmxpc3RDaXRpZXMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICAvL9Ch0LLRj9C30Ywg0YEg0YHQtdC70LXQutGCINCx0L7QutGB0L7QvCDRgdGC0YDQsNC90YtcclxuICAgIHNldFNlbGVjdEJveENvdW50cmllcyhzZWxlY3RCb3gpIHtcclxuXHJcbiAgICAgICAgdGhpcy5zZWxlY3RCb3hDb3VudHJpZXMgPSBzZWxlY3RCb3g7XHJcbiAgICB9XHJcblxyXG4gICAgLy/Ql9Cw0LzQtdC90LAgaWRDb3VudHJ5LCDQtdGB0LvQuCDQtdGB0YLRjCDQsNGA0LPRg9C80LXQvdGCIGNpdGllcywg0YLQviDQv9GA0L7QvNC40YEg0L3QtSDQstGL0LfRi9Cy0LDQtdGC0YHRj1xyXG4gICAgY2hhbmdlSWRDb3VudHJ5KGlkQ291bnRyeSwgY2l0aWVzKSB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmlkQ291bnRyeSAhPSBpZENvdW50cnkpIHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuaWRDb3VudHJ5ID0gaWRDb3VudHJ5O1xyXG5cclxuICAgICAgICAgICAgaWYgKGNpdGllcykge1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0Qm94LnVwZGF0ZUxpc3QoY2l0aWVzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0Qm94LmNsZWFyTGlzdCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9taXNlSnNvblAoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2pzL2Zvcm0vU2VsZWN0Qm94Q2l0aWVzLmpzXG4vLyBtb2R1bGUgaWQgPSAxMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgU2VsZWN0Qm94IGZyb20gXCIuL1NlbGVjdEJveFwiO1xyXG5pbXBvcnQgSnNvblAgZnJvbSBcIi4uL0pzb25QXCI7XHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4vL9Ch0LXQu9C10LrRgiDQsdC+0LrRgSDRgdGC0YDQsNC90YtcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VsZWN0Qm94Q291bnRyaWVzIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICAgICAgICB0aGlzLnNlbGVjdEJveENpdGllcyA9IG51bGw7XHJcblxyXG4gICAgICAgIHRoaXMuZGF0YSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5saXN0Q291bnRyaWVzID0gbnVsbDtcclxuICAgICAgICB0aGlzLmNvdW50cmllcyA9IFtdO1xyXG5cclxuICAgICAgICB0aGlzLnByb21pc2VKc29uUCgpO1xyXG5cclxuICAgICAgICB0aGlzLnNlbGVjdEJveCA9IG51bGw7XHJcblxyXG4gICAgICAgIHRoaXMub25DaGFuZ2UgPSB0aGlzLm9uQ2hhbmdlLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy/Qn9GA0L7QvNC40YEg0LbQtNC10YIg0LfQsNCz0YDRg9C30LrQuCDQtNCw0L3QvdGL0YVcclxuICAgIC8v0J/QvtGB0LvQtSDQt9Cw0LPRgNGD0LfQutC4INC+0LHQvdC+0LLQu9GP0LXRgiDRgdC10LvQtdC60YIg0LHQvtC60YFcclxuICAgIHByb21pc2VKc29uUCgpIHtcclxuXHJcbiAgICAgICAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IG5ldyBKc29uUChcImh0dHA6Ly90aWtob21pcm92LXNlcmdleS5ydS9kYXRhL0NvdW50cmllcy9jb3VudHJpZXMuanNvblwiLCBcImh0dHA6Ly90aWtob21pcm92LXNlcmdleS5ydS9qcy9qc29uUC9jb3VudHJpZXMuanNcIiwgdGhpcywgJ2NvdW50cmllcycpLnJlcXVlc3QoKTtcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kYXRhKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGlzdENvdW50cmllcyA9IHRoaXMuZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIDEwMDApO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBwcm9taXNlLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc2VsZWN0Qm94KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RCb3gudXBkYXRlTGlzdCh0aGlzLmxpc3RDb3VudHJpZXMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVTZWxlY3RCb3goKSB7XHJcbiAgICAgICAgbGV0IHNlbGVjdEJveCA9IG5ldyBTZWxlY3RCb3goXCLQodGC0YDQsNC90LBcIiwgXCJjb3VudHJpZXNcIiwgdGhpcy5saXN0Q291bnRyaWVzLCB0aGlzLm9uQ2hhbmdlKTtcclxuICAgICAgICB0aGlzLnNlbGVjdEJveCA9IHNlbGVjdEJveDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRTZWxlY3RCb3goKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnNlbGVjdEJveCkgdGhpcy5jcmVhdGVTZWxlY3RCb3goKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3RCb3guZ2V0U2VsZWN0Qm94KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy/QodCy0Y/Qt9GMINGBINGB0LXQu9C10LrRgiDQsdC+0LrRgdC+0Lwg0LPQvtGA0L7QtNCwXHJcbiAgICBzZXRTZWxlY3RCb3hDaXRpZXMoc2VsZWN0Qm94Q2l0aWVzKSB7XHJcblxyXG4gICAgICAgIHRoaXMuc2VsZWN0Qm94Q2l0aWVzID0gc2VsZWN0Qm94Q2l0aWVzO1xyXG5cclxuICAgICAgICBzZWxlY3RCb3hDaXRpZXMuc2V0U2VsZWN0Qm94Q291bnRyaWVzKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8v0KHQvtGF0YDQsNC90LXQvdC40LUg0L7QsdGK0LXQutGC0LAg0YEg0LPQvtGA0L7QtNCw0LzQuFxyXG4gICAgc2F2ZUNpdGllcyhpZENvdW50cnksIGxpc3RDaXRpZXMpIHtcclxuXHJcbiAgICAgICAgbGV0IGNvdW50cnkgPSB0aGlzLnNlYXJjaENvdW50cnlPbklkKGlkQ291bnRyeSk7XHJcblxyXG4gICAgICAgIGlmICghY291bnRyeSkge1xyXG4gICAgICAgICAgICBjb3VudHJ5ID0ge1xyXG4gICAgICAgICAgICAgICAgaWQ6IGlkQ291bnRyeSxcclxuICAgICAgICAgICAgICAgIGNpdGllczogbGlzdENpdGllc1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jb3VudHJpZXMucHVzaChjb3VudHJ5KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy/QodC+0LHRi9GC0LjQtSwg0L/RgNC4INGB0LzQtdC90LUg0LLRi9Cx0YDQsNC90L3QvtCz0L4g0LjQvdC00LXQutGB0LBcclxuICAgIG9uQ2hhbmdlKGV2ZW50KSB7XHJcblxyXG4gICAgICAgIGxldCBzZWxlY3RCb3ggPSBldmVudC5jdXJyZW50VGFyZ2V0O1xyXG4gICAgICAgIGxldCBzZWxlY3RlZEluZGV4ID0gc2VsZWN0Qm94LnNlbGVjdGVkSW5kZXg7XHJcblxyXG4gICAgICAgIGxldCBpZENvdW50cnkgPSBzZWxlY3RCb3gub3B0aW9uc1tzZWxlY3RlZEluZGV4XS52YWx1ZTtcclxuXHJcbiAgICAgICAgbGV0IGNvdW50cnkgPSB0aGlzLnNlYXJjaENvdW50cnlPbklkKGlkQ291bnRyeSk7XHJcblxyXG4gICAgICAgIC8v0JXRgdC70Lgg0LPQvtGA0L7QtNCwINCy0YvQsdGA0LDQvdC90L7QuSDRgdGC0YDQsNC90Ysg0LfQsNCz0YDRg9C20LXQvdC90Ysg0YDQsNC90LXQtSwg0YLQviDQvtC90Lgg0L/QtdGA0LXQtNCw0Y7RgtGB0Y8g0LIg0YHQtdC70LXQutGCINCx0L7QutGBLCDQuCDQt9Cw0LPRgNGD0LfQutCwINCz0L7RgNC+0LTQvtCyINC90LUg0L/RgNC+0LjRgdGF0L7QtNC40YIgKGNvdW50cnkuY2l0aWVzKVxyXG4gICAgICAgIHRoaXMuc2VsZWN0Qm94Q2l0aWVzLmNoYW5nZUlkQ291bnRyeShpZENvdW50cnksIGNvdW50cnkuY2l0aWVzKTtcclxuICAgIH1cclxuXHJcbiAgICBzZWFyY2hDb3VudHJ5T25JZChpZCkge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5jb3VudHJpZXMpIHtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGtleSBpbiB0aGlzLmNvdW50cmllcykge1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBjb3VudHJ5ID0gdGhpcy5jb3VudHJpZXNba2V5XTtcclxuICAgICAgICAgICAgICAgIGlmIChjb3VudHJ5LmlkID09PSBpZCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY291bnRyeTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9qcy9mb3JtL1NlbGVjdEJveENvdW50cmllcy5qc1xuLy8gbW9kdWxlIGlkID0gMTFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuXHJcbmltcG9ydCBjcmVhdGVGb3JtQW5kVGFibGUgZnJvbSBcIi4vanMvY3JlYXRlRm9ybUFuZFRhYmxlXCI7XHJcblxyXG4vL9Cd0LDRhdC+0LTQuNC8INC60L3QvtC/0LrRgyDQv9C+IGlkLCDQstC10YjQsNC10Lwg0L3QsCDQvdC10LUg0L7QsdGA0LDQsdC+0YLRh9C40Log0YHQvtCx0YvRgtC40Y9cclxubGV0IGJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjcmVhdGUtZm9ybS1hbmQtdGFibGUnKTtcclxuYnV0dG9uLm9uY2xpY2sgPSBjcmVhdGVGb3JtQW5kVGFibGU7XHJcblxyXG5cclxuXHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbWFpbi5qc1xuLy8gbW9kdWxlIGlkID0gMTJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==