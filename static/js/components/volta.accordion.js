/**
 * Copyright (c) 2001-present, Vonage.
 *
 * Accordions (requires core)
 */

'use strict';

Volta.accordion = function () {
	var _type = {
		standard: 0,
		js: 1
	}

	var _class = {
		standard: {
			container: 'Vlt-accordion',
			trigger: 'Vlt-accordion__trigger',
			triggerActive: 'Vlt-accordion__trigger_active',
			content: 'Vlt-accordion__content',
			contentOpen: 'Vlt-accordion__content_open',
			contentOpening: 'Vlt-accordion__content_opening',
			contentClosing: 'Vlt-accordion__content_closing',
		},
		js: {
			content: 'Vlt-js-accordion__content',
			contentOpen: 'Vlt-js-accordion__content_open',
			contentOpening: 'Vlt-js-accordion__content_opening',
			contentClosing: 'Vlt-js-accordion__content_closing',
			trigger: 'Vlt-js-accordion__trigger',
			triggerActive: 'Vlt-js-accordion__trigger_active'
		}
	}

	function _accordion() {}

	_accordion.prototype = {
		init: function(elementOrId, suppressClickHandler, triggerElem) {
			var element;

			if(elementOrId.classList) {
				element = elementOrId;
			} else if (elementOrId.substring(0, 1) === "#") {
				element = document.querySelector(elementOrId);
			} else {
				element = document.querySelector('#' + elementOrId);
			}

			if(Volta._hasClass(element, _class.standard.container)) {
				this._parent = element;
				this._triggers = this._parent.querySelectorAll('.' + _class.standard.trigger);
				this._panels = this._parent.querySelectorAll('.' + _class.standard.content);

				this._triggerActive = undefined;
				this._panelOpen = undefined;

				if(!suppressClickHandler) {
					var _this = this;
					_this._triggers.forEach(function(trigger) {
						trigger.addEventListener('click', function(){
							_this.toggle(trigger);
						});
					});
				}
			} else {
				var _this = this;
				_this._content = element;
				
				if(triggerElem) {
					_this.trigger = triggerElem;
				} else if(_this._content.dataset.trigger) {
					var triggerId = _this._content.dataset.trigger;
					_this.trigger = document.querySelector('#' + triggerId);
				} else {
					console.warn("Volta: js accordion trigger missing");
				}

				if(!suppressClickHandler) {
					_this.trigger.addEventListener('click', function(){
						_this.toggle();
					});
				}

			}
		},
		close: function() {
			if(this.trigger) {
				this._closeJsAccordion();
			} else {
				this._closeStandardAccordion(triggerElement);
			}
		},
		_closeJsAccordion: function() {
			this.trigger.classList.remove(_class.js.triggerActive);
			this._content.classList.add(_class.js.contentClosing);

			this._content.style.height = window.getComputedStyle(this._content).height;
			this._content.offsetHeight; // force repaint
			this._content.style.height = '0px';

			var _this = this;
			this._content.addEventListener('transitionend', function closingTransitionEndEvent(event) {
				if (event.propertyName == 'height') {
					_this._content.classList.remove(_class.js.contentClosing);
					_this._content.classList.remove(_class.js.contentOpen);
					_this._content.style.height = '0px';
					_this._content.removeEventListener('transitionend', closingTransitionEndEvent, false);
				}
			}, { passive: true });
		},
		_closeStandardAccordion: function(triggerElement) {
			var _this = this;
			var panel = this._panelOpen;
			this._triggerActive.classList.remove(_class.standard.triggerActive);
			panel.classList.add(_class.standard.contentClosing);

			panel.style.height = window.getComputedStyle(panel).height;
			panel.offsetHeight; // force repaint
			panel.style.height = '0px';

			var _this = this;
			panel.addEventListener('transitionend', function closingTransitionEndEvent(event) {
				if (event.propertyName == 'height') {
					panel.classList.remove(_class.standard.contentClosing);
					panel.classList.remove(_class.standard.contentOpen);
					panel.style.height = '0px';
					panel.removeEventListener('transitionend', closingTransitionEndEvent, false);

					if(triggerElement && triggerElement === _this._triggerActive){
						_this._triggerActive = undefined;
						_this._panelOpen = undefined;
					}
				}
			}, { passive: true });
		},
		open: function() {
			if(this.trigger) {
				this._openJsAccordion();
			} else {
				this._openStandardAccordion(triggerElement);
			}
		},
		_openJsAccordion: function() {
			this.trigger.classList.add(_class.js.triggerActive);
			this._content.classList.add(_class.js.contentOpening);

			var startHeight = this._content.style.height;
			this._content.style.height = 'auto';
			var endHeight = window.getComputedStyle(this._content).height;
			this._content.style.height = startHeight;
			this._content.offsetHeight; // force repaint
			this._content.style.height = endHeight;

			var _this = this;
			this._content.addEventListener('transitionend', function openingTransitionEndEvent(event) {
				if (event.propertyName == 'height') {
					_this._content.style.height = 'auto';
					_this._content.classList.remove(_class.js.contentOpening);
					_this._content.classList.add(_class.js.contentOpen);
					_this._content.removeEventListener('transitionend', openingTransitionEndEvent, false);
				}
			}, { passive: true });
		},
		_openStandardAccordion: function(triggerElement) {
			if(this._triggerActive) {
				this._closeStandardAccordion();
			}
			this._triggerActive = triggerElement;
			this._panelOpen = this._triggerActive.nextElementSibling;

			this._triggerActive.classList.add(_class.standard.triggerActive);
			this._panelOpen.classList.add(_class.standard.contentOpening);

			var startHeight = this._panelOpen.style.height;
			this._panelOpen.style.height = 'auto';
			var endHeight = window.getComputedStyle(this._panelOpen).height;
			this._panelOpen.style.height = startHeight;
			this._panelOpen.offsetHeight; // force repaint
			this._panelOpen.style.height = endHeight;

			var _this = this;
			this._panelOpen.addEventListener('transitionend', function openingTransitionEndEvent(event) {
				if (event.propertyName == 'height') {
					_this._panelOpen.style.height = 'auto';
					_this._panelOpen.classList.remove(_class.standard.contentOpening);
					_this._panelOpen.classList.add(_class.standard.contentOpen);
					_this._panelOpen.removeEventListener('transitionend', openingTransitionEndEvent, false);
				}
			}, { passive: true });
		},
		toggle: function(triggerElement) {
			if(this.trigger) {
				this._toggleJsAccordion();
			} else {
				this._toggleStandardAccordion(triggerElement);
			}
		},
		_toggleJsAccordion: function() {
			if(Volta._hasClass(this._content, _class.js.contentOpen)) {
				this._closeJsAccordion();
			} else {
				this._openJsAccordion();
			}
		},
		_toggleStandardAccordion: function(triggerElement) {
			if(this._triggerActive && this._triggerActive === triggerElement) {
				this._closeStandardAccordion(triggerElement);
			} else {
				this._openStandardAccordion(triggerElement);
			}
		}
	}

	return {
		create: create,
		init: initialise
	}

	/**
	 *	@public
	 *
	 *	@description Create an individual accordion object
	 *	@param {Element|string} elementOrId Reference to the accordion content element or the id
	 *	@param {boolean} suppressClickHandler Whether click events should be attached on creation
	 *	@param {Element} _trigger Private required for legacy accordions
	 *  @return {Object}
	 */
	function create(elementOrId, suppressClickHandler, _trigger) {	
		if(!elementOrId) {
			console.warn("Volta: no parameter supplied to accordion.create()");
		} 
		var accordion = Object.create(_accordion.prototype, {});
		accordion.init(elementOrId, suppressClickHandler, _trigger);

		return accordion;
	}

	/**
	 *	@public
	 *
	 *	@description Initialise all the accordions on the current screen
	 */
	function initialise() {
		//standard
		var standardAccordions = document.querySelectorAll('.' + _class.standard.container);

		if(standardAccordions.length) {
			standardAccordions.forEach(function(accordion){
				create(accordion);
			});
		}
		
		//js
		var triggers = document.querySelectorAll('.' + _class.js.trigger + '[data-accordion]');
		if(triggers.length > 0) {
			triggers.forEach(function(trigger) {
				var accordionId = trigger.dataset.accordion;
				if(!accordionId) {
					return;
				}
				create(accordionId, false, trigger);
			});
		}

		//js - legacy
		var jsAccordions = document.querySelectorAll('.' + _class.js.content + '[data-trigger]');
		if(jsAccordions.length > 0) {
			jsAccordions.forEach(function(jsLegacy) {
				create(jsLegacy);
			});
		}
	}
}();
