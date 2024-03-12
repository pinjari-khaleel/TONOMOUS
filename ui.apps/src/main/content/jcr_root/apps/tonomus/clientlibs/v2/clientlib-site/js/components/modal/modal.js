var TONOMUS = TONOMUS || {};

TONOMUS.modal = (function(){
    function Modal(element) {

        this.initialize = function(element) {
            this.cmpModal = element;
            this.closeButton = element.querySelector('.cmp-modal__close-button');
            this.registerEventListeners();
        }
    
        this.registerEventListeners = function() {
            this.closeButton.addEventListener('click', (event) => {
                const {target} = event;
                target.closest('.cmp-modal').classList.remove('cmp-modal--visible');
                document.body.classList.remove('no-scroll');
            })

            this.modalForms && this.modalForms.forEach((form) => {
                form.addEventListener("input", this.resetTimer.bind(this));
                form.addEventListener("change", this.resetTimer.bind(this));
            });
        }

        this.initialize(element);
    }

    return function(element) {
        new Modal(element);
    }
})();

window.addEventListener('load', () => {
    document.querySelectorAll('.cmp-modal')?.forEach(function(element) {
        TONOMUS.modal(element);
    });
    document.querySelectorAll('[data-has-modal]')?.forEach(function(element) {
        element.addEventListener("click", (event) => {
            const anchorElement = event.currentTarget;
            const hashTagPosition = anchorElement.href.indexOf('#');
            if (hashTagPosition !== -1) {
                const anchorId = anchorElement.href.slice(hashTagPosition, anchorElement.href.length);
                const targetModalElement = document.querySelector(anchorId);
                if (targetModalElement) {
                    event.preventDefault();
                    targetModalElement.closest('.cmp-modal').classList.add('cmp-modal--visible');
                    document.body.classList.add('no-scroll');
                }
            }
        });
    });
});