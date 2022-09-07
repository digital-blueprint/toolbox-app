import instantsearch from "instantsearch.js";
import {
    searchBox,
    configure,
    hits,
    refinementList, /*currentRefinements,*/
    hierarchicalMenu,
    stats,
    pagination,
} from 'instantsearch.js/es/widgets';
import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';

import { licenses } from '../assets/licenses/spdx.json';
const spdxLicenses = licenses;

function formatLicense(license) {
    const spdxInfo = spdxLicenses.find(item => item.licenseId === license);
    if (spdxInfo === undefined) {
        console.log('license "' + license + '" not found.');
        return license;
    }
    return `<a href="${spdxInfo.reference}">${spdxInfo.name}</a>`;
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
            templates: {
                item(item) {
                    const d = new Date(item.release_date*1000);
                    const formattedTime = d.getFullYear() + '-' + ('0' + (d.getMonth()+1)).substr(-2) + '-'  + ('0' + d.getDate()).substr(-2);
                    const daysStillNew = 31;
                    const isNew = ((new Date()).valueOf() - daysStillNew*86400000) < d.valueOf();
                    const blueprints = search.renderState['software-overview'].refinementList.blueprint.items;

                    let refinedBlueprints = [];
                    let nonRefinedBlueprints = [];
                    item._highlightResult.blueprint.forEach(i => {
                        let found = false;
                        blueprints.forEach(j => {
                            if (i.value === j.value && j.isRefined && !found) {
                                found = true;
                                refinedBlueprints.push(i);
                                // console.log([i.value, j.value, j.isRefined]);
                            }
                        });
                        if (!found) {
                            nonRefinedBlueprints.push(i);
                            //console.log([i.value]);
                        }
                    });

                    console.log('blueprints for ' + item.name);
                    // console.dir(item.blueprint);
                    // console.dir([refinedBlueprints, nonRefinedBlueprints]);
                    // console.dir(item);

                    return `
        <div style="position: relative; height: 100%; width: 100%">
          <div class="hit-name">
            <img class="hit-name-img" src=${item.link_icon || `${privatePath}/icons8-missing-32.png`} alt="link">
            ${item._highlightResult.name.value}
            ${item.labs.includes('yes') ? `<img class="labs-img" src="${privatePath}/lab_flask.svg" alt="labs">` : ''}
          </div>
          <div class="">${item._highlightResult.description.value}</div>
          <div class="hit-content-type">
            <div>Used in this blueprints:</div>
            ${refinedBlueprints.length > 0 ? refinedBlueprints.map(a => `<div class="type ${a.value.replace(/\s+/g, '-').toLowerCase()}" onclick="document.getElementById('${'blueprint-'+a.value}').click();" title="${a.value.split('(').shift()}">${a.value /*.match(/\(([^)]+)\)/)[1]*/}</div>`).join('') : ''}
            ${refinedBlueprints.length > 0 && nonRefinedBlueprints.length > 0 ? `<div>and also in:</div>` : ''}
            ${nonRefinedBlueprints.length > 0 ? nonRefinedBlueprints.map(a => `<div class="type ${a.value.replace(/\s+/g, '-').toLowerCase()}" onclick="document.getElementById('${'blueprint-'+a.value}').click();" title="${a.value.split('(').shift()}">${a.value /*.match(/\(([^)]+)\)/)[1]*/}</div>`).join('') : ''}
          </div>
          <div class="hit-types">
            <div class="hit-types-subtypes">
              <div class="hit-document-type">
                <div>Type of project:</div>
                ${item._highlightResult.document_type.map(a => `<div class="type ${a.value.replace(/\s+/g, '-').toLowerCase()}" onclick="document.getElementById('${'document-type-'+a.value}').click();">${a.value}</div>`).join('')}
              </div>
              <div class="hit-content-type">
                <div>Subtype of project:</div>
                ${item._highlightResult.content_type.map(a => `<div class="type ${a.value.replace(/\s+/g, '-').toLowerCase()}" onclick="document.getElementById('${'content-type-'+a.value}').click();">${a.value}</div>`).join('')}
              </div>
          </div>
          <div class="hit-used-programming-languages">
            <div>Used programming languages:</div>
            ${item._highlightResult.used_programming_languages.map(a => `<div class="type ${a.value.replace(/\s+/g, '-').toLowerCase()}" onclick="document.getElementById('${'prog-lang-'+a.value}').click();">${a.value}</div>`).join('')}
          </div>
          <div class="hit-license">License: ${item.license.map(l => '<span>' + formatLicense(l) + '</span>').join('')}</div>
          ${item.release_date > 0 ? `<div class="hit-release">Release date: ${formattedTime}</div>` : ''}
          ${item.release_version ? `<div class="hit-release">Version <span class="release">${item.release_version}</span></div>` : ''}
          <div class="links">
              ${ item.link_repo || item.link_doc || item.link_demo || item.link_changelog ? `<span class="hit-links">Links:</span>` : ''}
              <span class="hit-repo">${item.link_repo ? `<a href=${item.link_repo} rel="noopener noreferrer" target="_blank"><img src="${privatePath}/Git-Icon-Black.png" alt="repository" title="repository"></a>` : ''}</span>
              <span class="hit-doc">${item.link_doc ? `<a href=${item.link_doc} rel="noopener noreferrer" target="_blank"><img src="${privatePath}/icons8-book-60.png" alt="documentation" title="documentation"></a>` : ''}</span>
              <span class="hit-demo">${item.link_demo ? `<a href=${item.link_demo} rel="noopener noreferrer" target="_blank"><img src="${privatePath}/open-select-hand-gesture.svg" alt="demo" title="demo"></a>` : ''}</span>
              <span class="hit-changelog">${item.link_changelog ? `<a href=${item.link_changelog} rel="noopener noreferrer" target="_blank"><img src="${privatePath}/changelog.png" alt="changelog" title="changelog"></a>` : ''}</span>
          </div>
            <!--
            <div class="hit-rating">[${item.sort}]</div>
            -->
          ${ isNew ? `<div class="ribbon ribbon-bottom-right"><span>new</span></div>` : ''}
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
        refinementList({
            container: '#blueprint-list',
            attribute: 'blueprint',
            cssClasses: { list: ['flex']},
            templates: {
                item(item) {
                    const nameParts = item.highlighted.split('(');
                    //const nameStart = nameParts.shift();
                    const fancyName = nameParts.shift().replace(')', '');

                    return `
                        <div style="margin: 5px; padding: 5px; border-radius: 5px; background-color: ${ item.isRefined ? 'red' : 'blue'}; color: white;">
                            <label class="ais-RefinementList-label" title="${fancyName}">
                                <input type="checkbox" class="ais-RefinementList-checkbox"
                                       value="${item.value}" ${ item.isRefined ? 'checked' : '' } id="blueprint-${item.value}"
                                       style="display:none;">
                                <span class="ais-RefinementList-labelText">${item.highlighted}</span>
                            </label>
                        </div>`;
                }
            },
            operator: 'and',
        }),
        hierarchicalMenu({
            container: '#blueprint-menu',
            attributes: [
                'hierarchicalBlueprints.lvl0',
                'hierarchicalBlueprints.lvl1',
            ],
        }),
        // currentRefinements({
        //     container: '#current-blueprints',
        //     includedAttributes: ['blueprint'],
        //     cssClasses: { list: ['flex']},
        //     transformItems: function (items) {
        //         return items.map(item => {
        //             item.refinements = item.refinements.map(i => {
        //                 const nameParts = i.value.split('(');
        //                 i.label = nameParts.shift();
        //
        //                 return i;
        //             });
        //             return item;
        //         });
        //     },
        // }),
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
