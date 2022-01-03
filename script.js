'use strict';

let selectWorker = document.getElementById('worker_select');
let selectLicense = document.getElementById('license_select');
let selectSpec = document.getElementById('spec_select');
let inputName = document.querySelector('.name');
let inputSurname = document.querySelector('.surname');
let inputTabNum = document.querySelector('.tab-number');
let inputAge = document.querySelector('.age');
let inputExp = document.querySelector('.drv-exp');
let inputRank = document.querySelector('.rank-exp');
let childrenCheckbox = document.getElementById('checkbox-child');
let tableResult = document.getElementById('table-result');
let allTextInput = document.querySelectorAll('input[type=text]');
let tbody = document.getElementById('tbody');
let saveBut = document.querySelector('.handler_btn');

class Workman {
    constructor(num, nameWorker, inputSurname, tabNumber, age, children) {
        this._name = nameWorker;
        this._surname = inputSurname;
        this._tabNumber = tabNumber;
        this._age = age;
        this._children = children;
        this.num = num;
    }
    get name() {
        return this._name;
    }
    get surname() {
        return this._surname;
    }
    get tabNumber() {
        return this._tabNumber;
    }
    get age() {
        return this._age;
    }
    get children() {
        return this._children;
    }

    deleteItem() {
        app.masData.forEach((element, index) => {
            if (element.num === this.num) {
                app.masData.splice(index, 1);
            }
        });
        app.render();
    }
}

class Driver extends Workman {
    constructor(num, nameWorker, surnameWorker, tabnum, ageWorker, children, license, exp) {
        super(num, nameWorker, surnameWorker, tabnum, ageWorker, children);
        this._className = 'Водитель';
        this._license = license;
        this._exp = exp;
    }

    deleteItem() {
        super.deleteItem();
    }
    get license() {
        return this._license;
    }
    get exp() {
        return this._exp;
    }
    set license(str) {
        this._license = str;
    }
    set exp(val) {
        this._exp = val;
    }
    set className(val) {
        this._className = val;
    }
    get className() {
        return this._className;
    }
}

class Mech extends Workman {
    constructor(num, nameWorker, surnameWorker, tabnum, ageWorker, children, spec, rank) {
        super(num, nameWorker, surnameWorker, tabnum, ageWorker, children);
        this._className = 'Механик';
        this._spec = spec;
        this._rank = rank;
    }
    deleteItem() {
        super.deleteItem();
    }
    get spec() {
        return this._spec;
    }
    get rank() {
        return this._rank;
    }
    set spec(val) {
        this._spec = val;
    }
    set rank(val) {
        this._rank = val;
    }
    set className(val) {
        this._className = val;
    }
    get className() {
        return this._className;
    }
}

