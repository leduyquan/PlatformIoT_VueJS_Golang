var lat, latDefault;
lat = latDefault = 13.71594;
var lng, lngDefault;
lng = lngDefault = 100.55803;
window.mapStyles = [
    {
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#1b3e54"
            }
        ]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#1a3646"
            }
        ]
    },
    {
        "featureType": "administrative.country",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#4b6878"
            }
        ]
    },
    {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "administrative.province",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#4b6878"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#1b3e54"
            }
        ]
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#334e87"
            }
        ]
    },
    {
        "featureType": "landscape.natural",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#1b3e54"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#2a5061"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#6f9ba5"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#1d2c4d"
            }
        ]
    },
    {
        "featureType": "poi.business",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#153244"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#10303b"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#1d2c4d"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#10303b"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#255763"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#023e58"
            }
        ]
    },
    {
        "featureType": "transit",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#98a5be"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#1d2c4d"
            }
        ]
    },
    {
        "featureType": "transit.line",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#283d6a"
            }
        ]
    },
    {
        "featureType": "transit.station",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#3a4762"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#0f1e28"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    }
] ;

window.getLoadingIcon = function (isShow){
    if($('.loading-spin').length){
        if(isShow){
            $('.loading-spin').show();
        }else{
            $('.loading-spin').hide();
        }
    }else{
        var spinIcon = $('<div class="loading-spin">');
        var spinHTML ='<div class="ls-fading-circle">';
        spinHTML += '<div class="ls-circle1 ls-circle"></div>';
        spinHTML += '<div class="ls-circle2 ls-circle"></div>';
        spinHTML += '<div class="ls-circle3 ls-circle"></div>';
        spinHTML += '<div class="ls-circle4 ls-circle"></div>';
        spinHTML += '<div class="ls-circle5 ls-circle"></div>';
        spinHTML += '<div class="ls-circle6 ls-circle"></div>';
        spinHTML += '<div class="ls-circle7 ls-circle"></div>';
        spinHTML += '<div class="ls-circle8 ls-circle"></div>';
        spinHTML += '<div class="ls-circle9 ls-circle"></div>';
        spinHTML += '<div class="ls-circle10 ls-circle"></div>';
        spinHTML += '<div class="ls-circle11 ls-circle"></div>';
        spinHTML += '<div class="ls-circle12 ls-circle"></div>';
        spinHTML += '</div>';
        spinIcon.html(spinHTML);
        $('body .main .container').append(spinIcon);
        spinIcon.show();
    }
}

$(document).ready(function() {
    //common function
    $('.toggle-sidebar-button').on('click',function (){
        $('.page-with-sidebar').toggleClass('page-with-icon-sidebar');
        $('.nav-sidebar').toggleClass('sidebar-icons-only');
        $('.nav-sidebar-admin').toggleClass('show-tab');
        if ($('.nav-sidebar-sub').hasClass('show')){
            $('.admin-content-wrapper').toggleClass('collapse-has-sub');
        } else {
            $('.admin-content-wrapper').toggleClass('collapse-none-sub');
        }
    });

    if($(window).width() < 1280 ){
        $('.page-with-sidebar').addClass('page-with-icon-sidebar');
        $('.nav-sidebar').addClass('sidebar-icons-only');
    }
    editTopPart();
    $( window ).resize(function() {
        editTopPart();
        if($(window).width() < 1280 ){
            $('.page-with-sidebar').addClass('page-with-icon-sidebar'); 
            $('.nav-sidebar').addClass('sidebar-icons-only');
        }
        $('.responsive-nav').removeClass("show");
    });
    //change the way show the tab buttons for mobile
    $(document).on('click','.responsive-nav .nav-item > a',function(){
        $(this).parents('.responsive-nav').toggleClass('show');
    });
    $(document).on('click','.nav-mobile > li:not(".active")',function(){
        $(this).parent().children().removeClass("active");
        $(this).addClass("active");
        $(this).parent().removeClass('show');
    });

    $(document).on('click','.nav-mobile > li.active',function(){
        $(this).parent().toggleClass('show');
    });
});

