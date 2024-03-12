var TONOMUS = TONOMUS || {};
TONOMUS.video = (function(){
    function video(element) {
         this.initialize = function(element) {
            this.videoThumbnail = element.querySelector('.cmp-video__thumbnail-wrapper');
            this.videoplayBtn = element.querySelector('.cmp-video__play-btn');
            this.videoWrapper = element.querySelector('.cmp-video__video');
            this.videoIframe = element.querySelector('iframe')
            this.registerEventListeners();
        }
        
        this.loadVideo = function() {
            const video = document.createElement('video');
            const source = document.createElement('source');
    
            source.src = this.videoWrapper.getAttribute('data-src');
            source.type = this.videoWrapper.getAttribute('data-type');
            
            video.autoplay = this.videoWrapper.getAttribute('data-autoplay');
            video.loop = this.videoWrapper.getAttribute('data-loop');
            video.muted = this.videoWrapper.getAttribute('data-muted');
            video.controls = true;
    
            video.appendChild(source);
            this.videoWrapper.appendChild(video);
        }
        
        
        this.handleVideoClickEvent = function(event) {
            const {target} = event;
            const video = target.closest('.cmp-video');
            video.classList.add('cmp-video--visible');
    
            if (this.videoWrapper) {
                this.loadVideo();
                setTimeout(() => {
                    const videoElement = video.querySelector('video');
                    if (videoElement) {
                      videoElement.play();
                    }
                }, 300);
            }
            
            if (this.videoIframe) {
                this.videoIframe.src += "&autoplay=1&mute=1";
            }
        
        }
    
        this.registerEventListeners = function() {
            this.videoThumbnail.addEventListener('click', this.handleVideoClickEvent.bind(this));
            this.videoplayBtn.addEventListener('click', this.handleVideoClickEvent.bind(this));
        }

        this.initialize(element);
    }
    

    return function(element) {
        new video(element);
    }
})();
window.addEventListener('load', () => {
    document.querySelectorAll('.cmp-video')?.forEach(function(element) {
        TONOMUS.video(element);
    });
});