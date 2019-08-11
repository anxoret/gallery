"use strict"

class Collection {

    constructor() {
        this._storage = [];
    }

    add(elem) {
        let storage = this.toArray();
        storage.push(elem);
    }

    toArray() {
        return this._storage;
    }

};

class ImageCollection extends Collection {

    add(elem) {
        if (elem instanceof ImageLink) {
            super.add(elem);
        }
    }

};

class ImageLink {

    constructor(url) {
        this._link = url;
    }

    get link() {
        return this._link;
    }

    set link(url) {
        this._link = url;
    }

};

function createImageFromLink(url) {
    return new ImageLink(url);
};

function addImageToCollection(url, collection) {
    collection.add(createImageFromLink(url));
};

function addImage(url, collection) {
    addImageToCollection(url, collection);
    updateView(collection);
};

function readFile(input) {
    let file = input.files[0];
    let reader = new FileReader();

    reader.readAsText(file);

    reader.onload = function () {

        let jsonUrLs;

        try {
            jsonUrLs = JSON.parse(reader.result);
        } catch (error) {
            alert("Не удалось прочитать json файл.");
            document.querySelector(".form-download__input-jsonFile").value = "";
            return;
        }

        jsonUrLs = JSON.parse(reader.result);

        if ("galleryImages" in jsonUrLs) {

            jsonUrLs.galleryImages.forEach(
                elem => addImage(elem.url, imageCollection)
            );
            
        } else {
            alert("Вы пытаетесь загрузить некорректный файл.");
        }

        document.querySelector(".form-download__input-jsonFile").value = "";

    };

    reader.onerror = function () {
        console.log(reader.error);
    };

};

let imagesHtmlContainer = document.querySelector(".images");

function updateView(collection) {
    let imageToAdd = collection.toArray()[collection.toArray().length - 1];
    let newImage = document.createElement("img");
    newImage.src = imageToAdd.link;
    imagesHtmlContainer.appendChild(newImage);
};

let imageCollection = new ImageCollection();

function downloadImage(input) {
    let newImage = document.querySelector(".form-download__input-url");

    if ( (newImage.value.indexOf("Введите url до картинки") === -1) ) {
        addImage(newImage.value, imageCollection);
        newImage.value = "Введите url до картинки";
    } else {
        alert("Введите url или выберете файл");
    }

};