window.editTopPart = function (){
    var topHeaderHeight = $('.main-header .navbar-fixed-top').height();
    if (topHeaderHeight > 60){
        $('.main').css('padding-top',topHeaderHeight);
    }
    else{
        $('.main').css('padding-top','56px');
    }
};

L.DrawToolbar = L.Toolbar.extend({

    statics: {
        TYPE: 'draw'
    },

    options: {
        polyline: {},
        polygon: {},
        rectangle: {},
        circle: {},
        marker: {},
        circlemarker: {},
        heatpolygon: {},
        heatmarker: false
    },

    // @method initialize(): void
    initialize: function (options) {
        // Ensure that the options are merged correctly since L.extend is only shallow
        for (var type in this.options) {
            if (this.options.hasOwnProperty(type)) {
                if (options[type]) {
                    options[type] = L.extend({}, this.options[type], options[type]);
                }
            }
        }

        this._toolbarClass = 'leaflet-draw-draw';
        L.Toolbar.prototype.initialize.call(this, options);
    },

    // @method getModeHandlers(): object
    // Get mode handlers information
    getModeHandlers: function (map) {
        return [
            {
                enabled: this.options.polyline,
                handler: new L.Draw.Polyline(map, this.options.polyline),
                title: L.drawLocal.draw.toolbar.buttons.polyline
            },
            {
                enabled: this.options.polygon,
                handler: new L.Draw.Polygon(map, this.options.polygon),
                title: L.drawLocal.draw.toolbar.buttons.polygon
            },
            {
                enabled: this.options.rectangle,
                handler: new L.Draw.Rectangle(map, this.options.rectangle),
                title: L.drawLocal.draw.toolbar.buttons.rectangle
            },
            {
                enabled: this.options.circle,
                handler: new L.Draw.Circle(map, this.options.circle),
                title: L.drawLocal.draw.toolbar.buttons.circle
            },
            {
                enabled: this.options.marker,
                handler: new L.Draw.Marker(map, this.options.marker),
                title: L.drawLocal.draw.toolbar.buttons.marker
            },
            {
                enabled: this.options.circlemarker,
                handler: new L.Draw.CircleMarker(map, this.options.circlemarker),
                title: L.drawLocal.draw.toolbar.buttons.circlemarker
            },
            {
                enabled: this.options.heatpolygon,
                handler: new L.Draw.HeatPolygon(map, this.options.heatpolygon),
                title: L.drawLocal.draw.toolbar.buttons.heatpolygon
            },
            {
                enabled: this.options.heatmarker,
                handler: new L.Draw.HeatMarker(map, this.options.heatmarker),
                title: L.drawLocal.draw.toolbar.buttons.heatmarker
            },
        ];
    },

    // @method getActions(): object
    // Get action information
    getActions: function (handler) {
        return [
            {
                enabled: handler.completeShape,
                title: L.drawLocal.draw.toolbar.finish.title,
                text: L.drawLocal.draw.toolbar.finish.text,
                callback: handler.completeShape,
                context: handler
            },
            {
                enabled: handler.deleteLastVertex,
                title: L.drawLocal.draw.toolbar.undo.title,
                text: L.drawLocal.draw.toolbar.undo.text,
                callback: handler.deleteLastVertex,
                context: handler
            },
            {
                title: L.drawLocal.draw.toolbar.actions.title,
                text: L.drawLocal.draw.toolbar.actions.text,
                callback: this.disable,
                context: this
            }
        ];
    },

    // @method setOptions(): void
    // Sets the options to the toolbar
    setOptions: function (options) {
        L.setOptions(this, options);

        for (var type in this._modes) {
            if (this._modes.hasOwnProperty(type) && options.hasOwnProperty(type)) {
                this._modes[type].handler.setOptions(options[type]);
            }
        }
    }
});

/**
 * @class L.Draw.Polygon
 * @aka Draw.Polygon
 * @inherits L.Draw.Polyline
 */
