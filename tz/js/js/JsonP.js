'use strict';

//Класс для подгрузки данных(страны, города, таблица).
export default class JsonP {


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