const app = {
    firstShow: 1,
    counter: 0,
    isChild: false,
    obj: {},
    worker: 'def',
    masData: [],
    init: function () {
        selectWorker.addEventListener('change', this.onChangeWorker.bind(this));
        saveBut.addEventListener('click', this.onSave.bind(this));
        childrenCheckbox.addEventListener('change', this.onChangeChild.bind(this));
        selectSpec.addEventListener('change', this.onChangeSpec.bind(this));
        selectLicense.addEventListener('change', this.onChangeLicense.bind(this));
    },
    onChangeWorker: function () {
        if (this.firstShow == 1) {
            this.firstShow = 0;
            selectWorker.removeChild(selectWorker.querySelector('[id="def"]'));
        }
        if (selectWorker.options[selectWorker.selectedIndex].value == 'driver') {
            document.querySelector('.driver-options').style.display = 'block';
            document.querySelector('.mech-options').style.display = 'none';
            this.worker = 'driver';
        } else if (selectWorker.options[selectWorker.selectedIndex].value == 'mech') {
            document.querySelector('.mech-options').style.display = 'block';
            document.querySelector('.driver-options').style.display = 'none';
            this.worker = 'mech';
        }
    },
    onChangeLicense: function () {
        selectLicense.removeChild(selectLicense.querySelector('[value="def"]'));
    },
    onChangeSpec: function () {
        selectSpec.removeChild(selectSpec.querySelector('[value="def"]'));
    },
    onChangeChild: function () {
        this.isChild = childrenCheckbox.checked;
    },
    buildObject: function () {
        if (this.worker == 'driver') {
            const worker = new Driver(this.counter, inputName.value, inputSurname.value, inputTabNum.value, inputAge.value, this.isChild);
            worker.license = selectLicense.options[selectLicense.selectedIndex].textContent;
            worker.exp = inputExp.value;
            this.counter++;
            return worker;
        } else if (this.worker == 'mech') {
            const worker = new Mech(this.counter, inputName.value, inputSurname.value, inputTabNum.value, inputAge.value, this.isChild);
            worker.spec = selectSpec.options[selectSpec.selectedIndex].textContent;
            worker.rank = inputRank.value;
            this.counter++;
            return worker;
        }
    },
    buildObjectLocalStorage: function (obj) {
        if (obj._className == 'Водитель') {
            const worker = new Driver(this.counter, obj._name, obj._surname, obj._tabNumber, obj._age, obj._children);
            worker.license = obj._license;
            worker.exp = obj._exp;
            this.counter++;
            return worker;
        } else if (obj._className == 'Механик') {
            const worker = new Mech(this.counter, obj._name, obj._surname, obj._tabNumber, obj._age, obj._children);
            worker.spec = obj._spec;
            worker.rank = obj._rank;
            this.counter++;
            return worker;
        }
    },
    onSave: function () {
        if (inputName.value !== '' && inputSurname.value !== '' && inputTabNum.value !== '' &&
            inputAge.value !== '' && this.worker !== 'def') {
            if (this.worker == 'driver') {
                if (selectLicense.options[selectLicense.selectedIndex].value !== 'def' && inputExp.value !== '') {
                    this.saveNewObject();
                } else {
                    alert('Заполните поля');
                }
            } else if (this.worker == 'mech') {
                if (selectSpec.options[selectSpec.selectedIndex].value !== 'def' && inputRank.value !== '') {
                    this.saveNewObject();
                } else {
                    alert('Заполните поля');
                }
            }
        } else {
            alert('Заполните поля');
        }
    },
    saveNewObject: function () {
        const newWorker = this.buildObject();
        this.obj = newWorker;
        this.masData.push(newWorker);
        this.render();
    },
    resetInputs: function () {
        allTextInput.forEach(element => {
            element.value = '';
        });
    },
    render: function () {
        tbody.innerHTML = '';
        this.masData.forEach(element => {
            let row = document.createElement("tr");
            let className = document.createElement("td");
            className.appendChild(document.createTextNode(element.className));
            let name = document.createElement("td");
            name.appendChild(document.createTextNode(element.name));
            let surname = document.createElement("td");
            surname.appendChild(document.createTextNode(element.surname));
            let tabNumber = document.createElement("td");
            tabNumber.appendChild(document.createTextNode(element.tabNumber));
            let age = document.createElement("td");
            age.appendChild(document.createTextNode(element.age));
            let children = document.createElement("td");
            (element.children) ? children.appendChild(document.createTextNode('Да')) : children.appendChild(document.createTextNode('Нет'));
            row.appendChild(className);
            row.appendChild(name);
            row.appendChild(surname);
            row.appendChild(tabNumber);
            row.appendChild(age);
            row.appendChild(children);
            if (element.className == 'Водитель') {
                let exp = document.createElement("td");
                exp.appendChild(document.createTextNode(element.exp));
                let license = document.createElement("td");
                license.appendChild(document.createTextNode(element.license));
                row.appendChild(exp);
                row.appendChild(license);
            } else if (element.className == 'Механик') {
                let spec = document.createElement("td");
                spec.appendChild(document.createTextNode(element.spec));
                let rank = document.createElement("td");
                rank.appendChild(document.createTextNode(element.rank));
                row.appendChild(rank);
                row.appendChild(spec);
            }
            let butRemove = document.createElement('button');
            butRemove.appendChild(document.createTextNode('Удалить'));
            butRemove.classList.add('but-remove');
            let butTd = document.createElement("td");
            console.log(element);
            butRemove.addEventListener('click', element.deleteItem.bind(element));
            butTd.appendChild(butRemove);
            row.appendChild(butTd);
            tbody.appendChild(row);
        });
        localStorage.setItem('Data', JSON.stringify(this.masData));
        this.resetInputs();
    }
};


if (localStorage.getItem('Data')) {
    let mas = [];
    app.masData = JSON.parse(localStorage.getItem('Data'));
    app.masData.forEach(element => {
        const worker = app.buildObjectLocalStorage(element);
        mas.push(worker);
    });
    app.masData = [];
    app.masData = app.masData.concat(mas);
    app.render();
}

app.init();