L.Draw.HeatPolygon = L.Draw.Polyline.extend({
    statics: {
        TYPE: 'heatpolygon'
    },

    Poly: L.Polygon,

    options: {
        showArea: false,
        showLength: false,
        shapeOptions: {
            stroke: true,
            color: '#3388ff',
            weight: 4,
            opacity: 0.5,
            fill: true,
            fillColor: null, //same as color by default
            fillOpacity: 0.2,
            clickable: true
        },
        // Whether to use the metric measurement system (truthy) or not (falsy).
        // Also defines the units to use for the metric system as an array of
        // strings (e.g. `['ha', 'm']`).
        metric: true,
        feet: true, // When not metric, to use feet instead of yards for display.
        nautic: false, // When not metric, not feet use nautic mile for display
        // Defines the precision for each type of unit (e.g. {km: 2, ft: 0}
        precision: {}
    },

    // @method initialize(): void
    initialize: function (map, options, type) {
        L.Draw.Polyline.prototype.initialize.call(this, map, options);

        // Save the type so super can fire, need to do this as cannot do this.TYPE :(
        this.type = L.Draw.HeatPolygon.TYPE;
    },

    _updateFinishHandler: function () {
        var markerCount = this._markers.length;

        // The first marker should have a click handler to close the polygon
        if (markerCount === 1) {
            this._markers[0].on('click', this._finishShape, this);
        }

        // Add and update the double click handler
        if (markerCount > 2) {
            this._markers[markerCount - 1].on('dblclick', this._finishShape, this);
            // Only need to remove handler if has been added before
            if (markerCount > 3) {
                this._markers[markerCount - 2].off('dblclick', this._finishShape, this);
            }
        }
    },

    _getTooltipText: function () {
        var text, subtext;

        if (this._markers.length === 0) {
            text = L.drawLocal.draw.handlers.polygon.tooltip.start;
        } else if (this._markers.length < 3) {
            text = L.drawLocal.draw.handlers.polygon.tooltip.cont;
            subtext = this._getMeasurementString();
        } else {
            text = L.drawLocal.draw.handlers.polygon.tooltip.end;
            subtext = this._getMeasurementString();
        }

        return {
            text: text,
            subtext: subtext
        };
    },

    _getMeasurementString: function () {
        var area = this._area,
            measurementString = '';


        if (!area && !this.options.showLength) {
            return null;
        }

        if (this.options.showLength) {
            measurementString = L.Draw.Polyline.prototype._getMeasurementString.call(this);
        }

        if (area) {
            measurementString += '<br>' + L.GeometryUtil.readableArea(area, this.options.metric, this.options.precision);
        }

        return measurementString;
    },

    _shapeIsValid: function () {
        return this._markers.length >= 3;
    },

    _vertexChanged: function (latlng, added) {
        var latLngs;

        // Check to see if we should show the area
        if (!this.options.allowIntersection && this.options.showArea) {
            latLngs = this._poly.getLatLngs();

            this._area = L.GeometryUtil.geodesicArea(latLngs);
        }

        L.Draw.Polyline.prototype._vertexChanged.call(this, latlng, added);
    },

    _cleanUpShape: function () {
        var markerCount = this._markers.length;

        if (markerCount > 0) {
            this._markers[0].off('click', this._finishShape, this);

            if (markerCount > 2) {
                this._markers[markerCount - 1].off('dblclick', this._finishShape, this);
            }
        }
    }
});
L.Draw.Polygon = L.Draw.Polyline.extend({
    statics: {
        TYPE: 'polygon'
    },

    Poly: L.Polygon,

    options: {
        showArea: false,
        showLength: false,
        shapeOptions: {
            stroke: true,
            color: '#3388ff',
            weight: 4,
            opacity: 0.5,
            fill: true,
            fillColor: null, //same as color by default
            fillOpacity: 0.2,
            clickable: true
        },
        // Whether to use the metric measurement system (truthy) or not (falsy).
        // Also defines the units to use for the metric system as an array of
        // strings (e.g. `['ha', 'm']`).
        metric: true,
        feet: true, // When not metric, to use feet instead of yards for display.
        nautic: false, // When not metric, not feet use nautic mile for display
        // Defines the precision for each type of unit (e.g. {km: 2, ft: 0}
        precision: {}
    },

    // @method initialize(): void
    initialize: function (map, options, type) {
        L.Draw.Polyline.prototype.initialize.call(this, map, options);

        // Save the type so super can fire, need to do this as cannot do this.TYPE :(
        this.type = type || L.Draw.Polygon.TYPE;
    },

    _updateFinishHandler: function () {
        var markerCount = this._markers.length;

        // The first marker should have a click handler to close the polygon
        if (markerCount === 1) {
            this._markers[0].on('click', this._finishShape, this);
        }

        // Add and update the double click handler
        if (markerCount > 2) {
            this._markers[markerCount - 1].on('dblclick', this._finishShape, this);
            // Only need to remove handler if has been added before
            if (markerCount > 3) {
                this._markers[markerCount - 2].off('dblclick', this._finishShape, this);
            }
        }
    },

    _getTooltipText: function () {
        var text, subtext;

        if (this._markers.length === 0) {
            text = L.drawLocal.draw.handlers.polygon.tooltip.start;
        } else if (this._markers.length < 3) {
            text = L.drawLocal.draw.handlers.polygon.tooltip.cont;
            subtext = this._getMeasurementString();
        } else {
            text = L.drawLocal.draw.handlers.polygon.tooltip.end;
            subtext = this._getMeasurementString();
        }

        return {
            text: text,
            subtext: subtext
        };
    },

    _getMeasurementString: function () {
        var area = this._area,
            measurementString = '';


        if (!area && !this.options.showLength) {
            return null;
        }

        if (this.options.showLength) {
            measurementString = L.Draw.Polyline.prototype._getMeasurementString.call(this);
        }

        if (area) {
            measurementString += '<br>' + L.GeometryUtil.readableArea(area, this.options.metric, this.options.precision);
        }

        return measurementString;
    },

    _shapeIsValid: function () {
        return this._markers.length >= 3;
    },

    _vertexChanged: function (latlng, added) {
        var latLngs;

        // Check to see if we should show the area
        if (!this.options.allowIntersection && this.options.showArea) {
            latLngs = this._poly.getLatLngs();

            this._area = L.GeometryUtil.geodesicArea(latLngs);
        }

        L.Draw.Polyline.prototype._vertexChanged.call(this, latlng, added);
    },

    _cleanUpShape: function () {
        var markerCount = this._markers.length;

        if (markerCount > 0) {
            this._markers[0].off('click', this._finishShape, this);

            if (markerCount > 2) {
                this._markers[markerCount - 1].off('dblclick', this._finishShape, this);
            }
        }
    }
});


