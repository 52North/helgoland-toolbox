'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">helgoland-toolbox documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="license.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>LICENSE
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter additional">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#additional-pages"'
                            : 'data-target="#xs-additional-pages"' }>
                            <span class="icon ion-ios-book"></span>
                            <span>Additional documentation</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="additional-pages"' : 'id="xs-additional-pages"' }>
                                    <li class="link ">
                                        <a href="additional-documentation/introduction.html" data-type="entity-link" data-context-id="additional">Introduction</a>
                                    </li>
                                    <li class="chapter inner">
                                        <a data-type="chapter-link" href="additional-documentation/how-tos.html" data-context-id="additional">
                                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#additional-page-c5390614280696bcef14465a59adea09"' : 'data-target="#xs-additional-page-c5390614280696bcef14465a59adea09"' }>
                                                <span class="link-name">How Tos</span>
                                                <span class="icon ion-ios-arrow-down"></span>
                                            </div>
                                        </a>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="additional-page-c5390614280696bcef14465a59adea09"' : 'id="xs-additional-page-c5390614280696bcef14465a59adea09"' }>
                                            <li class="link for-chapter2">
                                                <a href="additional-documentation/how-tos/integrate-a-d3-timeseries-component.html" data-type="entity-link" data-context="sub-entity" data-context-id="additional">Integrate a D3 timeseries component</a>
                                            </li>
                                            <li class="link for-chapter2">
                                                <a href="additional-documentation/how-tos/integrate-a-table-component.html" data-type="entity-link" data-context="sub-entity" data-context-id="additional">Integrate a table component</a>
                                            </li>
                                            <li class="link for-chapter2">
                                                <a href="additional-documentation/how-tos/integrate-a-map-component.html" data-type="entity-link" data-context="sub-entity" data-context-id="additional">Integrate a map component</a>
                                            </li>
                                            <li class="link for-chapter2">
                                                <a href="additional-documentation/how-tos/extend-a-timeseries-entry-component.html" data-type="entity-link" data-context="sub-entity" data-context-id="additional">Extend a timeseries entry component</a>
                                            </li>
                                            <li class="link for-chapter2">
                                                <a href="additional-documentation/how-tos/configure-a-map-component.html" data-type="entity-link" data-context="sub-entity" data-context-id="additional">Configure a map component</a>
                                            </li>
                                            <li class="link for-chapter2">
                                                <a href="additional-documentation/how-tos/using-basic-auth-services.html" data-type="entity-link" data-context="sub-entity" data-context-id="additional">Using basic auth services</a>
                                            </li>
                                            <li class="link for-chapter2">
                                                <a href="additional-documentation/how-tos/handle-dataset-options-to-style-the-timeseries.html" data-type="entity-link" data-context="sub-entity" data-context-id="additional">Handle dataset options to style the timeseries</a>
                                            </li>
                                            <li class="link for-chapter2">
                                                <a href="additional-documentation/how-tos/add-last-value-map-selector.html" data-type="entity-link" data-context="sub-entity" data-context-id="additional">Add last value map selector</a>
                                            </li>
                                            <li class="link for-chapter2">
                                                <a href="additional-documentation/how-tos/using-new-communication-interface.html" data-type="entity-link" data-context="sub-entity" data-context-id="additional">Using new communication interface</a>
                                            </li>
                                        </ul>
                                    </li>
                        </ul>
                    </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/HelgolandBasicAuthModule.html" data-type="entity-link">HelgolandBasicAuthModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-HelgolandBasicAuthModule-16eae199c9d64b1fa0baf523a32e35f7"' : 'data-target="#xs-injectables-links-module-HelgolandBasicAuthModule-16eae199c9d64b1fa0baf523a32e35f7"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-HelgolandBasicAuthModule-16eae199c9d64b1fa0baf523a32e35f7"' :
                                        'id="xs-injectables-links-module-HelgolandBasicAuthModule-16eae199c9d64b1fa0baf523a32e35f7"' }>
                                        <li class="link">
                                            <a href="injectables/BasicAuthService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>BasicAuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/BasicAuthServiceMaintainer.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>BasicAuthServiceMaintainer</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/HelgolandCachingModule.html" data-type="entity-link">HelgolandCachingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/HelgolandControlModule.html" data-type="entity-link">HelgolandControlModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-HelgolandControlModule-992e5735e93b90e992dc43faaea9a5b3"' : 'data-target="#xs-components-links-module-HelgolandControlModule-992e5735e93b90e992dc43faaea9a5b3"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-HelgolandControlModule-992e5735e93b90e992dc43faaea9a5b3"' :
                                            'id="xs-components-links-module-HelgolandControlModule-992e5735e93b90e992dc43faaea9a5b3"' }>
                                            <li class="link">
                                                <a href="components/D3GeneralGraphComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3GeneralGraphComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3GraphCopyrightComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3GraphCopyrightComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3GraphHoverLineComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3GraphHoverLineComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3GraphPanZoomInteractionComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3GraphPanZoomInteractionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3OverviewTimeseriesGraphComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3OverviewTimeseriesGraphComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3TimeseriesGraphComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3TimeseriesGraphComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3TrajectoryGraphComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3TrajectoryGraphComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3YAxisModifierComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3YAxisModifierComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ExportImageButtonComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ExportImageButtonComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ExtendedDataD3TimeseriesGraphComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ExtendedDataD3TimeseriesGraphComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/HelgolandCoreModule.html" data-type="entity-link">HelgolandCoreModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-HelgolandCoreModule-8d1c63d820f931a7e98ed9bf783a8404"' : 'data-target="#xs-injectables-links-module-HelgolandCoreModule-8d1c63d820f931a7e98ed9bf783a8404"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-HelgolandCoreModule-8d1c63d820f931a7e98ed9bf783a8404"' :
                                        'id="xs-injectables-links-module-HelgolandCoreModule-8d1c63d820f931a7e98ed9bf783a8404"' }>
                                        <li class="link">
                                            <a href="injectables/ColorService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ColorService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/DatasetApiMapping.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>DatasetApiMapping</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/DefinedTimespanService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>DefinedTimespanService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/HttpService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>HttpService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/InternalIdHandler.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>InternalIdHandler</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/LocalStorage.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>LocalStorage</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/NotifierService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>NotifierService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/StatusIntervalResolverService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>StatusIntervalResolverService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/SumValuesService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>SumValuesService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/Time.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>Time</a>
                                        </li>
                                    </ul>
                                </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#pipes-links-module-HelgolandCoreModule-8d1c63d820f931a7e98ed9bf783a8404"' : 'data-target="#xs-pipes-links-module-HelgolandCoreModule-8d1c63d820f931a7e98ed9bf783a8404"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-HelgolandCoreModule-8d1c63d820f931a7e98ed9bf783a8404"' :
                                            'id="xs-pipes-links-module-HelgolandCoreModule-8d1c63d820f931a7e98ed9bf783a8404"' }>
                                            <li class="link">
                                                <a href="pipes/DateProxyPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DateProxyPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/MatchLabelPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MatchLabelPipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/HelgolandD3Module.html" data-type="entity-link">HelgolandD3Module</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-HelgolandD3Module-263b7156e577ff34e74fdc8a43712287"' : 'data-target="#xs-components-links-module-HelgolandD3Module-263b7156e577ff34e74fdc8a43712287"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-HelgolandD3Module-263b7156e577ff34e74fdc8a43712287"' :
                                            'id="xs-components-links-module-HelgolandD3Module-263b7156e577ff34e74fdc8a43712287"' }>
                                            <li class="link">
                                                <a href="components/D3GeneralGraphComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3GeneralGraphComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3GraphCopyrightComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3GraphCopyrightComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3GraphHoverLineComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3GraphHoverLineComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3GraphPanZoomInteractionComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3GraphPanZoomInteractionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3OverviewTimeseriesGraphComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3OverviewTimeseriesGraphComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3TimeseriesGraphComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3TimeseriesGraphComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3TrajectoryGraphComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3TrajectoryGraphComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3YAxisModifierComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3YAxisModifierComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ExportImageButtonComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ExportImageButtonComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ExtendedDataD3TimeseriesGraphComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ExtendedDataD3TimeseriesGraphComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-HelgolandD3Module-263b7156e577ff34e74fdc8a43712287"' : 'data-target="#xs-injectables-links-module-HelgolandD3Module-263b7156e577ff34e74fdc8a43712287"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-HelgolandD3Module-263b7156e577ff34e74fdc8a43712287"' :
                                        'id="xs-injectables-links-module-HelgolandD3Module-263b7156e577ff34e74fdc8a43712287"' }>
                                        <li class="link">
                                            <a href="injectables/D3TimeFormatLocaleService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>D3TimeFormatLocaleService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/HelgolandDatasetDownloadModule.html" data-type="entity-link">HelgolandDatasetDownloadModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-HelgolandDatasetDownloadModule-a0460b2b0543ee77cb9c5ca463dd5c2b"' : 'data-target="#xs-components-links-module-HelgolandDatasetDownloadModule-a0460b2b0543ee77cb9c5ca463dd5c2b"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-HelgolandDatasetDownloadModule-a0460b2b0543ee77cb9c5ca463dd5c2b"' :
                                            'id="xs-components-links-module-HelgolandDatasetDownloadModule-a0460b2b0543ee77cb9c5ca463dd5c2b"' }>
                                            <li class="link">
                                                <a href="components/DatasetExportComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DatasetExportComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DatasetPermalinkDownloadComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DatasetPermalinkDownloadComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/HelgolandDatasetlistModule.html" data-type="entity-link">HelgolandDatasetlistModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-HelgolandDatasetlistModule-5789f64f2fb4ca0b17023fa196789b88"' : 'data-target="#xs-components-links-module-HelgolandDatasetlistModule-5789f64f2fb4ca0b17023fa196789b88"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-HelgolandDatasetlistModule-5789f64f2fb4ca0b17023fa196789b88"' :
                                            'id="xs-components-links-module-HelgolandDatasetlistModule-5789f64f2fb4ca0b17023fa196789b88"' }>
                                            <li class="link">
                                                <a href="components/D3GeneralGraphComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3GeneralGraphComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3GraphCopyrightComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3GraphCopyrightComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3GraphHoverLineComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3GraphHoverLineComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3GraphPanZoomInteractionComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3GraphPanZoomInteractionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3OverviewTimeseriesGraphComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3OverviewTimeseriesGraphComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3TimeseriesGraphComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3TimeseriesGraphComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3TrajectoryGraphComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3TrajectoryGraphComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3YAxisModifierComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3YAxisModifierComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ExportImageButtonComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ExportImageButtonComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ExtendedDataD3TimeseriesGraphComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ExtendedDataD3TimeseriesGraphComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-HelgolandDatasetlistModule-5789f64f2fb4ca0b17023fa196789b88"' : 'data-target="#xs-injectables-links-module-HelgolandDatasetlistModule-5789f64f2fb4ca0b17023fa196789b88"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-HelgolandDatasetlistModule-5789f64f2fb4ca0b17023fa196789b88"' :
                                        'id="xs-injectables-links-module-HelgolandDatasetlistModule-5789f64f2fb4ca0b17023fa196789b88"' }>
                                        <li class="link">
                                            <a href="injectables/ReferenceValueColorCache.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ReferenceValueColorCache</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/HelgolandDatasetTableModule.html" data-type="entity-link">HelgolandDatasetTableModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-HelgolandDatasetTableModule-6ab883d25365256da3334ed99c69e36f"' : 'data-target="#xs-components-links-module-HelgolandDatasetTableModule-6ab883d25365256da3334ed99c69e36f"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-HelgolandDatasetTableModule-6ab883d25365256da3334ed99c69e36f"' :
                                            'id="xs-components-links-module-HelgolandDatasetTableModule-6ab883d25365256da3334ed99c69e36f"' }>
                                            <li class="link">
                                                <a href="components/DatasetTableComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DatasetTableComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/HelgolandEventingModule.html" data-type="entity-link">HelgolandEventingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/HelgolandFacetSearchModule.html" data-type="entity-link">HelgolandFacetSearchModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-HelgolandFacetSearchModule-87b0836aeba184525d5f3f794613d979"' : 'data-target="#xs-components-links-module-HelgolandFacetSearchModule-87b0836aeba184525d5f3f794613d979"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-HelgolandFacetSearchModule-87b0836aeba184525d5f3f794613d979"' :
                                            'id="xs-components-links-module-HelgolandFacetSearchModule-87b0836aeba184525d5f3f794613d979"' }>
                                            <li class="link">
                                                <a href="components/D3GeneralGraphComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3GeneralGraphComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3GraphCopyrightComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3GraphCopyrightComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3GraphHoverLineComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3GraphHoverLineComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3GraphPanZoomInteractionComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3GraphPanZoomInteractionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3OverviewTimeseriesGraphComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3OverviewTimeseriesGraphComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3TimeseriesGraphComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3TimeseriesGraphComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3TrajectoryGraphComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3TrajectoryGraphComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3YAxisModifierComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3YAxisModifierComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ExportImageButtonComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ExportImageButtonComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ExtendedDataD3TimeseriesGraphComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ExtendedDataD3TimeseriesGraphComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/HelgolandFavoriteModule.html" data-type="entity-link">HelgolandFavoriteModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-HelgolandFavoriteModule-c302589b85f4afd78fe1c862f17de4bd"' : 'data-target="#xs-components-links-module-HelgolandFavoriteModule-c302589b85f4afd78fe1c862f17de4bd"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-HelgolandFavoriteModule-c302589b85f4afd78fe1c862f17de4bd"' :
                                            'id="xs-components-links-module-HelgolandFavoriteModule-c302589b85f4afd78fe1c862f17de4bd"' }>
                                            <li class="link">
                                                <a href="components/D3GeneralGraphComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3GeneralGraphComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3GraphCopyrightComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3GraphCopyrightComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3GraphHoverLineComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3GraphHoverLineComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3GraphPanZoomInteractionComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3GraphPanZoomInteractionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3OverviewTimeseriesGraphComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3OverviewTimeseriesGraphComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3TimeseriesGraphComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3TimeseriesGraphComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3TrajectoryGraphComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3TrajectoryGraphComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3YAxisModifierComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3YAxisModifierComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ExportImageButtonComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ExportImageButtonComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ExtendedDataD3TimeseriesGraphComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ExtendedDataD3TimeseriesGraphComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-HelgolandFavoriteModule-c302589b85f4afd78fe1c862f17de4bd"' : 'data-target="#xs-injectables-links-module-HelgolandFavoriteModule-c302589b85f4afd78fe1c862f17de4bd"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-HelgolandFavoriteModule-c302589b85f4afd78fe1c862f17de4bd"' :
                                        'id="xs-injectables-links-module-HelgolandFavoriteModule-c302589b85f4afd78fe1c862f17de4bd"' }>
                                        <li class="link">
                                            <a href="injectables/FavoriteService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>FavoriteService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JsonFavoriteExporterService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>JsonFavoriteExporterService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/HelgolandLabelMapperModule.html" data-type="entity-link">HelgolandLabelMapperModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-HelgolandLabelMapperModule-4490689986ba7fb05559745b1e95861c"' : 'data-target="#xs-components-links-module-HelgolandLabelMapperModule-4490689986ba7fb05559745b1e95861c"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-HelgolandLabelMapperModule-4490689986ba7fb05559745b1e95861c"' :
                                            'id="xs-components-links-module-HelgolandLabelMapperModule-4490689986ba7fb05559745b1e95861c"' }>
                                            <li class="link">
                                                <a href="components/LabelMapperComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LabelMapperComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-HelgolandLabelMapperModule-4490689986ba7fb05559745b1e95861c"' : 'data-target="#xs-injectables-links-module-HelgolandLabelMapperModule-4490689986ba7fb05559745b1e95861c"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-HelgolandLabelMapperModule-4490689986ba7fb05559745b1e95861c"' :
                                        'id="xs-injectables-links-module-HelgolandLabelMapperModule-4490689986ba7fb05559745b1e95861c"' }>
                                        <li class="link">
                                            <a href="injectables/LabelMapperService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>LabelMapperService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/HelgolandLayerControlModule.html" data-type="entity-link">HelgolandLayerControlModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-HelgolandLayerControlModule-3c5884d341884bcb88b1ebcc22ff94c8"' : 'data-target="#xs-components-links-module-HelgolandLayerControlModule-3c5884d341884bcb88b1ebcc22ff94c8"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-HelgolandLayerControlModule-3c5884d341884bcb88b1ebcc22ff94c8"' :
                                            'id="xs-components-links-module-HelgolandLayerControlModule-3c5884d341884bcb88b1ebcc22ff94c8"' }>
                                            <li class="link">
                                                <a href="components/D3GeneralGraphComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3GeneralGraphComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3GraphCopyrightComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3GraphCopyrightComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3GraphHoverLineComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3GraphHoverLineComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3GraphPanZoomInteractionComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3GraphPanZoomInteractionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3OverviewTimeseriesGraphComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3OverviewTimeseriesGraphComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3TimeseriesGraphComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3TimeseriesGraphComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3TrajectoryGraphComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3TrajectoryGraphComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3YAxisModifierComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3YAxisModifierComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ExportImageButtonComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ExportImageButtonComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ExtendedDataD3TimeseriesGraphComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ExtendedDataD3TimeseriesGraphComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/HelgolandMapControlModule.html" data-type="entity-link">HelgolandMapControlModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-HelgolandMapControlModule-873b357c4f0f8df64179e2b313ddb439"' : 'data-target="#xs-components-links-module-HelgolandMapControlModule-873b357c4f0f8df64179e2b313ddb439"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-HelgolandMapControlModule-873b357c4f0f8df64179e2b313ddb439"' :
                                            'id="xs-components-links-module-HelgolandMapControlModule-873b357c4f0f8df64179e2b313ddb439"' }>
                                            <li class="link">
                                                <a href="components/D3GeneralGraphComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3GeneralGraphComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3GraphCopyrightComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3GraphCopyrightComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3GraphHoverLineComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3GraphHoverLineComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3GraphPanZoomInteractionComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3GraphPanZoomInteractionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3OverviewTimeseriesGraphComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3OverviewTimeseriesGraphComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3TimeseriesGraphComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3TimeseriesGraphComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3TrajectoryGraphComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3TrajectoryGraphComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3YAxisModifierComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3YAxisModifierComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ExportImageButtonComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ExportImageButtonComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ExtendedDataD3TimeseriesGraphComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ExtendedDataD3TimeseriesGraphComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-HelgolandMapControlModule-873b357c4f0f8df64179e2b313ddb439"' : 'data-target="#xs-injectables-links-module-HelgolandMapControlModule-873b357c4f0f8df64179e2b313ddb439"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-HelgolandMapControlModule-873b357c4f0f8df64179e2b313ddb439"' :
                                        'id="xs-injectables-links-module-HelgolandMapControlModule-873b357c4f0f8df64179e2b313ddb439"' }>
                                        <li class="link">
                                            <a href="injectables/LocateService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>LocateService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/HelgolandMapModule.html" data-type="entity-link">HelgolandMapModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-HelgolandMapModule-3bdb86e676b48c88feb249c983de26b1"' : 'data-target="#xs-components-links-module-HelgolandMapModule-3bdb86e676b48c88feb249c983de26b1"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-HelgolandMapModule-3bdb86e676b48c88feb249c983de26b1"' :
                                            'id="xs-components-links-module-HelgolandMapModule-3bdb86e676b48c88feb249c983de26b1"' }>
                                            <li class="link">
                                                <a href="components/D3GeneralGraphComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3GeneralGraphComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3GraphCopyrightComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3GraphCopyrightComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3GraphHoverLineComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3GraphHoverLineComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3GraphPanZoomInteractionComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3GraphPanZoomInteractionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3OverviewTimeseriesGraphComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3OverviewTimeseriesGraphComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3TimeseriesGraphComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3TimeseriesGraphComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3TrajectoryGraphComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3TrajectoryGraphComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3YAxisModifierComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3YAxisModifierComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ExportImageButtonComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ExportImageButtonComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ExtendedDataD3TimeseriesGraphComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ExtendedDataD3TimeseriesGraphComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-HelgolandMapModule-3bdb86e676b48c88feb249c983de26b1"' : 'data-target="#xs-injectables-links-module-HelgolandMapModule-3bdb86e676b48c88feb249c983de26b1"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-HelgolandMapModule-3bdb86e676b48c88feb249c983de26b1"' :
                                        'id="xs-injectables-links-module-HelgolandMapModule-3bdb86e676b48c88feb249c983de26b1"' }>
                                        <li class="link">
                                            <a href="injectables/MapCache.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>MapCache</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/MapHandlerService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>MapHandlerService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/HelgolandMapSelectorModule.html" data-type="entity-link">HelgolandMapSelectorModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-HelgolandMapSelectorModule-dd6794beb93990c90cb698f682942f6d"' : 'data-target="#xs-components-links-module-HelgolandMapSelectorModule-dd6794beb93990c90cb698f682942f6d"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-HelgolandMapSelectorModule-dd6794beb93990c90cb698f682942f6d"' :
                                            'id="xs-components-links-module-HelgolandMapSelectorModule-dd6794beb93990c90cb698f682942f6d"' }>
                                            <li class="link">
                                                <a href="components/D3GeneralGraphComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3GeneralGraphComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3GraphCopyrightComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3GraphCopyrightComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3GraphHoverLineComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3GraphHoverLineComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3GraphPanZoomInteractionComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3GraphPanZoomInteractionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3OverviewTimeseriesGraphComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3OverviewTimeseriesGraphComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3TimeseriesGraphComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3TimeseriesGraphComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3TrajectoryGraphComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3TrajectoryGraphComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3YAxisModifierComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3YAxisModifierComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ExportImageButtonComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ExportImageButtonComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ExtendedDataD3TimeseriesGraphComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ExtendedDataD3TimeseriesGraphComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/HelgolandMapViewModule.html" data-type="entity-link">HelgolandMapViewModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-HelgolandMapViewModule-402fa4c793a34042792fca403e6c0be4"' : 'data-target="#xs-components-links-module-HelgolandMapViewModule-402fa4c793a34042792fca403e6c0be4"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-HelgolandMapViewModule-402fa4c793a34042792fca403e6c0be4"' :
                                            'id="xs-components-links-module-HelgolandMapViewModule-402fa4c793a34042792fca403e6c0be4"' }>
                                            <li class="link">
                                                <a href="components/GeometryMapViewerComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">GeometryMapViewerComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/HelgolandModificationModule.html" data-type="entity-link">HelgolandModificationModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-HelgolandModificationModule-e8977454d4f30ed9c1eaf660ae883368"' : 'data-target="#xs-components-links-module-HelgolandModificationModule-e8977454d4f30ed9c1eaf660ae883368"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-HelgolandModificationModule-e8977454d4f30ed9c1eaf660ae883368"' :
                                            'id="xs-components-links-module-HelgolandModificationModule-e8977454d4f30ed9c1eaf660ae883368"' }>
                                            <li class="link">
                                                <a href="components/AxesOptionsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AxesOptionsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ColorSelectorComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ColorSelectorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DragOptionsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DragOptionsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MinMaxRangeComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MinMaxRangeComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/HelgolandOpenLayersModule.html" data-type="entity-link">HelgolandOpenLayersModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-HelgolandOpenLayersModule-156ab9d448fb689c025338889fb3656e"' : 'data-target="#xs-components-links-module-HelgolandOpenLayersModule-156ab9d448fb689c025338889fb3656e"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-HelgolandOpenLayersModule-156ab9d448fb689c025338889fb3656e"' :
                                            'id="xs-components-links-module-HelgolandOpenLayersModule-156ab9d448fb689c025338889fb3656e"' }>
                                            <li class="link">
                                                <a href="components/D3GeneralGraphComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3GeneralGraphComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3GraphCopyrightComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3GraphCopyrightComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3GraphHoverLineComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3GraphHoverLineComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3GraphPanZoomInteractionComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3GraphPanZoomInteractionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3OverviewTimeseriesGraphComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3OverviewTimeseriesGraphComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3TimeseriesGraphComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3TimeseriesGraphComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3TrajectoryGraphComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3TrajectoryGraphComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3YAxisModifierComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3YAxisModifierComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ExportImageButtonComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ExportImageButtonComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ExtendedDataD3TimeseriesGraphComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ExtendedDataD3TimeseriesGraphComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/HelgolandPermalinkModule.html" data-type="entity-link">HelgolandPermalinkModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-HelgolandPermalinkModule-f046783c8444473c845d5d046bc7f1af"' : 'data-target="#xs-components-links-module-HelgolandPermalinkModule-f046783c8444473c845d5d046bc7f1af"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-HelgolandPermalinkModule-f046783c8444473c845d5d046bc7f1af"' :
                                            'id="xs-components-links-module-HelgolandPermalinkModule-f046783c8444473c845d5d046bc7f1af"' }>
                                            <li class="link">
                                                <a href="components/D3GeneralGraphComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3GeneralGraphComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3GraphCopyrightComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3GraphCopyrightComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3GraphHoverLineComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3GraphHoverLineComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3GraphPanZoomInteractionComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3GraphPanZoomInteractionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3OverviewTimeseriesGraphComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3OverviewTimeseriesGraphComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3TimeseriesGraphComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3TimeseriesGraphComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3TrajectoryGraphComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3TrajectoryGraphComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3YAxisModifierComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3YAxisModifierComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ExportImageButtonComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ExportImageButtonComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ExtendedDataD3TimeseriesGraphComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ExtendedDataD3TimeseriesGraphComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/HelgolandPlotlyModule.html" data-type="entity-link">HelgolandPlotlyModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-HelgolandPlotlyModule-0840f21cf1f121f30b3623996c56a29e"' : 'data-target="#xs-components-links-module-HelgolandPlotlyModule-0840f21cf1f121f30b3623996c56a29e"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-HelgolandPlotlyModule-0840f21cf1f121f30b3623996c56a29e"' :
                                            'id="xs-components-links-module-HelgolandPlotlyModule-0840f21cf1f121f30b3623996c56a29e"' }>
                                            <li class="link">
                                                <a href="components/PlotlyProfileGraphComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PlotlyProfileGraphComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/HelgolandSelectorModule.html" data-type="entity-link">HelgolandSelectorModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-HelgolandSelectorModule-f40296c6ace0f2c575fd6cd4bf9f00c8"' : 'data-target="#xs-components-links-module-HelgolandSelectorModule-f40296c6ace0f2c575fd6cd4bf9f00c8"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-HelgolandSelectorModule-f40296c6ace0f2c575fd6cd4bf9f00c8"' :
                                            'id="xs-components-links-module-HelgolandSelectorModule-f40296c6ace0f2c575fd6cd4bf9f00c8"' }>
                                            <li class="link">
                                                <a href="components/DatasetByStationSelectorComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DatasetByStationSelectorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ListSelectorComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ListSelectorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MultiServiceFilterSelectorComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MultiServiceFilterSelectorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ServiceFilterSelectorComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ServiceFilterSelectorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ServiceSelectorComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ServiceSelectorComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-HelgolandSelectorModule-f40296c6ace0f2c575fd6cd4bf9f00c8"' : 'data-target="#xs-injectables-links-module-HelgolandSelectorModule-f40296c6ace0f2c575fd6cd4bf9f00c8"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-HelgolandSelectorModule-f40296c6ace0f2c575fd6cd4bf9f00c8"' :
                                        'id="xs-injectables-links-module-HelgolandSelectorModule-f40296c6ace0f2c575fd6cd4bf9f00c8"' }>
                                        <li class="link">
                                            <a href="injectables/ListSelectorService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ListSelectorService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ServiceSelectorService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ServiceSelectorService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/HelgolandSensormlModule.html" data-type="entity-link">HelgolandSensormlModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/HelgolandTimeModule.html" data-type="entity-link">HelgolandTimeModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-HelgolandTimeModule-bb40fcbf4a3a3492eaf3ec99c7807417"' : 'data-target="#xs-components-links-module-HelgolandTimeModule-bb40fcbf4a3a3492eaf3ec99c7807417"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-HelgolandTimeModule-bb40fcbf4a3a3492eaf3ec99c7807417"' :
                                            'id="xs-components-links-module-HelgolandTimeModule-bb40fcbf4a3a3492eaf3ec99c7807417"' }>
                                            <li class="link">
                                                <a href="components/D3GeneralGraphComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3GeneralGraphComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3GraphCopyrightComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3GraphCopyrightComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3GraphHoverLineComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3GraphHoverLineComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3GraphPanZoomInteractionComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3GraphPanZoomInteractionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3OverviewTimeseriesGraphComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3OverviewTimeseriesGraphComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3TimeseriesGraphComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3TimeseriesGraphComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3TrajectoryGraphComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3TrajectoryGraphComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/D3YAxisModifierComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">D3YAxisModifierComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ExportImageButtonComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ExportImageButtonComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ExtendedDataD3TimeseriesGraphComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ExtendedDataD3TimeseriesGraphComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/HelgolandTimeRangeSliderModule.html" data-type="entity-link">HelgolandTimeRangeSliderModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-HelgolandTimeRangeSliderModule-4f68406018f6bbd8804b86ce208a4697"' : 'data-target="#xs-components-links-module-HelgolandTimeRangeSliderModule-4f68406018f6bbd8804b86ce208a4697"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-HelgolandTimeRangeSliderModule-4f68406018f6bbd8804b86ce208a4697"' :
                                            'id="xs-components-links-module-HelgolandTimeRangeSliderModule-4f68406018f6bbd8804b86ce208a4697"' }>
                                            <li class="link">
                                                <a href="components/TimeRangeSliderComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TimeRangeSliderComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-HelgolandTimeRangeSliderModule-4f68406018f6bbd8804b86ce208a4697"' : 'data-target="#xs-injectables-links-module-HelgolandTimeRangeSliderModule-4f68406018f6bbd8804b86ce208a4697"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-HelgolandTimeRangeSliderModule-4f68406018f6bbd8804b86ce208a4697"' :
                                        'id="xs-injectables-links-module-HelgolandTimeRangeSliderModule-4f68406018f6bbd8804b86ce208a4697"' }>
                                        <li class="link">
                                            <a href="injectables/TimeRangeSliderCache.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>TimeRangeSliderCache</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/VocabNercLabelMapperModule.html" data-type="entity-link">VocabNercLabelMapperModule</a>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#components-links"' :
                            'data-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/AutoUpdateTimespanComponent.html" data-type="entity-link">AutoUpdateTimespanComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/BoolTogglerComponent.html" data-type="entity-link">BoolTogglerComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ConfigurableTimeseriesEntryComponent.html" data-type="entity-link">ConfigurableTimeseriesEntryComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ExtentControlComponent.html" data-type="entity-link">ExtentControlComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FavoriteTogglerComponent.html" data-type="entity-link">FavoriteTogglerComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FirstLatestTimeseriesEntryComponent.html" data-type="entity-link">FirstLatestTimeseriesEntryComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/GeosearchControlComponent.html" data-type="entity-link">GeosearchControlComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LastValueMapSelectorComponent.html" data-type="entity-link">LastValueMapSelectorComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LayerOpacitySliderComponent.html" data-type="entity-link">LayerOpacitySliderComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LayerVisibleTogglerComponent.html" data-type="entity-link">LayerVisibleTogglerComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LocateControlComponent.html" data-type="entity-link">LocateControlComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/OlLayerAbstractComponent.html" data-type="entity-link">OlLayerAbstractComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/OlLayerAnimateTimeComponent.html" data-type="entity-link">OlLayerAnimateTimeComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/OlLayerComponent.html" data-type="entity-link">OlLayerComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/OlLayerLegendUrlComponent.html" data-type="entity-link">OlLayerLegendUrlComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/OlLayerOpacitiySliderComponent.html" data-type="entity-link">OlLayerOpacitiySliderComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/OlLayerTimeSelectorComponent.html" data-type="entity-link">OlLayerTimeSelectorComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/OlLayerTitleComponent.html" data-type="entity-link">OlLayerTitleComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/OlLayerVisibilityTogglerComponent.html" data-type="entity-link">OlLayerVisibilityTogglerComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/OlLayerZoomExtentComponent.html" data-type="entity-link">OlLayerZoomExtentComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/OlMapComponent.html" data-type="entity-link">OlMapComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/OlMousePositionComponent.html" data-type="entity-link">OlMousePositionComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/OlOverviewMapComponent.html" data-type="entity-link">OlOverviewMapComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/OlStationSelectorLayerComponent.html" data-type="entity-link">OlStationSelectorLayerComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ParameterFacetComponent.html" data-type="entity-link">ParameterFacetComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PermalinkInMailComponent.html" data-type="entity-link">PermalinkInMailComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PermalinkNewWindowComponent.html" data-type="entity-link">PermalinkNewWindowComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PermalinkToClipboardComponent.html" data-type="entity-link">PermalinkToClipboardComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PredefinedTimespanSelectorComponent.html" data-type="entity-link">PredefinedTimespanSelectorComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ProfileEntryComponent.html" data-type="entity-link">ProfileEntryComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ProfileTrajectoryMapSelectorComponent.html" data-type="entity-link">ProfileTrajectoryMapSelectorComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/RefreshButtonComponent.html" data-type="entity-link">RefreshButtonComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ResultListComponent.html" data-type="entity-link">ResultListComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ResultMapComponent.html" data-type="entity-link">ResultMapComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SimpleTimeseriesEntryComponent.html" data-type="entity-link">SimpleTimeseriesEntryComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StationMapSelectorComponent.html" data-type="entity-link">StationMapSelectorComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StringTogglerComponent.html" data-type="entity-link">StringTogglerComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TimeListSelectorComponent.html" data-type="entity-link">TimeListSelectorComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TimespanButtonComponent.html" data-type="entity-link">TimespanButtonComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TimespanShiftSelectorComponent.html" data-type="entity-link">TimespanShiftSelectorComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TrajectoryEntryComponent.html" data-type="entity-link">TrajectoryEntryComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ZoomControlComponent.html" data-type="entity-link">ZoomControlComponent</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AbstractAllowedValues.html" data-type="entity-link">AbstractAllowedValues</a>
                            </li>
                            <li class="link">
                                <a href="classes/AbstractDataComponent.html" data-type="entity-link">AbstractDataComponent</a>
                            </li>
                            <li class="link">
                                <a href="classes/AbstractFeature.html" data-type="entity-link">AbstractFeature</a>
                            </li>
                            <li class="link">
                                <a href="classes/AbstractGeometricPrimitive.html" data-type="entity-link">AbstractGeometricPrimitive</a>
                            </li>
                            <li class="link">
                                <a href="classes/AbstractGeometry.html" data-type="entity-link">AbstractGeometry</a>
                            </li>
                            <li class="link">
                                <a href="classes/AbstractGML.html" data-type="entity-link">AbstractGML</a>
                            </li>
                            <li class="link">
                                <a href="classes/AbstractMetadataList.html" data-type="entity-link">AbstractMetadataList</a>
                            </li>
                            <li class="link">
                                <a href="classes/AbstractModes.html" data-type="entity-link">AbstractModes</a>
                            </li>
                            <li class="link">
                                <a href="classes/AbstractNamedMetadataList.html" data-type="entity-link">AbstractNamedMetadataList</a>
                            </li>
                            <li class="link">
                                <a href="classes/AbstractNumericAllowedValues.html" data-type="entity-link">AbstractNumericAllowedValues</a>
                            </li>
                            <li class="link">
                                <a href="classes/AbstractPhysicalProcess.html" data-type="entity-link">AbstractPhysicalProcess</a>
                            </li>
                            <li class="link">
                                <a href="classes/AbstractProcess.html" data-type="entity-link">AbstractProcess</a>
                            </li>
                            <li class="link">
                                <a href="classes/AbstractReferenced.html" data-type="entity-link">AbstractReferenced</a>
                            </li>
                            <li class="link">
                                <a href="classes/AbstractSetting.html" data-type="entity-link">AbstractSetting</a>
                            </li>
                            <li class="link">
                                <a href="classes/AbstractSimpleComponent.html" data-type="entity-link">AbstractSimpleComponent</a>
                            </li>
                            <li class="link">
                                <a href="classes/AbstractSWE.html" data-type="entity-link">AbstractSWE</a>
                            </li>
                            <li class="link">
                                <a href="classes/AbstractSWEIdentifiable.html" data-type="entity-link">AbstractSWEIdentifiable</a>
                            </li>
                            <li class="link">
                                <a href="classes/AbstractSweRange.html" data-type="entity-link">AbstractSweRange</a>
                            </li>
                            <li class="link">
                                <a href="classes/AbstractTime.html" data-type="entity-link">AbstractTime</a>
                            </li>
                            <li class="link">
                                <a href="classes/AbstractXmlService.html" data-type="entity-link">AbstractXmlService</a>
                            </li>
                            <li class="link">
                                <a href="classes/Address.html" data-type="entity-link">Address</a>
                            </li>
                            <li class="link">
                                <a href="classes/AggregateProcess.html" data-type="entity-link">AggregateProcess</a>
                            </li>
                            <li class="link">
                                <a href="classes/AllowedTimes.html" data-type="entity-link">AllowedTimes</a>
                            </li>
                            <li class="link">
                                <a href="classes/AllowedTokens.html" data-type="entity-link">AllowedTokens</a>
                            </li>
                            <li class="link">
                                <a href="classes/AllowedValues.html" data-type="entity-link">AllowedValues</a>
                            </li>
                            <li class="link">
                                <a href="classes/ApiInterface.html" data-type="entity-link">ApiInterface</a>
                            </li>
                            <li class="link">
                                <a href="classes/ArrayValueSetting.html" data-type="entity-link">ArrayValueSetting</a>
                            </li>
                            <li class="link">
                                <a href="classes/Axis.html" data-type="entity-link">Axis</a>
                            </li>
                            <li class="link">
                                <a href="classes/BasicAuthInformer.html" data-type="entity-link">BasicAuthInformer</a>
                            </li>
                            <li class="link">
                                <a href="classes/BidiMap.html" data-type="entity-link">BidiMap</a>
                            </li>
                            <li class="link">
                                <a href="classes/BufferedTime.html" data-type="entity-link">BufferedTime</a>
                            </li>
                            <li class="link">
                                <a href="classes/CachedMapComponent.html" data-type="entity-link">CachedMapComponent</a>
                            </li>
                            <li class="link">
                                <a href="classes/CapabilityList.html" data-type="entity-link">CapabilityList</a>
                            </li>
                            <li class="link">
                                <a href="classes/CharacteristicList.html" data-type="entity-link">CharacteristicList</a>
                            </li>
                            <li class="link">
                                <a href="classes/Citation.html" data-type="entity-link">Citation</a>
                            </li>
                            <li class="link">
                                <a href="classes/ClassifierList.html" data-type="entity-link">ClassifierList</a>
                            </li>
                            <li class="link">
                                <a href="classes/CodeType.html" data-type="entity-link">CodeType</a>
                            </li>
                            <li class="link">
                                <a href="classes/CodeWithAuthority.html" data-type="entity-link">CodeWithAuthority</a>
                            </li>
                            <li class="link">
                                <a href="classes/Component.html" data-type="entity-link">Component</a>
                            </li>
                            <li class="link">
                                <a href="classes/ComponentList.html" data-type="entity-link">ComponentList</a>
                            </li>
                            <li class="link">
                                <a href="classes/Connection.html" data-type="entity-link">Connection</a>
                            </li>
                            <li class="link">
                                <a href="classes/ConnectionList.html" data-type="entity-link">ConnectionList</a>
                            </li>
                            <li class="link">
                                <a href="classes/ConstraintSetting.html" data-type="entity-link">ConstraintSetting</a>
                            </li>
                            <li class="link">
                                <a href="classes/Contact.html" data-type="entity-link">Contact</a>
                            </li>
                            <li class="link">
                                <a href="classes/ContactList.html" data-type="entity-link">ContactList</a>
                            </li>
                            <li class="link">
                                <a href="classes/D3DataGeneralizer.html" data-type="entity-link">D3DataGeneralizer</a>
                            </li>
                            <li class="link">
                                <a href="classes/D3HoveringService.html" data-type="entity-link">D3HoveringService</a>
                            </li>
                            <li class="link">
                                <a href="classes/D3SelectionRange.html" data-type="entity-link">D3SelectionRange</a>
                            </li>
                            <li class="link">
                                <a href="classes/D3TimeseriesGraphControl.html" data-type="entity-link">D3TimeseriesGraphControl</a>
                            </li>
                            <li class="link">
                                <a href="classes/DataInterface.html" data-type="entity-link">DataInterface</a>
                            </li>
                            <li class="link">
                                <a href="classes/Dataset.html" data-type="entity-link">Dataset</a>
                            </li>
                            <li class="link">
                                <a href="classes/DatasetApiInterface.html" data-type="entity-link">DatasetApiInterface</a>
                            </li>
                            <li class="link">
                                <a href="classes/DatasetOptions.html" data-type="entity-link">DatasetOptions</a>
                            </li>
                            <li class="link">
                                <a href="classes/DatasetParameterConstellation.html" data-type="entity-link">DatasetParameterConstellation</a>
                            </li>
                            <li class="link">
                                <a href="classes/DatasetPresenterComponent.html" data-type="entity-link">DatasetPresenterComponent</a>
                            </li>
                            <li class="link">
                                <a href="classes/DatasetService.html" data-type="entity-link">DatasetService</a>
                            </li>
                            <li class="link">
                                <a href="classes/DecoderUtils.html" data-type="entity-link">DecoderUtils</a>
                            </li>
                            <li class="link">
                                <a href="classes/DescribedObject.html" data-type="entity-link">DescribedObject</a>
                            </li>
                            <li class="link">
                                <a href="classes/DocumentList.html" data-type="entity-link">DocumentList</a>
                            </li>
                            <li class="link">
                                <a href="classes/Envelope.html" data-type="entity-link">Envelope</a>
                            </li>
                            <li class="link">
                                <a href="classes/Event.html" data-type="entity-link">Event</a>
                            </li>
                            <li class="link">
                                <a href="classes/EventingApiService.html" data-type="entity-link">EventingApiService</a>
                            </li>
                            <li class="link">
                                <a href="classes/EventList.html" data-type="entity-link">EventList</a>
                            </li>
                            <li class="link">
                                <a href="classes/FacetSearchService.html" data-type="entity-link">FacetSearchService</a>
                            </li>
                            <li class="link">
                                <a href="classes/FeatureList.html" data-type="entity-link">FeatureList</a>
                            </li>
                            <li class="link">
                                <a href="classes/FeatureProperty.html" data-type="entity-link">FeatureProperty</a>
                            </li>
                            <li class="link">
                                <a href="classes/Filter.html" data-type="entity-link">Filter</a>
                            </li>
                            <li class="link">
                                <a href="classes/FirstLastValue.html" data-type="entity-link">FirstLastValue</a>
                            </li>
                            <li class="link">
                                <a href="classes/GeoCureGeoJSON.html" data-type="entity-link">GeoCureGeoJSON</a>
                            </li>
                            <li class="link">
                                <a href="classes/GeoSearch.html" data-type="entity-link">GeoSearch</a>
                            </li>
                            <li class="link">
                                <a href="classes/GmlDecoder.html" data-type="entity-link">GmlDecoder</a>
                            </li>
                            <li class="link">
                                <a href="classes/GmlEncoder.html" data-type="entity-link">GmlEncoder</a>
                            </li>
                            <li class="link">
                                <a href="classes/HasLoadableContent.html" data-type="entity-link">HasLoadableContent</a>
                            </li>
                            <li class="link">
                                <a href="classes/HelgolandDataset.html" data-type="entity-link">HelgolandDataset</a>
                            </li>
                            <li class="link">
                                <a href="classes/HelgolandLocatedProfileData.html" data-type="entity-link">HelgolandLocatedProfileData</a>
                            </li>
                            <li class="link">
                                <a href="classes/HelgolandParameterFilter.html" data-type="entity-link">HelgolandParameterFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/HelgolandPlatform.html" data-type="entity-link">HelgolandPlatform</a>
                            </li>
                            <li class="link">
                                <a href="classes/HelgolandProfile.html" data-type="entity-link">HelgolandProfile</a>
                            </li>
                            <li class="link">
                                <a href="classes/HelgolandProfileData.html" data-type="entity-link">HelgolandProfileData</a>
                            </li>
                            <li class="link">
                                <a href="classes/HelgolandService.html" data-type="entity-link">HelgolandService</a>
                            </li>
                            <li class="link">
                                <a href="classes/HelgolandTimeseries.html" data-type="entity-link">HelgolandTimeseries</a>
                            </li>
                            <li class="link">
                                <a href="classes/HelgolandTimeseriesData.html" data-type="entity-link">HelgolandTimeseriesData</a>
                            </li>
                            <li class="link">
                                <a href="classes/HelgolandTrajectory.html" data-type="entity-link">HelgolandTrajectory</a>
                            </li>
                            <li class="link">
                                <a href="classes/HelgolandTrajectoryData.html" data-type="entity-link">HelgolandTrajectoryData</a>
                            </li>
                            <li class="link">
                                <a href="classes/HttpCache.html" data-type="entity-link">HttpCache</a>
                            </li>
                            <li class="link">
                                <a href="classes/HttpCacheInterval.html" data-type="entity-link">HttpCacheInterval</a>
                            </li>
                            <li class="link">
                                <a href="classes/IdCache.html" data-type="entity-link">IdCache</a>
                            </li>
                            <li class="link">
                                <a href="classes/Identifier.html" data-type="entity-link">Identifier</a>
                            </li>
                            <li class="link">
                                <a href="classes/IdentifierList.html" data-type="entity-link">IdentifierList</a>
                            </li>
                            <li class="link">
                                <a href="classes/Input.html" data-type="entity-link">Input</a>
                            </li>
                            <li class="link">
                                <a href="classes/InputList.html" data-type="entity-link">InputList</a>
                            </li>
                            <li class="link">
                                <a href="classes/InputOrOutputOrParameter.html" data-type="entity-link">InputOrOutputOrParameter</a>
                            </li>
                            <li class="link">
                                <a href="classes/IsoDate.html" data-type="entity-link">IsoDate</a>
                            </li>
                            <li class="link">
                                <a href="classes/IsoDecoder.html" data-type="entity-link">IsoDecoder</a>
                            </li>
                            <li class="link">
                                <a href="classes/IsoEncoder.html" data-type="entity-link">IsoEncoder</a>
                            </li>
                            <li class="link">
                                <a href="classes/KeywordList.html" data-type="entity-link">KeywordList</a>
                            </li>
                            <li class="link">
                                <a href="classes/Keywords.html" data-type="entity-link">Keywords</a>
                            </li>
                            <li class="link">
                                <a href="classes/LanguageChangNotifier.html" data-type="entity-link">LanguageChangNotifier</a>
                            </li>
                            <li class="link">
                                <a href="classes/LastValueLabelGenerator.html" data-type="entity-link">LastValueLabelGenerator</a>
                            </li>
                            <li class="link">
                                <a href="classes/LayerControlComponent.html" data-type="entity-link">LayerControlComponent</a>
                            </li>
                            <li class="link">
                                <a href="classes/LegalConstraints.html" data-type="entity-link">LegalConstraints</a>
                            </li>
                            <li class="link">
                                <a href="classes/ListEntryComponent.html" data-type="entity-link">ListEntryComponent</a>
                            </li>
                            <li class="link">
                                <a href="classes/LocalSelectorComponent.html" data-type="entity-link">LocalSelectorComponent</a>
                            </li>
                            <li class="link">
                                <a href="classes/MapControlComponent.html" data-type="entity-link">MapControlComponent</a>
                            </li>
                            <li class="link">
                                <a href="classes/MapSelectorComponent.html" data-type="entity-link">MapSelectorComponent</a>
                            </li>
                            <li class="link">
                                <a href="classes/Mode.html" data-type="entity-link">Mode</a>
                            </li>
                            <li class="link">
                                <a href="classes/ModeChoice.html" data-type="entity-link">ModeChoice</a>
                            </li>
                            <li class="link">
                                <a href="classes/ModeSetting.html" data-type="entity-link">ModeSetting</a>
                            </li>
                            <li class="link">
                                <a href="classes/NamedSweDataComponent.html" data-type="entity-link">NamedSweDataComponent</a>
                            </li>
                            <li class="link">
                                <a href="classes/ObjectAndProperty.html" data-type="entity-link">ObjectAndProperty</a>
                            </li>
                            <li class="link">
                                <a href="classes/ObservableProperty.html" data-type="entity-link">ObservableProperty</a>
                            </li>
                            <li class="link">
                                <a href="classes/OlBaseComponent.html" data-type="entity-link">OlBaseComponent</a>
                            </li>
                            <li class="link">
                                <a href="classes/OnGoingHttpCache.html" data-type="entity-link">OnGoingHttpCache</a>
                            </li>
                            <li class="link">
                                <a href="classes/OnlineResource.html" data-type="entity-link">OnlineResource</a>
                            </li>
                            <li class="link">
                                <a href="classes/Output.html" data-type="entity-link">Output</a>
                            </li>
                            <li class="link">
                                <a href="classes/OutputList.html" data-type="entity-link">OutputList</a>
                            </li>
                            <li class="link">
                                <a href="classes/Parameter.html" data-type="entity-link">Parameter</a>
                            </li>
                            <li class="link">
                                <a href="classes/ParameterConstellation.html" data-type="entity-link">ParameterConstellation</a>
                            </li>
                            <li class="link">
                                <a href="classes/ParameterList.html" data-type="entity-link">ParameterList</a>
                            </li>
                            <li class="link">
                                <a href="classes/PermalinkService.html" data-type="entity-link">PermalinkService</a>
                            </li>
                            <li class="link">
                                <a href="classes/Phone.html" data-type="entity-link">Phone</a>
                            </li>
                            <li class="link">
                                <a href="classes/PhysicalComponent.html" data-type="entity-link">PhysicalComponent</a>
                            </li>
                            <li class="link">
                                <a href="classes/PhysicalSystem.html" data-type="entity-link">PhysicalSystem</a>
                            </li>
                            <li class="link">
                                <a href="classes/Point.html" data-type="entity-link">Point</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProcessMethod.html" data-type="entity-link">ProcessMethod</a>
                            </li>
                            <li class="link">
                                <a href="classes/ReferenceValue.html" data-type="entity-link">ReferenceValue</a>
                            </li>
                            <li class="link">
                                <a href="classes/ReferenceValues.html" data-type="entity-link">ReferenceValues</a>
                            </li>
                            <li class="link">
                                <a href="classes/RenderingHintsDatasetService.html" data-type="entity-link">RenderingHintsDatasetService</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResizableComponent.html" data-type="entity-link">ResizableComponent</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResponsibleParty.html" data-type="entity-link">ResponsibleParty</a>
                            </li>
                            <li class="link">
                                <a href="classes/ReturnObject.html" data-type="entity-link">ReturnObject</a>
                            </li>
                            <li class="link">
                                <a href="classes/SelectableDataset.html" data-type="entity-link">SelectableDataset</a>
                            </li>
                            <li class="link">
                                <a href="classes/SensorMLDecoder.html" data-type="entity-link">SensorMLDecoder</a>
                            </li>
                            <li class="link">
                                <a href="classes/SensorMLDocumentDecoder.html" data-type="entity-link">SensorMLDocumentDecoder</a>
                            </li>
                            <li class="link">
                                <a href="classes/SensorMLDocumentEncoder.html" data-type="entity-link">SensorMLDocumentEncoder</a>
                            </li>
                            <li class="link">
                                <a href="classes/SensorMLEncoder.html" data-type="entity-link">SensorMLEncoder</a>
                            </li>
                            <li class="link">
                                <a href="classes/SensorMLNamespaceResolver.html" data-type="entity-link">SensorMLNamespaceResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/SensorMLXmlService.html" data-type="entity-link">SensorMLXmlService</a>
                            </li>
                            <li class="link">
                                <a href="classes/Series.html" data-type="entity-link">Series</a>
                            </li>
                            <li class="link">
                                <a href="classes/Settings.html" data-type="entity-link">Settings</a>
                            </li>
                            <li class="link">
                                <a href="classes/SettingsService.html" data-type="entity-link">SettingsService</a>
                            </li>
                            <li class="link">
                                <a href="classes/SimpleProcess.html" data-type="entity-link">SimpleProcess</a>
                            </li>
                            <li class="link">
                                <a href="classes/SpatialFrame.html" data-type="entity-link">SpatialFrame</a>
                            </li>
                            <li class="link">
                                <a href="classes/Station.html" data-type="entity-link">Station</a>
                            </li>
                            <li class="link">
                                <a href="classes/StatusSetting.html" data-type="entity-link">StatusSetting</a>
                            </li>
                            <li class="link">
                                <a href="classes/SweBinaryBlock.html" data-type="entity-link">SweBinaryBlock</a>
                            </li>
                            <li class="link">
                                <a href="classes/SweBinaryComponent.html" data-type="entity-link">SweBinaryComponent</a>
                            </li>
                            <li class="link">
                                <a href="classes/SweBinaryEncoding.html" data-type="entity-link">SweBinaryEncoding</a>
                            </li>
                            <li class="link">
                                <a href="classes/SweBoolean.html" data-type="entity-link">SweBoolean</a>
                            </li>
                            <li class="link">
                                <a href="classes/SweCategory.html" data-type="entity-link">SweCategory</a>
                            </li>
                            <li class="link">
                                <a href="classes/SweCategoryRange.html" data-type="entity-link">SweCategoryRange</a>
                            </li>
                            <li class="link">
                                <a href="classes/SweCoordinate.html" data-type="entity-link">SweCoordinate</a>
                            </li>
                            <li class="link">
                                <a href="classes/SweCount.html" data-type="entity-link">SweCount</a>
                            </li>
                            <li class="link">
                                <a href="classes/SweCountRange.html" data-type="entity-link">SweCountRange</a>
                            </li>
                            <li class="link">
                                <a href="classes/SweDataArray.html" data-type="entity-link">SweDataArray</a>
                            </li>
                            <li class="link">
                                <a href="classes/SweDataChoice.html" data-type="entity-link">SweDataChoice</a>
                            </li>
                            <li class="link">
                                <a href="classes/SweDataChoiceItem.html" data-type="entity-link">SweDataChoiceItem</a>
                            </li>
                            <li class="link">
                                <a href="classes/SweDataRecord.html" data-type="entity-link">SweDataRecord</a>
                            </li>
                            <li class="link">
                                <a href="classes/SweDataStream.html" data-type="entity-link">SweDataStream</a>
                            </li>
                            <li class="link">
                                <a href="classes/SweDecoder.html" data-type="entity-link">SweDecoder</a>
                            </li>
                            <li class="link">
                                <a href="classes/SweElementType.html" data-type="entity-link">SweElementType</a>
                            </li>
                            <li class="link">
                                <a href="classes/SweEncoder.html" data-type="entity-link">SweEncoder</a>
                            </li>
                            <li class="link">
                                <a href="classes/SweEncoding.html" data-type="entity-link">SweEncoding</a>
                            </li>
                            <li class="link">
                                <a href="classes/SweField.html" data-type="entity-link">SweField</a>
                            </li>
                            <li class="link">
                                <a href="classes/SweMatrix.html" data-type="entity-link">SweMatrix</a>
                            </li>
                            <li class="link">
                                <a href="classes/SweNilValue.html" data-type="entity-link">SweNilValue</a>
                            </li>
                            <li class="link">
                                <a href="classes/SweQuantity.html" data-type="entity-link">SweQuantity</a>
                            </li>
                            <li class="link">
                                <a href="classes/SweQuantityRange.html" data-type="entity-link">SweQuantityRange</a>
                            </li>
                            <li class="link">
                                <a href="classes/SweText.html" data-type="entity-link">SweText</a>
                            </li>
                            <li class="link">
                                <a href="classes/SweTextEncoding.html" data-type="entity-link">SweTextEncoding</a>
                            </li>
                            <li class="link">
                                <a href="classes/SweTime.html" data-type="entity-link">SweTime</a>
                            </li>
                            <li class="link">
                                <a href="classes/SweTimeRange.html" data-type="entity-link">SweTimeRange</a>
                            </li>
                            <li class="link">
                                <a href="classes/SweVector.html" data-type="entity-link">SweVector</a>
                            </li>
                            <li class="link">
                                <a href="classes/SweXmlEncoding.html" data-type="entity-link">SweXmlEncoding</a>
                            </li>
                            <li class="link">
                                <a href="classes/TemporalFrame.html" data-type="entity-link">TemporalFrame</a>
                            </li>
                            <li class="link">
                                <a href="classes/Term.html" data-type="entity-link">Term</a>
                            </li>
                            <li class="link">
                                <a href="classes/TimedDatasetOptions.html" data-type="entity-link">TimedDatasetOptions</a>
                            </li>
                            <li class="link">
                                <a href="classes/TimeInstant.html" data-type="entity-link">TimeInstant</a>
                            </li>
                            <li class="link">
                                <a href="classes/TimeInterval.html" data-type="entity-link">TimeInterval</a>
                            </li>
                            <li class="link">
                                <a href="classes/TimePeriod.html" data-type="entity-link">TimePeriod</a>
                            </li>
                            <li class="link">
                                <a href="classes/Timeseries.html" data-type="entity-link">Timeseries</a>
                            </li>
                            <li class="link">
                                <a href="classes/TimeseriesCollection.html" data-type="entity-link">TimeseriesCollection</a>
                            </li>
                            <li class="link">
                                <a href="classes/TimeseriesData.html" data-type="entity-link">TimeseriesData</a>
                            </li>
                            <li class="link">
                                <a href="classes/Timespan.html" data-type="entity-link">Timespan</a>
                            </li>
                            <li class="link">
                                <a href="classes/UnitOfMeasure.html" data-type="entity-link">UnitOfMeasure</a>
                            </li>
                            <li class="link">
                                <a href="classes/UriParameterCoder.html" data-type="entity-link">UriParameterCoder</a>
                            </li>
                            <li class="link">
                                <a href="classes/UrlGenerator.html" data-type="entity-link">UrlGenerator</a>
                            </li>
                            <li class="link">
                                <a href="classes/ValueSetting.html" data-type="entity-link">ValueSetting</a>
                            </li>
                            <li class="link">
                                <a href="classes/XmlService.html" data-type="entity-link">XmlService</a>
                            </li>
                            <li class="link">
                                <a href="classes/XPathDocument.html" data-type="entity-link">XPathDocument</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/ApiV3InterfaceService.html" data-type="entity-link">ApiV3InterfaceService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/BasicAuthInterceptorService.html" data-type="entity-link">BasicAuthInterceptorService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CachingInterceptor.html" data-type="entity-link">CachingInterceptor</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CorsProxyInterceptor.html" data-type="entity-link">CorsProxyInterceptor</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/D3DataSimpleGeneralizer.html" data-type="entity-link">D3DataSimpleGeneralizer</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/D3GraphHelperService.html" data-type="entity-link">D3GraphHelperService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/D3GraphId.html" data-type="entity-link">D3GraphId</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/D3Graphs.html" data-type="entity-link">D3Graphs</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/D3SimpleHoveringService.html" data-type="entity-link">D3SimpleHoveringService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DatasetApiV1Connector.html" data-type="entity-link">DatasetApiV1Connector</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DatasetApiV2Connector.html" data-type="entity-link">DatasetApiV2Connector</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DatasetApiV3Connector.html" data-type="entity-link">DatasetApiV3Connector</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DatasetImplApiInterface.html" data-type="entity-link">DatasetImplApiInterface</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EventingImplApiInterface.html" data-type="entity-link">EventingImplApiInterface</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ExtendedSettingsService.html" data-type="entity-link">ExtendedSettingsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FacetSearchConfig.html" data-type="entity-link">FacetSearchConfig</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FacetSearchServiceImpl.html" data-type="entity-link">FacetSearchServiceImpl</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/HelgolandServicesConnector.html" data-type="entity-link">HelgolandServicesConnector</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LastValueLabelGeneratorService.html" data-type="entity-link">LastValueLabelGeneratorService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LocalHttpCache.html" data-type="entity-link">LocalHttpCache</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LocalHttpCacheInterval.html" data-type="entity-link">LocalHttpCacheInterval</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LocalHttpCacheIntervalInterceptor.html" data-type="entity-link">LocalHttpCacheIntervalInterceptor</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LocalOngoingHttpCache.html" data-type="entity-link">LocalOngoingHttpCache</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NominatimGeoSearchService.html" data-type="entity-link">NominatimGeoSearchService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/OlMapId.html" data-type="entity-link">OlMapId</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/OlMapService.html" data-type="entity-link">OlMapService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RangeCalculationsService.html" data-type="entity-link">RangeCalculationsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SplittedDataDatasetApiInterface.html" data-type="entity-link">SplittedDataDatasetApiInterface</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StaApiV1Connector.html" data-type="entity-link">StaApiV1Connector</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StaDeleteInterfaceService.html" data-type="entity-link">StaDeleteInterfaceService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StaInsertInterfaceService.html" data-type="entity-link">StaInsertInterfaceService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StaReadInterfaceService.html" data-type="entity-link">StaReadInterfaceService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StatusCheckService.html" data-type="entity-link">StatusCheckService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/VocabNercLabelMapperService.html" data-type="entity-link">VocabNercLabelMapperService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/WmsCapabilitiesService.html" data-type="entity-link">WmsCapabilitiesService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/AbstractAlgorithm.html" data-type="entity-link">AbstractAlgorithm</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AdditionalData.html" data-type="entity-link">AdditionalData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AdditionalDataEntry.html" data-type="entity-link">AdditionalDataEntry</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Address.html" data-type="entity-link">Address</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AggregatingProcess.html" data-type="entity-link">AggregatingProcess</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ApiV3Category.html" data-type="entity-link">ApiV3Category</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ApiV3Dataset.html" data-type="entity-link">ApiV3Dataset</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ApiV3DatasetDataFilter.html" data-type="entity-link">ApiV3DatasetDataFilter</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ApiV3Feature.html" data-type="entity-link">ApiV3Feature</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ApiV3FirstLastValue.html" data-type="entity-link">ApiV3FirstLastValue</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ApiV3MeasuringProgram.html" data-type="entity-link">ApiV3MeasuringProgram</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ApiV3Offering.html" data-type="entity-link">ApiV3Offering</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ApiV3Parameter.html" data-type="entity-link">ApiV3Parameter</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ApiV3ParameterFilter.html" data-type="entity-link">ApiV3ParameterFilter</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ApiV3Phenomenon.html" data-type="entity-link">ApiV3Phenomenon</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ApiV3Platform.html" data-type="entity-link">ApiV3Platform</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ApiV3Procedure.html" data-type="entity-link">ApiV3Procedure</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ApiV3Sampler.html" data-type="entity-link">ApiV3Sampler</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ApiV3Sampling.html" data-type="entity-link">ApiV3Sampling</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ApiV3SamplingObservation.html" data-type="entity-link">ApiV3SamplingObservation</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ApiV3SamplingsFilter.html" data-type="entity-link">ApiV3SamplingsFilter</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ApiV3Service.html" data-type="entity-link">ApiV3Service</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AssociationAttributeGroup.html" data-type="entity-link">AssociationAttributeGroup</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BarRenderingHints.html" data-type="entity-link">BarRenderingHints</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BasicAuthCredentials.html" data-type="entity-link">BasicAuthCredentials</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BlacklistedService.html" data-type="entity-link">BlacklistedService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Cache.html" data-type="entity-link">Cache</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CacheConfig.html" data-type="entity-link">CacheConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CachedIntersection.html" data-type="entity-link">CachedIntersection</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CachedItem.html" data-type="entity-link">CachedItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CachedObject.html" data-type="entity-link">CachedObject</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Category.html" data-type="entity-link">Category</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CollectionMetadata.html" data-type="entity-link">CollectionMetadata</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/D3Copyright.html" data-type="entity-link">D3Copyright</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/D3GeneralAxisOptions.html" data-type="entity-link">D3GeneralAxisOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/D3GeneralDataPoint.html" data-type="entity-link">D3GeneralDataPoint</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/D3GeneralDataset.html" data-type="entity-link">D3GeneralDataset</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/D3GeneralDatasetInput.html" data-type="entity-link">D3GeneralDatasetInput</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/D3GeneralGraphOptions.html" data-type="entity-link">D3GeneralGraphOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/D3GeneralInput.html" data-type="entity-link">D3GeneralInput</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/D3GeneralPlotOptions.html" data-type="entity-link">D3GeneralPlotOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/D3GraphExtent.html" data-type="entity-link">D3GraphExtent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/D3GraphObserver.html" data-type="entity-link">D3GraphObserver</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/D3GraphOptions.html" data-type="entity-link">D3GraphOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/D3PlotOptions.html" data-type="entity-link">D3PlotOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Data.html" data-type="entity-link">Data</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DataConst.html" data-type="entity-link">DataConst</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DataEntry.html" data-type="entity-link">DataEntry</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DataEntry-1.html" data-type="entity-link">DataEntry</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DataParameterFilter.html" data-type="entity-link">DataParameterFilter</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DatasetApi.html" data-type="entity-link">DatasetApi</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DatasetApiV1.html" data-type="entity-link">DatasetApiV1</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DatasetApiV2.html" data-type="entity-link">DatasetApiV2</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DatasetConstellation.html" data-type="entity-link">DatasetConstellation</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DatasetExtras.html" data-type="entity-link">DatasetExtras</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DatasetFilter.html" data-type="entity-link">DatasetFilter</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DatasetTableData.html" data-type="entity-link">DatasetTableData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Datastream.html" data-type="entity-link">Datastream</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DatastreamExpandParams.html" data-type="entity-link">DatastreamExpandParams</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DatastreamSelectParams.html" data-type="entity-link">DatastreamSelectParams</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DrawOptions.html" data-type="entity-link">DrawOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Event.html" data-type="entity-link">Event</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EventFilter.html" data-type="entity-link">EventFilter</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EventingEndpoint.html" data-type="entity-link">EventingEndpoint</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EventingFilter.html" data-type="entity-link">EventingFilter</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EventResults.html" data-type="entity-link">EventResults</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EventTrigger.html" data-type="entity-link">EventTrigger</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EventType.html" data-type="entity-link">EventType</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ExportOptions.html" data-type="entity-link">ExportOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ExtendedFilter.html" data-type="entity-link">ExtendedFilter</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ExtendedScatterData.html" data-type="entity-link">ExtendedScatterData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FacetParameter.html" data-type="entity-link">FacetParameter</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Favorite.html" data-type="entity-link">Favorite</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Feature.html" data-type="entity-link">Feature</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FeatureOfInterest.html" data-type="entity-link">FeatureOfInterest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FeatureOfInterestExpandParams.html" data-type="entity-link">FeatureOfInterestExpandParams</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FeatureOfInterestSelectParams.html" data-type="entity-link">FeatureOfInterestSelectParams</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FilteredParameter.html" data-type="entity-link">FilteredParameter</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FilteredProvider.html" data-type="entity-link">FilteredProvider</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GeoCureGeoJSONOptions.html" data-type="entity-link">GeoCureGeoJSONOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GeoReverseOptions.html" data-type="entity-link">GeoReverseOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GeoReverseResult.html" data-type="entity-link">GeoReverseResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GeoSearchOptions.html" data-type="entity-link">GeoSearchOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GeoSearchResult.html" data-type="entity-link">GeoSearchResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GroupFavorite.html" data-type="entity-link">GroupFavorite</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HelgolandCsvExportLinkParams.html" data-type="entity-link">HelgolandCsvExportLinkParams</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HelgolandData.html" data-type="entity-link">HelgolandData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HelgolandDataFilter.html" data-type="entity-link">HelgolandDataFilter</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HelgolandMapSelectorModuleConfig.html" data-type="entity-link">HelgolandMapSelectorModuleConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HelgolandServiceConnector.html" data-type="entity-link">HelgolandServiceConnector</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HelgolandServiceInterface.html" data-type="entity-link">HelgolandServiceInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HelgolandServiceQuantities.html" data-type="entity-link">HelgolandServiceQuantities</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HighlightDataset.html" data-type="entity-link">HighlightDataset</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HighlightOutput.html" data-type="entity-link">HighlightOutput</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HighlightValue.html" data-type="entity-link">HighlightValue</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HistoricalLocation.html" data-type="entity-link">HistoricalLocation</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HistoricalLocationExpandParams.html" data-type="entity-link">HistoricalLocationExpandParams</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HistoricalLocationSelectParams.html" data-type="entity-link">HistoricalLocationSelectParams</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HttpRequestOptions.html" data-type="entity-link">HttpRequestOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HttpServiceHandler.html" data-type="entity-link">HttpServiceHandler</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HttpServiceInterceptor.html" data-type="entity-link">HttpServiceInterceptor</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Id.html" data-type="entity-link">Id</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IDataEntry.html" data-type="entity-link">IDataEntry</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IDataset.html" data-type="entity-link">IDataset</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Identifiable.html" data-type="entity-link">Identifiable</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/InsertDatastream.html" data-type="entity-link">InsertDatastream</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/InsertFeatureOfInterest.html" data-type="entity-link">InsertFeatureOfInterest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/InsertHistoricalLocation.html" data-type="entity-link">InsertHistoricalLocation</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/InsertId.html" data-type="entity-link">InsertId</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/InsertLocation.html" data-type="entity-link">InsertLocation</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/InsertObservation.html" data-type="entity-link">InsertObservation</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/InsertObservedProperty.html" data-type="entity-link">InsertObservedProperty</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/InsertSensor.html" data-type="entity-link">InsertSensor</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/InsertThing.html" data-type="entity-link">InsertThing</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/InternalDataEntry.html" data-type="entity-link">InternalDataEntry</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/InternalDatasetId.html" data-type="entity-link">InternalDatasetId</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/InternalWMSLayer.html" data-type="entity-link">InternalWMSLayer</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LabelMapperHandler.html" data-type="entity-link">LabelMapperHandler</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Language.html" data-type="entity-link">Language</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LayerOptions.html" data-type="entity-link">LayerOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Layout.html" data-type="entity-link">Layout</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LineRenderingHints.html" data-type="entity-link">LineRenderingHints</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ListSelectorParameter.html" data-type="entity-link">ListSelectorParameter</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LocatedProfileDataEntry.html" data-type="entity-link">LocatedProfileDataEntry</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LocatedTimeValueEntry.html" data-type="entity-link">LocatedTimeValueEntry</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Location.html" data-type="entity-link">Location</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LocationExpandParams.html" data-type="entity-link">LocationExpandParams</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LocationSelectParams.html" data-type="entity-link">LocationSelectParams</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MarkerSelectorGenerator.html" data-type="entity-link">MarkerSelectorGenerator</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MinMaxRange.html" data-type="entity-link">MinMaxRange</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MultiServiceFilter.html" data-type="entity-link">MultiServiceFilter</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NominatimReverseResult.html" data-type="entity-link">NominatimReverseResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NominatimSearchResult.html" data-type="entity-link">NominatimSearchResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Notification.html" data-type="entity-link">Notification</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NotificationFilter.html" data-type="entity-link">NotificationFilter</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NotificationLevel.html" data-type="entity-link">NotificationLevel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NotificationResults.html" data-type="entity-link">NotificationResults</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Observation.html" data-type="entity-link">Observation</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ObservationExpandParams.html" data-type="entity-link">ObservationExpandParams</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ObservationSelectParams.html" data-type="entity-link">ObservationSelectParams</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ObservedProperty.html" data-type="entity-link">ObservedProperty</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ObservedPropertyExpandParams.html" data-type="entity-link">ObservedPropertyExpandParams</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ObservedPropertySelectParams.html" data-type="entity-link">ObservedPropertySelectParams</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Offering.html" data-type="entity-link">Offering</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PagingFilter.html" data-type="entity-link">PagingFilter</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Parameter.html" data-type="entity-link">Parameter</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ParameterFilter.html" data-type="entity-link">ParameterFilter</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ParsedTimespanPreset.html" data-type="entity-link">ParsedTimespanPreset</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Phenomenon.html" data-type="entity-link">Phenomenon</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Platform.html" data-type="entity-link">Platform</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PlatformParameter.html" data-type="entity-link">PlatformParameter</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PresenterHighlight.html" data-type="entity-link">PresenterHighlight</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PresenterMessage.html" data-type="entity-link">PresenterMessage</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PresenterOptions.html" data-type="entity-link">PresenterOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Procedure.html" data-type="entity-link">Procedure</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ProcessMethodProcess.html" data-type="entity-link">ProcessMethodProcess</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ProfileDataEntry.html" data-type="entity-link">ProfileDataEntry</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Provider.html" data-type="entity-link">Provider</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Publication.html" data-type="entity-link">Publication</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PublicationFilter.html" data-type="entity-link">PublicationFilter</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PublicationResults.html" data-type="entity-link">PublicationResults</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Range.html" data-type="entity-link">Range</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RawData.html" data-type="entity-link">RawData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Referenced.html" data-type="entity-link">Referenced</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ReferenceValueOption.html" data-type="entity-link">ReferenceValueOption</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RenderingHints.html" data-type="entity-link">RenderingHints</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Resolver.html" data-type="entity-link">Resolver</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Rule.html" data-type="entity-link">Rule</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ScatterData.html" data-type="entity-link">ScatterData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Sensor.html" data-type="entity-link">Sensor</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SensorExpandParams.html" data-type="entity-link">SensorExpandParams</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SensorSelectParams.html" data-type="entity-link">SensorSelectParams</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Service.html" data-type="entity-link">Service</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ServiceQuantities.html" data-type="entity-link">ServiceQuantities</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Settings.html" data-type="entity-link">Settings</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SingleFavorite.html" data-type="entity-link">SingleFavorite</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StaDeleteInterface.html" data-type="entity-link">StaDeleteInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StaExpandParams.html" data-type="entity-link">StaExpandParams</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StaFilter.html" data-type="entity-link">StaFilter</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StaInsertInterface.html" data-type="entity-link">StaInsertInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StaObject.html" data-type="entity-link">StaObject</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StaReadInterface.html" data-type="entity-link">StaReadInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StaSelectParams.html" data-type="entity-link">StaSelectParams</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StationProperties.html" data-type="entity-link">StationProperties</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StatusInterval.html" data-type="entity-link">StatusInterval</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StaValueListResponse.html" data-type="entity-link">StaValueListResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Subscription.html" data-type="entity-link">Subscription</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SubscriptionFilter.html" data-type="entity-link">SubscriptionFilter</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SubscriptionResults.html" data-type="entity-link">SubscriptionResults</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SupportedMimeTypes.html" data-type="entity-link">SupportedMimeTypes</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Thing.html" data-type="entity-link">Thing</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ThingExpandParams.html" data-type="entity-link">ThingExpandParams</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ThingSelectParams.html" data-type="entity-link">ThingSelectParams</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TimeseriesExtras.html" data-type="entity-link">TimeseriesExtras</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TimespanMomentTemplate.html" data-type="entity-link">TimespanMomentTemplate</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TimespanPreset.html" data-type="entity-link">TimespanPreset</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TimeValueEntry.html" data-type="entity-link">TimeValueEntry</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TrajectoryResult.html" data-type="entity-link">TrajectoryResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UnitOfMeasurement.html" data-type="entity-link">UnitOfMeasurement</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WMSLayer.html" data-type="entity-link">WMSLayer</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/YAxis.html" data-type="entity-link">YAxis</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/YAxisSettings.html" data-type="entity-link">YAxisSettings</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/YRanges.html" data-type="entity-link">YRanges</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});