'use strict';

export default class PanelUser {

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