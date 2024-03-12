var TONOMUS = TONOMUS || {};
TONOMUS.header = (function(){
    var element;
    var menuListElements;

    function initialize(element) {
        this.element = element;
        this.menuListElements = element.querySelectorAll('.cmp-header__navigation-item') || [];
        this.hamburgerIconMenu = element.querySelector('.cmp-header__hamburger-icon');
        this.closeIconMenu = element.querySelector('.cmp-header__close-icon');
        registerEventListeners();
        disableAnchorNavigation();
    }

    function registerEventListeners() {
        handleMenuListClickEvent();
        handleNavMobileToggleEvent();
    }

    function handleMenuListClickEvent() {
        this.menuListElements?.forEach((listElement) => {
            const toggleElement = listElement.querySelector('[data-dropdown-toggle]');
            toggleElement.addEventListener('click', function() {
                const content = listElement.querySelector('[data-dropdown-content]');
                if (content) {
                    if ( ! content.classList.contains('cmp-header__navigation-group--show')) {
                        listElement.classList.add('cmp-header__navigation-item--pressed');
                        content.classList.add('cmp-header__navigation-group--show')
                    } else {
                        listElement.classList.remove('cmp-header__navigation-item--pressed');
                        content.classList.remove('cmp-header__navigation-group--show')
                    }
                }
            });
        });
    }

    function handleNavMobileToggleEvent() {
        const body = document.body;
        this.hamburgerIconMenu?.addEventListener('click', function() {
            body.classList.add('no-scroll');
        });
        this.closeIconMenu?.addEventListener('click', function() {
            if (body.classList.contains('no-scroll')) {
                body.classList.remove('no-scroll');
            }
        });
    }

    function disableAnchorNavigation() {
        const disableNavigation = function(e) {
            if (window.matchMedia("(max-width: 1024px)").matches) {
                e.preventDefault();
            }
        };

        const menuItems0 = this.element.querySelectorAll('.cmp-header__navigation-item--level-0 > .cmp-header__navigation-group');
        menuItems0?.forEach(function(menuItem0) {
            const menuItem = menuItem0.closest('.cmp-header__navigation-item--level-0');
            const menuItemLink = menuItem.querySelector('[data-cmp-navigate-disabled]');
            menuItemLink.addEventListener('click', (e) => {
                e.preventDefault();
            });
        });
    
        const anchorItems = this.element.querySelectorAll('[data-cmp-navigate-disabled]');
        anchorItems?.forEach(function(anchorItem) {
            anchorItem.addEventListener('click', disableNavigation);
        });
    
        window.addEventListener('resize', disableNavigation);
        screen.orientation.addEventListener("change", disableNavigation);
    }

    return {
        initialize: function(element) {
            initialize(element);
        }
    }
})();
window.addEventListener('load', () => {
    document.querySelectorAll('.cmp-header')?.forEach(function(element) {
        TONOMUS.header.initialize(element);
    });
});
