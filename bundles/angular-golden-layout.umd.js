(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('golden-layout'), require('@angular/common')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', 'golden-layout', '@angular/common'], factory) :
	(factory((global.ng = global.ng || {}, global.ng['angular-golden-layout'] = {}),global.ng.core,global.GoldenLayout,global.ng.common));
}(this, (function (exports,core,GoldenLayout,common) { 'use strict';

var GOLDEN_LAYOUT_CONFIG = new core.InjectionToken('GOLDEN_LAYOUT_CONFIG');
var GoldenLayoutEvents = [
    'initialised',
    'stateChanged',
    'windowOpened',
    'windowClosed',
    'selectionChanged',
    'itemDestroyed',
    'itemCreated',
    'componentCreated',
    'rowCreated',
    'columnCreated',
    'stackCreated',
    'tabCreated'
];
var GoldenLayoutConfig = (function () {
    function GoldenLayoutConfig(config) {
        if (config === void 0) { config = {}; }
        this.assign(config);
    }
    GoldenLayoutConfig.prototype.assign = function (config, target) {
        if (config === void 0) { config = {}; }
        target = target || this;
        for (var key in config) {
            if (config[key] != null && !(Array.isArray(config[key])) &&
                typeof config[key] === 'object' && !(config[key] instanceof HTMLElement)) {
                target[key] = {};
                this.assign(config[key], target[key]);
            }
            else {
                target[key] = config[key];
            }
        }
    };
    return GoldenLayoutConfig;
}());

// export type DropzoneUrlFunction = (files: any) => string;
// export type DropzoneMethodFunction = (files: any) => string;
// export type DropzoneParamsFunction = (files: any, xhr: any, chunk?: any) => any;
// export type DropzoneHeadersFunction = () => any;
// export type DropzoneInitFunction = () => any;
// export type DropzoneFallbackFunction = () => HTMLElement;
// export type DropzoneAcceptFunction = (file: File, done: Function) => any;
// export type DropzoneResizeFunction = (file: File, width: number, height: number, resizeMethod: string) => any;
// export type DropzoneRenameFileFunction = (file: File) => string;
// export type DropzoneTransformFileFunction = (file: File, done: Function) => any;
// export type DropzoneChunksUploadedFunction = (file: File, done: Function) => any;

var GoldenLayoutContainer = new core.InjectionToken('GoldenLayoutContainer');
var GoldenLayoutComponentState = new core.InjectionToken('GoldenLayoutComponentState');
var COMPONENT_REF_KEY = '$componentRef';
var GoldenLayoutDirective = (function () {
    function GoldenLayoutDirective(resolver, zone, renderer, elementRef, differs, viewContainer, injector, defaults) {
        this.resolver = resolver;
        this.zone = zone;
        this.renderer = renderer;
        this.elementRef = elementRef;
        this.differs = differs;
        this.viewContainer = viewContainer;
        this.injector = injector;
        this.defaults = defaults;
        this.disabled = false;
        this.contentChange = new core.EventEmitter();
        this.GL_INITIALISED = new core.EventEmitter();
        this.GL_STATECHANGED = new core.EventEmitter();
        this.GL_WINDOWOPENED = new core.EventEmitter();
        this.GL_WINDOWCLOSED = new core.EventEmitter();
        this.GL_SELECTIONCHANGED = new core.EventEmitter();
        this.GL_ITEMDESTROYED = new core.EventEmitter();
        this.GL_ITEMCREATED = new core.EventEmitter();
        this.GL_COMPONENTCREATED = new core.EventEmitter();
        this.GL_ROWCREATED = new core.EventEmitter();
        this.GL_COLUMNCREATED = new core.EventEmitter();
        this.GL_STACKCREATED = new core.EventEmitter();
        this.GL_TABCREATED = new core.EventEmitter();
        
    }
    GoldenLayoutDirective.prototype.ngOnInit = function () {
        var params = new GoldenLayoutConfig(this.defaults);
        console.log('config', this.config);
        console.log('content', this.content);
        params.assign(this.config);
        params.assign({ content: this.content });
        // this.zone.runOutsideAngular(() => {
        this.instance = new GoldenLayout(params, this.elementRef.nativeElement);
        // });
        if (!this.configDiff) {
            this.configDiff = this.differs.find(this.config || {}).create();
            this.configDiff.diff(this.config || {});
        }
    };
    GoldenLayoutDirective.prototype.ngAfterViewInit = function () {
        var _this = this;
        console.log('>>> in after view init');
        //init golden layout
        // this.zone.runOutsideAngular(() => {
        this.componentDefinitions.forEach(function (componentDefinition) {
            console.log('componentDefinition', componentDefinition);
            _this.registerComponent(componentDefinition);
        });
        console.log('>>> init state changed');
        this.instance.on('stateChanged', function () {
            console.log('>>> state changed', _this.instance.toConfig());
            _this.content = _this.instance.toConfig().content;
        });
        //TODO fix destroy
        this.instance.on('itemDestroyed', function (item) {
            var container = item.container;
            var component = container && container[COMPONENT_REF_KEY];
            if (component) {
                component.destroy();
                container[COMPONENT_REF_KEY] = null;
            }
        });
        // Add native Golden Layout event handling
        GoldenLayoutEvents.forEach(function (eventName) {
            _this.instance.on(eventName.toLowerCase(), function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                args = (args.length === 1) ? args[0] : args;
                if (_this["GL_" + eventName.toUpperCase()]) {
                    _this.zone.run(function () {
                        _this["GL_" + eventName.toUpperCase()].emit(args);
                    });
                }
            });
        });
        this.instance.init();
        // });
    };
    Object.defineProperty(GoldenLayoutDirective.prototype, "content", {
        get: function () {
            return this._content;
        },
        set: function (val) {
            this._content = val;
            this.contentChange.emit(this._content);
        },
        enumerable: true,
        configurable: true
    });
    GoldenLayoutDirective.prototype.updateSize = function (width, height) {
        if (this.instance) {
            this.instance.updateSize(width, height);
        }
    };
    // public getComponent(name: string): void {
    //   if (this.instance) {
    //     this.instance.getComponent(name);
    //   }
    // }
    // public getComponent(name: string): void {
    //   if (this.instance) {
    //     this.instance.getComponent(name);
    //   }
    // }
    GoldenLayoutDirective.prototype.registerComponent = 
    // public getComponent(name: string): void {
    //   if (this.instance) {
    //     this.instance.getComponent(name);
    //   }
    // }
    function (goldenLayoutComponentDefinitions) {
        var _this = this;
        this.instance.registerComponent(goldenLayoutComponentDefinitions.componentName, function (container, componentState) {
            // Inputs need to be in the following format to be resolved properly
            // let inputProviders = Object.keys(componentState).map((inputName) => {return {provide: inputName, useValue: componentState[inputName]};});
            // inputProviders.push({
            //     provide: GoldenLayoutContainer,
            //     useValue: container
            //   });
            // console.log('inputProviders', inputProviders)
            var injector = _this._createComponentInjector(container, componentState);
            var factory = _this.resolver.resolveComponentFactory(goldenLayoutComponentDefinitions.componentType);
            var componentRef = _this.viewContainer.createComponent(factory, undefined, injector);
            // (componentRef.instance).data = componentState;
            // console.log('componentState', componentState)
            // Bind the new component to container's client DOM element.
            container.getElement().append($(componentRef.location.nativeElement));
            componentRef.changeDetectorRef.detectChanges();
            // this._bindEventHooks(container, componentRef.instance);
            // Store a ref to the componentRef in the container to support destruction later on.
            // this._bindEventHooks(container, componentRef.instance);
            // Store a ref to the componentRef in the container to support destruction later on.
            container[COMPONENT_REF_KEY] = componentRef;
            // // We create an injector out of the data we want to pass down and this components injector
            // // let injector = ReflectiveInjector.fromResolvedProviders(resolvedInputs, container.parentInjector);
            // // We create a factory out of the component we want to create
            // let factory = this.resolver.resolveComponentFactory(componentClass);
            // // We create the component using the factory and the injector
            // let component = factory.create(injector);
            // // We insert the component into the dom container
            // console.log('>>>> created component', component)
            // container.insert(component.hostView);
        });
    };
    GoldenLayoutDirective.prototype.createDragSource = function (element, componentConfiguration) {
        if (this.instance) {
            this.instance.createDragSource(element, componentConfiguration);
        }
    };
    GoldenLayoutDirective.prototype._createComponentInjector = function (container, componentState) {
        return core.ReflectiveInjector.resolveAndCreate([
            {
                provide: GoldenLayoutContainer,
                useValue: container
            },
            {
                provide: GoldenLayoutComponentState,
                useValue: componentState
            },
        ], this.injector);
    };
    GoldenLayoutDirective.prototype.ngDoCheck = function () {
        if (!this.disabled && this.configDiff) {
            var changes = this.configDiff.diff(this.config || {});
            if (changes && this.instance) {
                this.ngOnDestroy();
                this.ngOnInit();
            }
        }
    };
    GoldenLayoutDirective.prototype.ngOnDestroy = function () {
        var _this = this;
        if (this.instance) {
            this.zone.runOutsideAngular(function () {
                _this.instance.destroy();
            });
            this.instance = null;
        }
    };
    GoldenLayoutDirective.prototype.ngOnChanges = function (changes) {
        var _this = this;
        if (this.instance && changes['disabled']) {
            if (changes['disabled'].currentValue !== changes['disabled'].previousValue) {
                if (changes['disabled'].currentValue === false) {
                    this.zone.runOutsideAngular(function () {
                        _this.instance.enable();
                    });
                }
                else if (changes['disabled'].currentValue === true) {
                    this.zone.runOutsideAngular(function () {
                        _this.instance.disable();
                    });
                }
            }
        }
    };
    GoldenLayoutDirective.prototype.goldenLayout = function () {
        return this.instance;
    };
    GoldenLayoutDirective.decorators = [
        { type: core.Directive, args: [{
                    selector: '[golden-layout]',
                    exportAs: 'angularGoldenLayout'
                },] },
    ];
    /** @nocollapse */
    GoldenLayoutDirective.ctorParameters = function () { return [
        { type: core.ComponentFactoryResolver, },
        { type: core.NgZone, },
        { type: core.Renderer2, },
        { type: core.ElementRef, },
        { type: core.KeyValueDiffers, },
        { type: core.ViewContainerRef, },
        { type: core.Injector, },
        { type: GoldenLayoutConfig, decorators: [{ type: core.Optional }, { type: core.Inject, args: [GOLDEN_LAYOUT_CONFIG,] },] },
    ]; };
    GoldenLayoutDirective.propDecorators = {
        "el": [{ type: core.ViewChild, args: ['glroot',] },],
        "disabled": [{ type: core.Input },],
        "config": [{ type: core.Input, args: ['golden-layout',] },],
        "contentChange": [{ type: core.Output },],
        "componentDefinitions": [{ type: core.Input },],
        "GL_INITIALISED": [{ type: core.Output, args: ['initialised',] },],
        "GL_STATECHANGED": [{ type: core.Output, args: ['stateChanged',] },],
        "GL_WINDOWOPENED": [{ type: core.Output, args: ['windowOpened',] },],
        "GL_WINDOWCLOSED": [{ type: core.Output, args: ['windowClosed',] },],
        "GL_SELECTIONCHANGED": [{ type: core.Output, args: ['selectionChanged',] },],
        "GL_ITEMDESTROYED": [{ type: core.Output, args: ['itemDestroyed',] },],
        "GL_ITEMCREATED": [{ type: core.Output, args: ['itemCreated',] },],
        "GL_COMPONENTCREATED": [{ type: core.Output, args: ['componentCreated',] },],
        "GL_ROWCREATED": [{ type: core.Output, args: ['rowCreated',] },],
        "GL_COLUMNCREATED": [{ type: core.Output, args: ['columnCreated',] },],
        "GL_STACKCREATED": [{ type: core.Output, args: ['stackCreated',] },],
        "GL_TABCREATED": [{ type: core.Output, args: ['tabCreated',] },],
        "content": [{ type: core.Input },],
    };
    return GoldenLayoutDirective;
}());

var GoldenLayoutComponent = (function () {
    function GoldenLayoutComponent() {
        this.disabled = false;
        this.useGoldenLayoutClass = true;
    }
    GoldenLayoutComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'golden-layout',
                    exportAs: 'angularGoldenLayout',
                    template: '<div></div>',
                },] },
    ];
    /** @nocollapse */
    GoldenLayoutComponent.ctorParameters = function () { return []; };
    GoldenLayoutComponent.propDecorators = {
        "disabled": [{ type: core.Input },],
        "config": [{ type: core.Input },],
        "useGoldenLayoutClass": [{ type: core.Input },],
        "directiveRef": [{ type: core.ViewChild, args: [GoldenLayoutDirective,] },],
    };
    return GoldenLayoutComponent;
}());

var GoldenLayoutModule = (function () {
    function GoldenLayoutModule() {
    }
    GoldenLayoutModule.decorators = [
        { type: core.NgModule, args: [{
                    imports: [common.CommonModule],
                    declarations: [GoldenLayoutComponent, GoldenLayoutDirective],
                    exports: [common.CommonModule, GoldenLayoutComponent, GoldenLayoutDirective]
                },] },
    ];
    /** @nocollapse */
    GoldenLayoutModule.ctorParameters = function () { return []; };
    return GoldenLayoutModule;
}());

exports.GoldenLayoutComponent = GoldenLayoutComponent;
exports.GoldenLayoutDirective = GoldenLayoutDirective;
exports.GoldenLayoutComponentState = GoldenLayoutComponentState;
exports.GoldenLayoutContainer = GoldenLayoutContainer;
exports.GOLDEN_LAYOUT_CONFIG = GOLDEN_LAYOUT_CONFIG;
exports.GoldenLayoutConfig = GoldenLayoutConfig;
exports.GoldenLayoutModule = GoldenLayoutModule;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=angular-golden-layout.umd.js.map