/**
 * @class L.Draw.Marker
 * @aka Draw.Marker
 * @inherits L.Draw.Feature
 */
L.Draw.HeatMarker = L.Draw.Feature.extend({
    statics: {
        TYPE: 'heatmarker'
    },

    options: {
        icon: new L.Icon.Default(),
        repeatMode: false,
        zIndexOffset: 2000 // This should be > than the highest z-index any markers
    },

    // @method initialize(): void
    initialize: function (map, options) {
        // Save the type so super can fire, need to do this as cannot do this.TYPE :(
        this.type = L.Draw.HeatMarker.TYPE;

        this._initialLabelText = L.drawLocal.draw.handlers.marker.tooltip.start;

        L.Draw.Feature.prototype.initialize.call(this, map, options);
    },

    // @method addHooks(): void
    // Add listener hooks to this handler.
    addHooks: function () {
        L.Draw.Feature.prototype.addHooks.call(this);

        if (this._map) {
            this._tooltip.updateContent({text: this._initialLabelText});

            // Same mouseMarker as in Draw.Polyline
            if (!this._mouseMarker) {
                this._mouseMarker = L.marker(this._map.getCenter(), {
                    icon: L.divIcon({
                        className: 'leaflet-mouse-marker',
                        iconAnchor: [20, 20],
                        iconSize: [40, 40]
                    }),
                    opacity: 0,
                    zIndexOffset: this.options.zIndexOffset
                });
            }

            this._mouseMarker
                .on('click', this._onClick, this)
                .addTo(this._map);

            this._map.on('mousemove', this._onMouseMove, this);
            this._map.on('click', this._onTouch, this);
        }
    },

    // @method removeHooks(): void
    // Remove listener hooks from this handler.
    removeHooks: function () {
        L.Draw.Feature.prototype.removeHooks.call(this);

        if (this._map) {
            this._map
                .off('click', this._onClick, this)
                .off('click', this._onTouch, this);
            if (this._marker) {
                this._marker.off('click', this._onClick, this);
                this._map
                    .removeLayer(this._marker);
                delete this._marker;
            }

            this._mouseMarker.off('click', this._onClick, this);
            this._map.removeLayer(this._mouseMarker);
            delete this._mouseMarker;

            this._map.off('mousemove', this._onMouseMove, this);
        }
    },

    _onMouseMove: function (e) {
        var latlng = e.latlng;

        this._tooltip.updatePosition(latlng);
        this._mouseMarker.setLatLng(latlng);

        if (!this._marker) {
            this._marker = this._createMarker(latlng);
            // Bind to both marker and map to make sure we get the click event.
            this._marker.on('click', this._onClick, this);
            this._map
                .on('click', this._onClick, this)
                .addLayer(this._marker);
        }
        else {
            latlng = this._mouseMarker.getLatLng();
            this._marker.setLatLng(latlng);
        }
    },

    _createMarker: function (latlng) {
        return new L.Marker(latlng, {
            icon: this.options.icon,
            zIndexOffset: this.options.zIndexOffset
        });
    },

    _onClick: function () {
        this._fireCreatedEvent();

        this.disable();
        if (this.options.repeatMode) {
            this.enable();
        }
    },

    _onTouch: function (e) {
        // called on click & tap, only really does any thing on tap
        this._onMouseMove(e); // creates & places marker
        this._onClick(); // permanently places marker & ends interaction
    },

    _fireCreatedEvent: function () {
        var marker = new L.Marker.Touch(this._marker.getLatLng(), {icon: this.options.icon});
        L.Draw.Feature.prototype._fireCreatedEvent.call(this, marker);
    }
});
// fullscreen map
L.Control.Location = L.Control.extend({
    options: {
        // topright, topleft, bottomleft, bottomright
        position: 'topleft'
    },
    initialize: function (options) {
        // constructor
    },
    onAdd: function (map) {
        var container = L.DomUtil.create('div');
        var zoomContainer = L.DomUtil.create('div','custom-control-container',container);
        this.link = L.DomUtil.create('a', 'location-icon', zoomContainer);
        L.DomEvent.addListener(this.link, 'click', this.click , this);
        L.DomEvent.disableClickPropagation(container);
        return container;
    },
    onRemove: function (map) {
        L.DomEvent.removeListener(this._link, 'click', this.click, map);
    },
    click: function(e) {
        this._map.setView(this._map.options.center,this._map.options.zoom);
        console.log(this._map);
        L.DomEvent.preventDefault(e);
    }
});
L.Control.Perspective = L.Control.extend({
    options: {
        position: 'topright',
        title: {
            'false': 'View 3D',
            'true': 'View Flat'
        }
    },

    onAdd: function (map) {
        var container = L.DomUtil.create('div', 'leaflet-control-3d leaflet-bar leaflet-control');
        this.link = L.DomUtil.create('a', 'leaflet-control-3d-button leaflet-bar-part', container);
        this.link.href = '#';
        L.DomUtil.create('i', 'fa fa-cube', this.link);
        this._map = map;
        this._map.on('PerspectiveChange', this._toggleTitle, this);
        this._toggleTitle();

        L.DomEvent.on(this.link, 'click', this._click, this);

        return container;
    },

    _click: function (e) {
        L.DomEvent.stopPropagation(e);
        L.DomEvent.preventDefault(e);
        if(this._map.floorBounds){
            this._map.fitBounds(this._map.floorBounds);
            this._map.invalidateSize();
        }
        this._map.togglePerspective3D(this.options);
    },

    _toggleTitle: function() {
        this.link.title = this.options.title[this._map.isPerspective3D()];
    }
});
L.Control.Fullscreen = L.Control.extend({
    options: {
        position: 'topright',
        title: {
            'false': 'View Fullscreen',
            'true': 'Exit Fullscreen'
        }
    },

    onAdd: function (map) {
        var container = L.DomUtil.create('div', 'leaflet-control-fullscreen leaflet-bar leaflet-control');

        this.link = L.DomUtil.create('a', 'leaflet-control-fullscreen-button leaflet-bar-part', container);
        this.link.href = '#';

        this._map = map;
        this._map.on('fullscreenchange', this._toggleTitle, this);
        this._toggleTitle();

        L.DomEvent.on(this.link, 'click', this._click, this);

        return container;
    },

    _click: function (e) {
        L.DomEvent.stopPropagation(e);
        L.DomEvent.preventDefault(e);
        this._map.toggleFullscreen(this.options);
    },

    _toggleTitle: function() {
        this.link.title = this.options.title[this._map.isFullscreen()];
    }
});
L.Map.include({
    isFullscreen: function () {
        return this._isFullscreen || false;
    },
    toggleFullscreen: function (options) {
        var container = document.getElementById("fullscreen-wrapper");
        if (this.isFullscreen()) {
            if (options && options.pseudoFullscreen) {
                this._disablePseudoFullscreen(container);
            } else if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else {
                this._disablePseudoFullscreen(container);
            }
        } else {
            if (options && options.pseudoFullscreen) {
                this._enablePseudoFullscreen(container);
            } else if (container.requestFullscreen) {
                container.requestFullscreen();
            } else if (container.mozRequestFullScreen) {
                container.mozRequestFullScreen();
            } else if (container.webkitRequestFullscreen) {
                container.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            } else if (container.msRequestFullscreen) {
                container.msRequestFullscreen();
            } else {
                this._enablePseudoFullscreen(container);
            }
        }

    },

    _enablePseudoFullscreen: function (container) {
        L.DomUtil.addClass(container, 'leaflet-pseudo-fullscreen');
        this._setFullscreen(true);
        this.fire('fullscreenchange');
    },

    _disablePseudoFullscreen: function (container) {
        L.DomUtil.removeClass(container, 'leaflet-pseudo-fullscreen');
        this._setFullscreen(false);
        this.fire('fullscreenchange');
    },
    _setFullscreen: function(fullscreen) {
        this._isFullscreen = fullscreen;
        var container = document.getElementById("fullscreen-wrapper");
        if (fullscreen) {
            L.DomUtil.addClass(container, 'leaflet-fullscreen-on');
        } else {
            L.DomUtil.removeClass(container, 'leaflet-fullscreen-on');
        }
        this.invalidateSize();
    },

    _onFullscreenChange: function (e) {
        var fullscreenElement =
            document.fullscreenElement ||
            document.mozFullScreenElement ||
            document.webkitFullscreenElement ||
            document.msFullscreenElement;
        var container = document.getElementById("fullscreen-wrapper");
        if (fullscreenElement === container && !this._isFullscreen) {
            this._setFullscreen(true);
            this.fire('fullscreenchange');
        } else if (fullscreenElement !== container && this._isFullscreen) {
            this._setFullscreen(false);
            this.fire('fullscreenchange');
        }
    },
    isPerspective3D: function () {
        return this._isPerspective3D || false;
    },
    togglePerspective3D: function (options) {
        var container = document.getElementById("floor-map");

        if (this.isPerspective3D()) {
            this._isPerspective3D = false;
            L.DomUtil.removeClass(container, 'perspective');
            this.fire('PerspectiveChange');
        } else {
            this._isPerspective3D = true;
            L.DomUtil.addClass(container, 'perspective');
            this.fire('PerspectiveChange');
        }

    }
});
L.Map.mergeOptions({
});
L.Map.addInitHook(function () {
    if (this.options.fullscreenControl) {
        this.fullscreenControl = new L.Control.Fullscreen(this.options.fullscreenControl);
        this.addControl(this.fullscreenControl);
    }

    var fullscreenchange;

    if ('onfullscreenchange' in document) {
        fullscreenchange = 'fullscreenchange';
    } else if ('onmozfullscreenchange' in document) {
        fullscreenchange = 'mozfullscreenchange';
    } else if ('onwebkitfullscreenchange' in document) {
        fullscreenchange = 'webkitfullscreenchange';
    } else if ('onmsfullscreenchange' in document) {
        fullscreenchange = 'MSFullscreenChange';
    }

    if (fullscreenchange) {
        var onFullscreenChange = L.bind(this._onFullscreenChange, this);

        this.whenReady(function () {
            L.DomEvent.on(document, fullscreenchange, onFullscreenChange);
        });

        this.on('unload', function () {
            L.DomEvent.off(document, fullscreenchange, onFullscreenChange);
        });
    }
});

