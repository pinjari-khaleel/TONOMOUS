var TONOMUS = TONOMUS || {};
TONOMUS.recaptcha = (function(){

    function initialize(element, sitekey) {   
        element.forEach((el) => {   
        	const formContainer = el.closest("form");
        	const submitButtonEl = formContainer.querySelector(".cmp-form-button");

            if (submitButtonEl != undefined || submitButtonEl != null) {    
            	bindButtonSubmitEvent(formContainer, sitekey);
            }            
        });	     
    }

    function loadScript(sitekey) {        
        let script = document.createElement("script");
        script.setAttribute("async","");
        script.setAttribute("defer","");
        script.src = "https://www.google.com/recaptcha/api.js?render=" + sitekey;
        document.body.appendChild(script);
    }
    
    function bindButtonSubmitEvent(form, sitekey) {
        form.addEventListener('submit', async function (event) {
            event.preventDefault(); 
            formMessageReset();

        	const response = await fetch('/libs/granite/csrf/token.json');
    		const json = await response.json();
        
        	let csrfTokenInput = form.querySelector('input[name=":cq_csrf_token"]');
    		if (!csrfTokenInput?.value) {
        		// If the form does not have a CSRF token input, add one.
        		form.insertAdjacentHTML('beforeend', '<input type="hidden" name=":cq_csrf_token" value="${json.token}">');
    		} else {
        		// If the form already has a CSRF token input, update the value.
        		csrfTokenInput.value = json.token;
    		}

        	grecaptcha.ready(function() {
          		grecaptcha.execute(sitekey, {action: 'submit'}).then( async function(token) {
                    const recaptchaResponse = form.querySelector('input[name="g-recaptcha-response"]');
                    recaptchaResponse.value = token;
                    const formData = new FormData(form);
                    let responseData = {
                        error: false,
                        message: null,
                    };
                    let responseMessage = undefined;
                    
                    try {
                        const fetchRequest = post(form.action, formData);
                  
                        const [response] = await Promise.all([
                          fetchRequest.then((response) => response.json()),
                        ]);
                  
                        responseData = {
                          error: false,
                          message: response.status === 200 
                          ? 'Your request sent successfully.'
                          : 'An unknown error has occurred',
                        };
                  
                        responseMessage = {
                          message: response.message,
                          status: response.status,
                        };
                      } catch (err) {
                        const response = onError(err);
                        
                        responseData = response.data;
                        responseMessage = response.message;
                      } finally {
                        if (responseData) {
                            if (responseData.error) {
                                const errorMessage = document.createElement("p");
                                const errorIcon = document.createElement("span");
                                errorMessage.textContent = responseMessage.message;
                                errorMessage.classList.add('cmp-form__error-message');
                                errorIcon.classList.add('cmp-icon', 'cmp-icon__error-icon');
                                errorMessage.appendChild(errorIcon);
                                form.querySelector('.button').appendChild(errorMessage);
                                return;
                            }

                            const successModal = form.dataset.redirect;
                            const hashTagPosition = successModal.indexOf('#');
                            if (hashTagPosition !== -1) {
                                const modalForm = form.closest('.cmp-modal-form');
                                modalForm.classList.add('cmp-modal-form--success');
                                const modalId = successModal.slice(hashTagPosition, successModal.length);
                                const targetModalElement = document.querySelector(modalId);
                                if (targetModalElement) {
                                    event.preventDefault();
                                    modalForm.classList.remove('cmp-modal--visible');
                                    const successModal = targetModalElement.closest('.cmp-modal');
                                    successModal.classList.add('cmp-modal--visible');
                                    form.querySelector('.cmp-form-button').disabled = true;
                                    setTimeout(function() {
                                        successModal.classList.remove('cmp-modal--visible');
                                    }, 3000); // 3000 milliseconds = 3 seconds
                                }
                            }
                            !responseData.error && form.reset();
                        }
                    }
          		});
        	});
		});
    }

    function formMessageReset(form) {
        const formErrorMesage = form?.querySelector('.cmp-form__error-message');
        const modalFormSuccess = form?.closest('.cmp-modal-form--success');
        formErrorMesage && formErrorMesage.remove();
        modalFormSuccess && modalFormSuccess.remove();

    }

    function onError(error) {    
        let errorResponse = {
          data: {
            error: true,
            message: "An error occurred during the preparation of the dispatch",
          },
          message: {
            status: 0,
            message: 'An unknown error has occurred',
          },
        };
    
        if (error) {
          errorResponse.message.status = error.status ?? 0;
          errorResponse.message.message = error.message ?? 'An unknown error has occurred';
          return errorResponse;
        } else {
          return errorResponse;
        }
    }

    async function post(url = '', data, options = {}) {
        const OPTIONS = {
            method: 'POST',
            cache: 'no-cache',
            body: data,
            ...options,
          };
        
          const response = await fetch(url, OPTIONS);
          if (response.ok) {
            return response;
          }
        
          const error = new Error({
            message: `Network response to fetch request was not ok! Target URL: ${url}.`,
            status: response.status,
          });
        
          throw error;
    }

    function printFormData(formData) {
        for (var pair of formData.entries()) {
            console.log(pair[0]+ '=' + pair[1]); 
        }
    }
    
    return {
        initialize: function(element, sitekey) {
            initialize(element, sitekey);
        },
        loadScript: function(sitekey) {
            loadScript(sitekey);
        }
    }
})();

(function() {    
 
    function getSiteKey() {
        const recaptchaContainer = document.querySelector('.cmp-form-recaptcha');
        if (recaptchaContainer) {
    	return recaptchaContainer.dataset.sitekey ? recaptchaContainer.dataset.sitekey : recaptchaContainer.getAttribute('data-sitekey');
        }
    }
    
    function onDocumentReady() { 
        const tonomusRecaptchaContainer = document.querySelectorAll('.cmp-form-recaptcha');
		const sitekey = getSiteKey();
		if (tonomusRecaptchaContainer.length !== 0) {
            TONOMUS.recaptcha.loadScript(sitekey);          
            window.addEventListener('load', () => {   
        		TONOMUS.recaptcha.initialize(tonomusRecaptchaContainer, sitekey);
			});            
        }
    }    
	
    if (document.readyState !== "loading") { 
        onDocumentReady();        
    } else {
        document.addEventListener("DOMContentLoaded", onDocumentReady);
    }
    
}());