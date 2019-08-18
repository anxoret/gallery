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
        if (elem instanceof ImageWithLink) {
            super.add(elem);
        }
    }

};

class ImageWithLink {

    constructor(url, collection) {
        this._image = new Image();
        this._image.onload = function() {setTimeout( () => refreshView(), 0 ) };
        this._image.src = url;
    }

    get image() {
        return this._image;
    }

    get link() {
        return this._image.src;
    }

    set link(url) {
        this._image.src = url;
    }

};

function createImageFromLink(url, collection) {
    return new ImageWithLink(url, collection);
};

function addImageToCollection(url, collection) {
    collection.add(createImageFromLink(url, collection));
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

function refreshView() {

    let images = document.querySelectorAll(".images__img");

    let imagesMaxHeight = 200;
    let imagesMaxWidth = 0;

    for (let i = 0; i < images.length; i++) {
        
        if (imagesMaxHeight < images[i].height) {
            images[i].style.height = "200px";
        }

        if (imagesMaxWidth < images[i].width) {
            imagesMaxWidth = images[i].width;
        }

    }

}

function updateView(collection) {
    let imageToAdd = collection.toArray()[collection.toArray().length - 1];
    let newImage = document.createElement("img");
    newImage.className = "images__img"
    newImage.src = imageToAdd.link;

    let newImageDiv = document.createElement("div");
    newImageDiv.className = "images__img-grid";
    imagesHtmlContainer.appendChild(newImageDiv);

    newImageDiv.appendChild(newImage);

};

let imageCollection = new ImageCollection();

function downloadImage() {
    let newImage = document.querySelector(".form-download__input-url");

    if ( (newImage.value.indexOf("Введите url до картинки") === -1) ) {
        addImage(newImage.value, imageCollection);
        newImage.value = "Введите url до картинки";
    } else {
        alert("Введите url или выберете файл");
    }

};



