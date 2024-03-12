var TONOMUS = TONOMUS || {};
TONOMUS.footer = (function(){
    var element;
    var gradientWrapper;
    var contentWrapper;
    var logoWrapper;
    const NAVIGATION_OPEN = 'cmp-footer__navigation-item-link--parent-active';
    function initialize(element) {
        this.element = element;
    	this.gradientWrapper = element.querySelector('.cmp-footer__gradient-wrapper');
        this.contentWrapper = element.querySelector('.cmp-footer__content');
        this.logoWrapper = element.querySelector('.cmp-footer__logo');
        this.navigationItems = element.querySelectorAll('.cmp-footer__navigation-item-link--parent');
        setupGradientWrapper();
        registerEventListeners();
    }

    function registerEventListeners() {
        handleResize();
        handleClickNavigation();
    }

    function handleResize() {
        window.addEventListener('resize', function(){
            setupGradientWrapper();
        })
    }

    function handleClickNavigation(navItemElement) {
        this.navigationItems.forEach(function(navItemElement) {
            navItemElement.addEventListener('click', function(e) {
                e.preventDefault();
                if (this.classList.contains(NAVIGATION_OPEN)) {
                    this.classList.remove(NAVIGATION_OPEN);
                } else {
                    this.classList.add(NAVIGATION_OPEN);
                }
            });
        });
    }

    function setupGradientWrapper() {
        this.gradientWrapper.style.height = (this.contentWrapper.offsetHeight + this.logoWrapper.offsetHeight) + 'px';
    }

    return {
        initialize: function(element) {
            initialize(element)
        }
    }
})();
window.addEventListener('load', () => {
    document.querySelectorAll('.cmp-footer')?.forEach(function(element) {
        TONOMUS.footer.initialize(element);
    });
});
