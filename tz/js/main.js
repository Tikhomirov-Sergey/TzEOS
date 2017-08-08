'use strict';


import createFormAndTable from "./js/createFormAndTable";

//Находим кнопку по id, вешаем на нее обработчик события
let button = document.getElementById('create-form-and-table');
button.onclick = createFormAndTable;



