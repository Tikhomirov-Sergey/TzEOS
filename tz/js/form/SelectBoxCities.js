import SelectBox from "./SelectBox";
import JsonP from "../JsonP";

'use strict';

//Селект бокс города
export default class SelectBoxCities {
    constructor() {

        this.selectBoxCountries = null;

        this.data = null;
        this.idCountry = "1";
        this.listCities = null;

        this.promiseJsonP();

        this.selectBox = null;
    }

    createSelectBox() {
        let selectBox = new SelectBox("Город", "cities", this.listCities);
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
            this.data = new JsonP(`./data/Countries/${this.idCountry}.json`, "./js/jsonP/cities.js", this, 'cities').request();
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



