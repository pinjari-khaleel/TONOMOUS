var TONOMUS = TONOMUS || {};

TONOMUS.heroBanner = (function () {
    function HeroBanner(element) {

        this.initialize = function (element) {
            this.background = element.querySelector('.cmp-herobanner__bg-container');
            this.content = element.querySelector('.cmp-herobanner__content');
            this.contentHeight = this.content?.clientHeight;

            if (this.contentHeight != null) {
                this.changeOnLoad();
                this.registerEventListeners();
            }
        }

        this.registerEventListeners = function () {
            window.addEventListener('resize', this.onScreenChange.bind(this));
            screen.orientation.addEventListener("change", this.onScreenChange.bind(this));
        }

        this.onScreenChange = function () {
            this.background.style.maxHeight = this.contentHeight + 'px';
        }

        this.changeOnLoad = function () {
            this.background.style.maxHeight = this.contentHeight + 'px';
        }

        this.initialize(element);
    }

    return function (element) {
        new HeroBanner(element);
    }
})();

window.addEventListener('load', () => {
    document.querySelectorAll('.cmp-herobanner')?.forEach(function (element) {
        TONOMUS.heroBanner(element);
    });
});