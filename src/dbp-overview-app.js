import instantsearch from "instantsearch.js";
import {
    searchBox,
    configure,
    hits,
    refinementList,
    currentRefinements,
    clearRefinements,
    hierarchicalMenu,
    stats,
    pagination,
} from 'instantsearch.js/es/widgets';
import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';

// eslint-disable-next-line no-unused-vars
import MicroModal from './micromodal.es';

import { licenses } from '../assets/licenses/spdx.json';
const spdxLicenses = licenses;

function formatLicense(license) {
    const spdxInfo = spdxLicenses.find(item => item.licenseId === license);
    if (spdxInfo === undefined) {
        console.log('license "' + license + '" not found.');
        return license;
    }
    return `<a href="${spdxInfo.reference}" style="color:black;text-decoration:none;">${spdxInfo.name}</a>`;
}

export function init(typesenseConfig, dateFilter, privatePath) {
    const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
        server: {
            apiKey: typesenseConfig.key, // Be sure to use an API key that only allows searches, in production
            nodes: [
                {
                    host: typesenseConfig.host,
                    port: typesenseConfig.port,
                    protocol: typesenseConfig.protocol,
                },
            ],
        },
        additionalSearchParameters: {
            query_by: "name,description,target_audience,document_type,content_type,maintained_by,used_programming_languages",
        },
    });
    const searchClient = typesenseInstantsearchAdapter.searchClient;

    let search = instantsearch({
        searchClient,
        indexName: 'software-overview',
        // onStateChange({ uiState, setUiState }) {
        //     // Custom logic
        //     console.dir([uiState, setUiState]);
        //
        //     setUiState(uiState);
        // },
    });

    search.addWidgets([
        searchBox({
            container: '#searchbox',
            autofocus: true,
        }),
        configure({
            hitsPerPage: 8,
            numericFilters: ['release_date >= ' + (dateFilter.active ? Math.floor(Date.now()/1000 - dateFilter.range) : 1546300800 /* 2019-01-01 00:00:00 */)]
        }),
        hits({
            container: '#hits',
            sort: ['blueprint'],
            templates: {
                item(item) {
                    const d = new Date(item.release_date*1000);
                    const formattedTime = d.getFullYear() + '-' + ('0' + (d.getMonth()+1)).substr(-2) + '-'  + ('0' + d.getDate()).substr(-2);
                    const daysStillNew = 31;
                    const isNew = ((new Date()).valueOf() - daysStillNew*86400000) < d.valueOf();

                    // slider
                    const MAXITEMSVISIBLE = 3;
                    let slideIndex=0;

                    return `
        <div style="position: relative; height: 100%; width: 100%"
             onclick="MicroModal.show('detail-${item.id}', {disableFocus: true}); window.setupSlider('${item.id}')">
            <div style="display: flex; flex-direction: row;"> 
                <img class="hit-name-img" src=${item.link_icon || `${privatePath}/icons8-missing-32.png`} alt="icon">
                <div style="display: flex; flex-direction: column;">
                    <div class="hit-name">
                        ${item._highlightResult.name.value}
                        ${item.labs.includes('yes') ? `<img class="labs-img" src="${privatePath}/lab_flask.svg" alt="labs">` : ''}
                    </div>
                    <div class="hit-description">${item._highlightResult.description.value}</div>
                </div>
            </div>
            <div class="hit-types">
                <div class="hit-types-subtypes">
                <!--
                    <div class="hit-document-type">
                        <div>Categor${item.document_type.length>1?'ies':'y'}:</div>
                        ${item._highlightResult.document_type.map(
                            a => `<div class="type ${a.value.replace(/\s+/g, '-').toLowerCase()}"
                                       onclick="event.stopPropagation(); document.getElementById('${'document-type-'+a.value}').click();"
                                  >${a.value}</div>`
                        ).join('')}
                    </div>
                -->
                    <div class="hit-content-type">
                        <div>Type${item.content_type.length>1?'s':''}:</div>
                        ${item._highlightResult.content_type.map(
                            a => `<div class="type ${a.value.replace(/\s+/g, '-').toLowerCase()}"
                                       onclick="event.stopPropagation(); document.getElementById('${'content-type-'+a.value}').click();"
                       >${a.value}</div>`).join('')}
                    </div>
                </div>
            </div>
            <div class="links">
              <span class="hit-links">Links:</span>
              ${item.link_repo ? `<span class="hit-repo"><a href=${item.link_repo} rel="noopener noreferrer" target="_blank"><img src="${privatePath}/code.svg" alt="source code" title="source code"></a></span>` : ''}
              ${item.link_doc ? `<span class="hit-doc"><a href=${item.link_doc} rel="noopener noreferrer" target="_blank"><img src="${privatePath}/dbp-icons-documentation" alt="documentation" title="documentation"></a></span>` : ''}
              ${item.link_demo ? `<span class="hit-demo"><a href=${item.link_demo} rel="noopener noreferrer" target="_blank"><img src="${privatePath}/dbp-icons-demo.svg" alt="demo" title="demo"></a></span>` : ''}
              ${item.link_changelog ? `<span class="hit-changelog"><a href=${item.link_changelog} rel="noopener noreferrer" target="_blank"><img src="${privatePath}/changelog.png" alt="changelog" title="changelog"></a></span>` : ''}
              <span class="hit-email"><a href="mailto:${item.contact_email}" rel="noopener noreferrer" target="_blank"><img src="${privatePath}/mail2.svg" alt="email" title="email"></a></span>
          </div>
            <!-- --
            <div class="hit-rating">[${item.sort}]</div>
            -->
            ${ isNew ? `<div class="ribbon ribbon-bottom-right"><span>new</span></div>` : ''}
        </div>
        <div class="modal micromodal-slide" id="detail-${item.id}" aria-hidden="true">
            <div class="modal-overlay" tabindex="-1" data-micromodal-close>
                <div class="modal-container"
                     style="padding: 10px; margin: 10px;"
                     id="edit-sender-modal-box-${item.id}"
                     role="dialog"
                     aria-modal="true"
                     aria-labelledby="edit-sender-modal-title">
                    <header class="modal-header" style="display: flex; flex-direction: row-reverse; justify-content: space-between">
                        <button style="height: 1.2rem;"
                                data-micromodal-close
                                title="close"
                                class="modal-close"
                                aria-label="Close modal"
                                onclick="console.log('x'); MicroModal.close('detail-${item.id}');">
                           <svg style="height: 1.5rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </header>
                    <main class="modal-content">
                        <div style="margin:20px;">
                            <div style="display: flex; flex-direction: row;"> 
                                <img class="hit-name-img" src=${item.link_icon || `${privatePath}/icons8-missing-32.png`} alt="icon">
                                <div style="display: flex; flex-direction: column;">
                                    <div class="hit-name">
                                        ${item._highlightResult.name.value}
                                        ${item.labs.includes('yes') ? `<img class="labs-img" src="${privatePath}/lab_flask.svg" alt="labs">` : ''}
                                    </div>
                                    <div class="hit-description">${item._highlightResult.description.value}</div>
                                </div>
                            </div>
                            <div style="display:flex; flex-direction: row; justify-content: space-evenly;">
                                <div class="modal-column">
                                    <div class="modal-section-title">MAINTAINED BY</div>
                                    <div class="modal-center">${item.maintained_by}</div>
                                </div>
                                <div class="modal-column">
                                    <div class="modal-section-title">VERSION</div>
                                    <div class="modal-center release">${item.release_version || 'N/A'}</div>
                                </div>
                                <div class="modal-column">
                                    <div class="modal-section-title">RELEASE DATE</div>
                                    <div class="modal-center">${item.release_date > 0 ? formattedTime : 'N/A'}</div>
                                </div>
                            </div>
                            <hr class="modal-seperator">
                            <div class="modal-section-title">USED IN</div>
                            <div class="nav-wrapper">
                                <div class="left-paddle paddle paddle-faded" id="left-paddle-${item.id}"">
                                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                                  </svg>
                                </div>
                                <nav class="modal-nav">
                                    ${item._highlightResult.blueprint.map(
                                        a => `<div class="nav-item nav-item-${item.id} ${slideIndex++ < MAXITEMSVISIBLE ? '' : 'hidden'}">
                                            <div class="modal-blueprint modal-fancy"
                                                 onclick="
                                                    let id1 = 'hierarchical-blueprint-item-${a.value.toLowerCase().replaceAll(' ', '-').replaceAll('(', '--').replaceAll(')', '')}';
                                                    if (null === document.getElementById(id1)) {
                                                    document.getElementById('hierarchical-blueprint-item-${a.value.split('(')[0].toLowerCase().trim().replaceAll(' ', '-')}').click();
                                                    setTimeout(
                                                        () => document.getElementById(id1).click(),
                                                        100);
                                                    } else {
                                                        document.getElementById(id1).click();
                                                    }
                                                    this.classList.add('modal-clicked');
                                                    setTimeout(() => this.classList.remove('modal-clicked'), 300);"
                                            >${a.value.replace(')', '').split('(')[1] || 'N/A'}</div>
                                            <div class="modal-blueprint modal-category"
                                                 onclick="
                                                    document.getElementById('hierarchical-blueprint-item-${a.value.split('(')[0].toLowerCase().trim().replaceAll(' ', '-')}').click();
                                                    this.classList.add('modal-clicked');
                                                    setTimeout(() => this.classList.remove('modal-clicked'), 300);"
                                            >${a.value.split('(')[0] || 'N/A'}</div>
                                        </div>`
                                    ).join('')}
                                </nav>
                              <div class="right-paddle paddle" id="right-paddle-${item.id}">
                                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                  </svg>
                              </div>
                            </div>
                            <hr class="modal-seperator">
                            <div class="modal-section-title">ADDITIONAL INFO</div>
                            <div class="hit-license">
                                <div>License:</div>
                                ${item.license.map(l => '<span>' + formatLicense(l) + '</span>').join('')}
                            </div>
                            <div class="hit-types">
                                <div class="hit-types-subtypes">
                                    <div class="hit-document-type">
                                        <div>Categor${item.document_type.length>1?'ies':'y'}:</div>
                                        ${item._highlightResult.document_type.map(a => `<div class="type ${a.value.replace(/\s+/g, '-').toLowerCase()}" onclick="document.getElementById('${'document-type-'+a.value}').click();">${a.value}</div>`).join('')}
                                    </div>
                                    <div class="hit-content-type">
                                        <div>Type${item.content_type.length>1?'s':''}:</div>
                                        ${item._highlightResult.content_type.map(a => `<div class="type ${a.value.replace(/\s+/g, '-').toLowerCase()}" onclick="document.getElementById('${'content-type-'+a.value}').click();">${a.value}</div>`).join('')}
                                    </div>
                                </div>
                            </div>
                            <div class="hit-used-programming-languages">
                                <div>Used programming languages:</div>
                                ${item._highlightResult.used_programming_languages.map(a => `<div class="type ${a.value.replace(/\s+/g, '-').toLowerCase()}" onclick="document.getElementById('${'prog-lang-'+a.value}').click();">${a.value}</div>`).join('')}
                            </div>
                            <hr class="modal-seperator">
                            <div class="modal-section-title">LINKS</div>
                            <div style="display:flex; flex-direction: row;">
                                ${item.link_repo ? `<div class="modal-link"><a href="${item.link_repo}" rel="noopener noreferrer" target="_blank"><div class="modal-column"><img src="${privatePath}/code.svg" alt="repository" class="modal-center"><div>source code</div></div></a></div>` : ''}
                                ${item.link_doc ? `<div class="modal-link"><a href="${item.link_doc}" rel="noopener noreferrer" target="_blank"><div class="modal-column"><img src="${privatePath}/dbp-icons-documentation.svg" alt="documentation" class="modal-center"><div>documentation</div></div></a></div>` : ''}
                                ${item.link_demo ? `<div class="modal-link"><a href="${item.link_demo}" rel="noopener noreferrer" target="_blank"><div class="modal-column"><img src="${privatePath}/dbp-icons-demo.svg" alt="demo" class="modal-center"><div>live demo</div></div></a></div>` : ''}
                                ${item.link_changelog ? `<div class="modal-link"><a href="${item.link_changelog}" rel="noopener noreferrer" target="_blank"><div class="modal-column"><img src="${privatePath}/changelog.png" alt="changelog" class="modal-center"><div>changelog</div></div></a></div>` : ''}
                                <div class="modal-link"><a href="mailto:${item.contact_email}" rel="noopener noreferrer" target="_blank"><div class="modal-column"><img src="${privatePath}/mail2.svg" alt="email" class="modal-center"><div>email</div></div></a></div>
                            <div>
                            ${ isNew ? `<div class="ribbon ribbon-bottom-right"><span>new</span></div>` : ''}
                        </div>
                    </main>
                </div>
            </div>
        </div>
      `;
                },
            },
        }),
        configure({
            facets: ['document_type', 'content_type', 'used_programming_languages', 'license'],
            maxValuesPerFacet: 20,
        }),
        refinementList({
            container: '#targetaudience-list',
            attribute: 'target_audience',
            transformItems(items) {
                return items.map(item => ({
                    ...item,
                    highlighted: item.highlighted.charAt(0).toUpperCase() + item.highlighted.slice(1),
                }));
            },
            templates: {
                item(item) {
                    return `
                        <div>
                            <label class="ais-RefinementList-label">
                                <input type="checkbox" class="ais-RefinementList-checkbox" value="${item.value}" ${item.isRefined ? 'checked' : ''}>
                                <span class="ais-RefinementList-labelText">${item.highlighted}</span>
                                <span class="ais-RefinementList-count">(${item.count})</span>
                            </label>
                        </div>`;
                }
            },
        }),
        // refinementList({
        //     container: '#blueprint-list',
        //     attribute: 'blueprint',
        //     cssClasses: { list: ['flex']},
        //     templates: {
        //         item(item) {
        //             const nameParts = item.highlighted.split('(');
        //             //const nameStart = nameParts.shift();
        //             const fancyName = nameParts.shift().replace(')', '');
        //             const isDBP = item.highlighted.toLowerCase().includes('dbp');
        //
        //             return `
        //                 <div style="margin: 5px; padding: 5px; border-radius: 5px; background-color: ${ item.isRefined ? 'red' : (isDBP ? 'blue' : '#335588')}; color: white;">
        //                     <label class="ais-RefinementList-label" title="${fancyName}">
        //                         <input type="checkbox" class="ais-RefinementList-checkbox"
        //                                value="${item.value}" ${ item.isRefined ? 'checked' : '' } id="blueprint-${item.value}"
        //                                style="display:none;">
        //                         <span class="ais-RefinementList-labelText">${item.highlighted}</span>
        //                     </label>
        //                 </div>`;
        //         }
        //     },
        //     operator: 'and',
        // }),
        hierarchicalMenu({
            container: '#blueprint-menu',
            attributes: [
                'hierarchicalBlueprints.lvl0',
                'hierarchicalBlueprints.lvl1',
            ],
            templates: {
                item(item) {
                    return `
                      <a class="hierarchical-blueprints-item"
                         href="${item.url}"
                         id="hierarchical-blueprint-item-${item.value.toLowerCase().replaceAll(' ', '-').replaceAll('>', '-')}" 
                         style="color: ${item.isRefined ? 'red' : 'black'};">
                        <span class="ais-RefinementList-labelText">${item.label}</span>
                        <span class="ais-RefinementList-count">(${item.count})</span>
                      </a>
                    `;
                }
            },
            showParentLevel: false,
        }),
        currentRefinements({
            container: '#current-refinements',
            includedAttributes: [
                'target_audience',
                'document_type',
                'content_type',
                'maintained_by',
                'license',
                'used_programming_languages',
                'blueprint',
                'hierarchicalBlueprints.lvl0',
                'hierarchicalBlueprints.lvl1'
            ],
            cssClasses: { list: ['flex']},
            transformItems: function (items) {
                return items.map(item => {
                    item.refinements = item.refinements.map(i => {
                        const nameParts = i.value.split('(');
                        i.label = nameParts.shift();

                        return i;
                    });
                    return item;
                });
            },
        }),
        clearRefinements({
            container: '#clear-refinements',
            templates: {
                resetLabel(obj) {
                    console.dir(obj);
                    //const hasRefinements = true;
                    return obj.hasRefinements ? '<span><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg> Clear filters</span> ' : '';
                },
            }
        }),
        refinementList({
            container: '#document-type-list',
            attribute: 'document_type',
            templates: {
                item(item) {
                    return `
                        <div>
                            <label class="ais-RefinementList-label">
                                <input type="checkbox" class="ais-RefinementList-checkbox" value="${item.value}" ${item.isRefined ? 'checked' : ''} id="document-type-${item.value}">
                                <span class="ais-RefinementList-labelText">${item.highlighted}</span>
                                <span class="ais-RefinementList-count">(${item.count})</span>
                            </label>
                        </div>`;
                }
            },
        }),
        refinementList({
            container: '#content-type-list',
            attribute: 'content_type',
            templates: {
                item(item) {
                    return `
                        <div>
                            <label class="ais-RefinementList-label">
                                <input type="checkbox" class="ais-RefinementList-checkbox" value="${item.value}" ${item.isRefined ? 'checked' : ''} id="content-type-${item.value}">
                                <span class="ais-RefinementList-labelText">${item.highlighted}</span>
                                <span class="ais-RefinementList-count">(${item.count})</span>
                            </label>
                        </div>`;
                }
            },
        }),
        refinementList({
            container: '#languages-list',
            attribute: 'used_programming_languages',
            templates: {
                item(item) {
                    return `
                        <div>
                            <label class="ais-RefinementList-label">
                                <input type="checkbox" class="ais-RefinementList-checkbox" value="${item.value}" ${item.isRefined ? 'checked' : ''} id="prog-lang-${item.value}">
                                <span class="ais-RefinementList-labelText">${item.highlighted}</span>
                                <span class="ais-RefinementList-count">(${item.count})</span>
                            </label>
                        </div>`;
                }
            },
        }),
        refinementList({
            container: '#license-list',
            attribute: 'license',
            transformItems(items) {
                return items.map(item => ({
                    ...item,
                    highlighted: item.highlighted.replaceAll('-', ' '),
                }));
            },
            templates: {
                item(item) {
                    return `
                        <div>
                            <label class="ais-RefinementList-label">
                                <input type="checkbox" class="ais-RefinementList-checkbox" value="${item.value}" ${item.isRefined ? 'checked' : ''}>
                                <span class="ais-RefinementList-labelText">${item.highlighted}</span>
                                <span class="ais-RefinementList-count">(${item.count})</span>
                            </label>
                        </div>`;
                }
            },
        }),
        refinementList({
            container: '#maintained-by-list',
            attribute: 'maintained_by',
            templates: {
                item(item) {
                    const byUs = item.highlighted.toLowerCase().includes('tu graz');
                    return `
                        <div style="display:flex; justify-content: space-between; width:100%;">
                            <label class="ais-RefinementList-label">
                                <input type="checkbox" class="ais-RefinementList-checkbox" value="${item.value}" ${item.isRefined ? 'checked' : ''}>
                                <span class="ais-RefinementList-labelText">${item.highlighted}</span>
                                <span class="ais-RefinementList-count">(${item.count})</span>
                            </label>
                            <!--
                            <div style="margin:2px;padding-left: 10px;padding-right:10px;background-color: ${byUs ? 'blue' : '#335588'}">&nbsp;</div>
                            -->
                        </div>`;
                }
            },
        }),
        refinementList({
            container: '#labs-list',
            attribute: 'labs',
            templates: {
                item(item) {
                    return `
                        <div>
                            <label class="ais-RefinementList-label">
                                <input type="checkbox" class="ais-RefinementList-checkbox" value="${item.value}" ${item.isRefined ? 'checked' : ''}>
                                <span class="ais-RefinementList-labelText">${item.highlighted}</span>
                                <span class="ais-RefinementList-count">(${item.count})</span>
                            </label>
                        </div>`;
                }
            },
        }),
        stats({
            container: "#stats",
            templates: {
                body(hit) {
                    return `${hit.nbHits} results found in ${hit.processingTimeMS}ms`;
                }
            }
        }),
        pagination({
            container: '#pagination',
        }),
    ]);

    search.start();

    return true;
}
