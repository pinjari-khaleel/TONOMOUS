var TONOMUS = TONOMUS || {};

TONOMUS.horizontalTab = (function() {
    function HorizontalTab(element) {

		this.initialize = function(element) {
            this.tabNavigationItems = element.querySelectorAll('.cmp-tabs__tab') || [];
            this.tabList = element.querySelector('.cmp-tabs__tablist');
            this.tabPanels = element.querySelectorAll('.cmp-tabs__tabpanel') || [];
            this.tabNavigationControls = element.querySelector('.cmp-horizontaltabs__action-container');
            this.previousButton = element.querySelector('.cmp-horizontaltabs__previous-button');
            this.nextButton = element.querySelector('.cmp-horizontaltabs__next-button');
            this.visibleCount = 0;
            this.itemTotalCount = 0;
            this.scrollValue = 250;
            this.nextCardIndex = 0;

            if (this.previousButton) this.previousButton.disabled = true;
            this.handleTabChange();
            this.registerEventListeners();
        }

        this.isCardVisible = function(card) {
            if (card) {
                const rect = card.getBoundingClientRect();
                return rect.right < (window.innerWidth || document.documentElement.clientWidth) && rect.left > 0;
            }
            return false;
        }

        this.countCardVisibility = function(card) {
            if (this.isCardVisible(card)) {
              this.visibleCount++;
            }
        }

        this.updateButtonState = function() {
            const scrollContainer = this.getScrollContainer(this.getActiveTab());
            if (this.previousButton && scrollContainer) {
                this.previousButton.disabled = this.isCardVisible(scrollContainer.firstElementChild);
            }
            if (this.nextButton && scrollContainer) {
                this.nextButton.disabled = this.isCardVisible(scrollContainer.lastElementChild);
            }
        }

        this.updateArrowsVisibility = function(scrollContainer) {
            if (this.visibleCount === 0 || this.visibleCount === this.itemTotalCount) {
                scrollContainer.parentElement.classList.remove('cmp-container__content--scroll-enabled');
                this.tabNavigationControls.classList.remove('cmp-horizontaltabs__action-container--scroll-enabled');
            } else {
                scrollContainer.parentElement.classList.add('cmp-container__content--scroll-enabled');
                this.tabNavigationControls.classList.add('cmp-horizontaltabs__action-container--scroll-enabled');
            }
        }

        this.registerEventListeners = function() {
            window.addEventListener('resize', this.handleTabChange.bind(this));
            screen.orientation.addEventListener("change", this.handleTabChange.bind(this));
            this.addTabClickEvent();
            this.addContainersScrollEvent();
            this.addPreviousButtonEvent();
            this.addNextButtonEvent();
        }

        this.addTabClickEvent = function() {
            this.tabNavigationItems?.forEach(function(tabElement) {
                tabElement.addEventListener('click', this.handleTabChange.bind(this));
                tabElement.addEventListener('click', this.handleTabChangeMobile.bind(this));

            }.bind(this));
        }
      
        this.addContainersScrollEvent = function() {
            this.tabPanels?.forEach(function(tabContainer) {
                this.getScrollContainer(tabContainer).addEventListener('scroll', this.updateButtonState.bind(this));
            }.bind(this));
        }

        this.addPreviousButtonEvent = function() {
            this.previousButton.addEventListener('click', function() {
                const scrollContainer = this.getScrollContainer(this.getActiveTab());
                if (scrollContainer) {
                    scrollContainer.scrollLeft = scrollContainer.scrollLeft - this.getScrollValue(scrollContainer);
                }
                this.nextCardIndex--;
            }.bind(this));
        }

        this.addNextButtonEvent = function() {
            this.nextButton.addEventListener('click', function() {
                const scrollContainer = this.getScrollContainer(this.getActiveTab());
                if (scrollContainer) {
                    scrollContainer.scrollLeft = scrollContainer.scrollLeft + this.getScrollValue(scrollContainer);
                }
                this.nextCardIndex++;
            }.bind(this));
        }

        this.handleTabChangeMobile = function() {
            // mobile action on tabclick
            if (window.innerWidth < 1400) {
                this.tabList?.classList.toggle("cmp-tabs__tablist--expanded");
            }
        }

        this.handleTabChange = function() {
            var activeTab = this.getActiveTab();
            if (activeTab) {
                const scrollContainer = this.getScrollContainer(activeTab);
                const contentItems = scrollContainer?.children || [];
                if (contentItems && contentItems.length > 0) {
                    this.itemTotalCount = contentItems.length;
                    this.nextCardIndex = 0;
                    this.updateButtonState();
                    this.visibleCount = 0;
                    Array.from(contentItems).forEach((contentItem) => {
                        this.countCardVisibility(contentItem);
                    });
                    this.updateArrowsVisibility(scrollContainer);
                }
                else {
                    this.visibleCount = -1;
                }
            }
        }

        this.getActiveTab = function() {
            return element.querySelector('.cmp-tabs__tabpanel--active');
        }

        this.getScrollValue = function(scrollContainer) {
            return scrollContainer?.children[this.nextCardIndex]?.getBoundingClientRect().width || 250;
        }

        this.getScrollContainer = function(tabContainer) {
            return tabContainer?.querySelector('.cmp-container__content > div');
        }

        this.initialize(element);
    }

    return function(element) {
        new HorizontalTab(element);
    }
})();

window.addEventListener('load', () => {
    document.querySelectorAll('.cmp-horizontaltabs')?.forEach(function(element) {
        TONOMUS.horizontalTab(element);
    });
});