// set marker direction
(function (window, document, undefined) {

    L.OrientedMarker = L.Marker.extend({
        options: {
            angle: 0,
            orientationLineLength:100,
            orientationLineColor: '#196b93',
            orientationLineWeight: 2,
            orientationLineOpacity: 0.5
        },

        /**
         * Set the angle.
         * @param {number} angle - some degree to set the angle
         * @returns {void}
         */
        setAngle: function( angle ) {
            this.options.angle = angle ;
            this._updateImg();
        },

        /**
         * Add degree to the angle.
         * @param {number} angle - some degree to add to the angle
         * @returns {number} The new angle
         */
        rotate: function( angle ) {
            this.options.angle += angle ;
            this._updateImg();
            return this.options.angle ;
        },

        _setPos: function (pos) {
            L.Marker.prototype._setPos.call(this, pos);
            this._initIconStyle = this._icon.style[L.DomUtil.TRANSFORM] + '';
            this._updateImg();
        },
        _updateImg: function() {
            var a = this.options.icon.options.iconAnchor,
                i, s;
            if (this._icon) {
                i = this._icon;
                s = this.options.icon.options.iconSize;
                this._orienteIcon(i, a, s)
            }
            if (this._shadow) {
                s = this.options.icon.options.shadowSize;
                i = this._shadow;
                this._orienteIcon(i, a, s)
            }
        },
        _orienteIcon: function (i, a, s) {
            $(i).removeClass (function (index, className) {
                return (className.match (/(^|\s)direction-angle-\S+/g) || []).join(' ');
            });
            $(i).addClass('direction-angle-'+ this.options.angle);
        },
        onRemove: function (map) {
            this._orientationLine.onRemove(this._map);
            this._orientationCircle.onRemove(this._map);
            L.Marker.prototype.onRemove.call(this, map);
            return this;
        },
        update: function () {
            L.Marker.prototype.update.call(this);
            if (this._orientationLine) {
                this.activateOrientation();
            }
            return this;
        },
        deactiveOrientation:function(){
            if (this._orientationLine) {
                this._map.removeLayer(this._orientationLine);
                this._map.removeLayer(this._orientationCircle);
            }
        },
        activateOrientation: function() {
            var that = this;
            that.on('revert-edited',function(){
                that.setAngle(that.options.data.angle);
                that._setOrientationDirectionLine();
            });
            that._setOrientationDirectionLine();
            that._orientationMouseDown = false;
            that._orientationGroup = new L.layerGroup(this);
            that._orientationGroup.addLayer(that._orientationLine);
            that._orientationGroup.addLayer(that._orientationCircle);
            that._orientationGroup.addTo(this._map);
            that._orientationLine.on('mousedown', beginOrientation);
            that._orientationCircle.on('mousedown', beginOrientation);
            that._map.on('mousemove', moveOrientation);
            that._map.on('mouseup', stopOrientation);
            // Mobile controls
            that._orientationLine._map._container.ontouchstart = beginOrientation;
            that._orientationCircle._map._container.ontouchstart = beginOrientation;
            that._orientationLine._map._container.ontouchmove = mobileMoveOrientation;
            that._orientationCircle._map._container.ontouchmove = mobileMoveOrientation;
            that._orientationLine._map._container.ontouchend = stopOrientation;
            that._orientationCircle._map._container.ontouchend = stopOrientation;
            function beginOrientation() {
                if(!that.editing._enabled) return; // only allow rotate direction when editing mode is enabled
                that._savedDragging = that._map.dragging;
                that._savedMouseUp = that._map.onmouseup;
                that._map.dragging.disable();
                that._orientationMouseDown = true;
            }
            function mobileMoveOrientation(e) {
                if (that._orientationMouseDown) {
                    var touches = e.changedTouches,
                        lastTouch = touches[touches.length - 1];
                    newLatLng = that._map.layerPointToLatLng(
                        that._map.mouseEventToLayerPoint({clientX: lastTouch.pageX, clientY: lastTouch.pageY})
                    );
                    moveOrientation({latlng: newLatLng});
                }
            }
            function moveOrientation(e) {
                if (that._orientationMouseDown) {
                    var A = that._orientationLine._parts[0][0],
                        B = e.layerPoint;
                    var _angle = Math.round((Math.atan2(0,1) - Math.atan2((B.x - A.x),(B.y - A.y)))*180/Math.PI+180);
                    var transformation = new L.Transformation(
                        1, Math.sin(_angle*Math.PI / 180)*that.options.orientationLineLength,
                        1, Math.cos(_angle*Math.PI / 180)*-(that.options.orientationLineLength)
                        ),
                        pointB = that._map.layerPointToLatLng(
                            transformation.transform(that._map.latLngToLayerPoint(that._latlng))
                        );
                    that._orientationLine.setLatLngs([that._latlng, pointB]);
                    that._orientationCircle.setLatLng(pointB);
                    that._setAngle();
                }
            }
            function stopOrientation() {
                if (that._orientationMouseDown) {
                    that._orientationMouseDown = false;
                    that._map.dragging.enable();
                    that._setAngle();
                    that.edited = true;
                }
            }
            return that;
        },
        _setOrientationDirectionLine: function() {
            if (this._orientationLine) {
                this._map.removeLayer(this._orientationLine);
                this._map.removeLayer(this._orientationCircle);
            }
            var transformation = new L.Transformation(
                1, Math.sin(this.options.angle*Math.PI / 180)*this.options.orientationLineLength,
                1, Math.cos(this.options.angle*Math.PI / 180)*-(this.options.orientationLineLength)
                ),
                pointB = this._map.layerPointToLatLng(
                    transformation.transform(this._map.latLngToLayerPoint(this._latlng))
                );
            var pointList = [this._latlng, pointB];
            this._orientationCircle = L.marker(pointB,{
                icon: L.divIcon({className: 'direction-circle marker-icon'})
            });
            this._orientationLine = new L.Polyline(pointList, {
                color: this.options.orientationLineColor,
                weight: this.options.orientationLineWeight,
                opacity: this.options.orientationLineOpacity,
                smoothFactor: 1
            });
        },
        _orientationMouseDown: false,
        _savedDragging: false,
        _savedMouseUp: false,
        validateOrientation: function(callback) {
            if (!this._orientationLine) {
                return this;
            }
            this._map.dragging = this._savedDragging;
            this._map.mouseup = this._savedMouseUp;
            this._orientationLine.onRemove(this._map);
            this._orientationCircle.onRemove(this._map);
            this._orientationLine = false;
            this._orientationCircle = false;
            return this;
        },
        _setAngle: function() {
            var A = this._orientationLine._parts[0][0],
                B = this._orientationLine._parts[0][1];
            this.options.angle = Math.round((Math.atan2(0,1) - Math.atan2((B.x - A.x),(B.y - A.y)))*180/Math.PI+180);
            this._updateImg();
        },
        _initIconStyle: false,
        _orientationLine: false,
        _orientationCircle: false
    });
    L.orientedMarker = function (pos, options) {
        return new L.OrientedMarker(pos, options);
    };
}(window, document));
