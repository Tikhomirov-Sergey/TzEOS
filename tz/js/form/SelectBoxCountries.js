import SelectBox from "./SelectBox";
import JsonP from "../JsonP";

'use strict';

//Селект бокс страны
export default class SelectBoxCountries {
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
            this.data = new JsonP("./data/countries/countries.json", "./js/jsonP/countries.js", this, 'countries').request();
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
        let selectBox = new SelectBox("Страна", "countries", this.listCountries, this.onChange);
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


