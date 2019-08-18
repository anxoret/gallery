"use strict";

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Collection = function () {
    function Collection() {
        _classCallCheck(this, Collection);

        this._storage = [];
    }

    _createClass(Collection, [{
        key: "add",
        value: function add(elem) {

            var storage = this.toArray();
            storage.push(elem);
        }
    }, {
        key: "toArray",
        value: function toArray() {
            return this._storage;
        }
    }]);

    return Collection;
}();

;

var ImageCollection = function (_Collection) {
    _inherits(ImageCollection, _Collection);

    function ImageCollection() {
        _classCallCheck(this, ImageCollection);

        return _possibleConstructorReturn(this, (ImageCollection.__proto__ || Object.getPrototypeOf(ImageCollection)).apply(this, arguments));
    }

    _createClass(ImageCollection, [{
        key: "add",
        value: function add(elem) {
            if (elem instanceof ImageWithLink) {
                _get(ImageCollection.prototype.__proto__ || Object.getPrototypeOf(ImageCollection.prototype), "add", this).call(this, elem);
            }
        }
    }]);

    return ImageCollection;
}(Collection);

;

var ImageWithLink = function () {
    function ImageWithLink(url, collection) {
        _classCallCheck(this, ImageWithLink);

        this._image = new Image();
        this._image.onload = function () {
            setTimeout(function () {
                return refreshView();
            }, 0);
        };
        this._image.src = url;
    }

    _createClass(ImageWithLink, [{
        key: "image",
        get: function get() {
            return this._image;
        }
    }, {
        key: "link",
        get: function get() {
            return this._image.src;
        },
        set: function set(url) {
            this._image.src = url;
        }
    }]);

    return ImageWithLink;
}();

;

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
    var file = input.files[0];
    var reader = new FileReader();

    reader.readAsText(file);

    reader.onload = function () {

        var jsonUrLs = void 0;

        try {
            jsonUrLs = JSON.parse(reader.result);
        } catch (error) {
            alert("Не удалось прочитать json файл.");
            document.querySelector(".form-download__input-jsonFile").value = "";
            return;
        }

        jsonUrLs = JSON.parse(reader.result);

        if ("galleryImages" in jsonUrLs) {

            jsonUrLs.galleryImages.forEach(function (elem) {
                return addImage(elem.url, imageCollection);
            });
        } else {
            alert("Вы пытаетесь загрузить некорректный файл.");
        }

        document.querySelector(".form-download__input-jsonFile").value = "";
    };

    reader.onerror = function () {
        console.log(reader.error);
    };
};

var imagesHtmlContainer = document.querySelector(".images");

function refreshView() {

    var images = document.querySelectorAll(".images__img");

    var imagesMaxHeight = 200;
    var imagesMaxWidth = 0;

    for (var i = 0; i < images.length; i++) {

        if (imagesMaxHeight < images[i].height) {
            images[i].style.height = "200px";
        }

        if (imagesMaxWidth < images[i].width) {
            imagesMaxWidth = images[i].width;
        }
    }
}

function updateView(collection) {
    var imageToAdd = collection.toArray()[collection.toArray().length - 1];
    var newImage = document.createElement("img");
    newImage.className = "images__img";
    newImage.src = imageToAdd.link;

    var newImageDiv = document.createElement("div");
    newImageDiv.className = "images__img-grid";
    imagesHtmlContainer.appendChild(newImageDiv);

    newImageDiv.appendChild(newImage);
};

var imageCollection = new ImageCollection();

function downloadImage() {
    var newImage = document.querySelector(".form-download__input-url");

    if (newImage.value.indexOf("Введите url до картинки") === -1) {
        addImage(newImage.value, imageCollection);
        newImage.value = "Введите url до картинки";
    } else {
        alert("Введите url или выберете файл");
    }
};