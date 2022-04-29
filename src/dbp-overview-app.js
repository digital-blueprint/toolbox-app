import instantsearch from "instantsearch.js";
import { searchBox, configure, hits, refinementList, stats, pagination } from 'instantsearch.js/es/widgets';

import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';

const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
    server: {
        apiKey: 'xyz', // Be sure to use an API key that only allows searches, in production
        nodes: [
            {
                host: 'localhost',
                port: '8108',
                protocol: 'http',
            },
        ],
    },
    // The following parameters are directly passed to Typesense's search API endpoint.
    //  So you can pass any parameters supported by the search endpoint below.
    //  queryBy is required.
    //  filterBy is managed and overridden by InstantSearch.js. To set it, you want to use one of the filter widgets like refinementList or use the `configure` widget.
    additionalSearchParameters: {
        queryBy: "name,description,document_type,content_type,maintained_by,used_programming_languages"
    },
});
const searchClient = typesenseInstantsearchAdapter.searchClient;

const search = instantsearch({
    searchClient,
    indexName: 'software-overview',
});

search.addWidgets([
    searchBox({
        container: '#searchbox',
    }),
    configure({
        hitsPerPage: 8,
    }),
    hits({
        container: '#hits',
        templates: {
            item(item) {
                return `
        <div>
          <div class="hit-name">
            <img src=${item.link_icon || '/img/icons8-missing-32.png'} alt="link">
            ${item._highlightResult.name.value}
          </div>
          <div class="">${item._highlightResult.description.value}</div>
          <div class="hit-document-type">
            <div>type of project:</div>
            ${item._highlightResult.document_type.map(a => `<div class="type ${a.value.replace(/\s+/g, '-').toLowerCase()}">${a.value}</div>`).join('')}
          </div>
          <div class="hit-content-type">
            <div>subtype of project:</div>
            ${item._highlightResult.content_type.map(a => `<div class="type ${a.value.replace(/\s+/g, '-').toLowerCase()}">${a.value}</div>`).join('')}
          </div>
          <div class="hit-used-programming-languages">
            <div>used programming languages:</div>
            ${item._highlightResult.used_programming_languages.map(a => `<div class="type ${a.value.replace(/\s+/g, '-').toLowerCase()}">${a.value}</div>`).join('')}
          </div>
          <div class="hit-license">License: ${item.license}</div>
          <div class="links">
          <span class="hit-repo">${item.link_repo ? `<a href=${item.link_repo}><img src="/img/Git-Icon-Black.png" alt="repository"></a>` : ''}</span>
          <span class="hit-doc">${item.link_doc ? `<a href=${item.link_doc}><img src="/img/icons8-book-60.png" alt="documentation"></a>` : ''}</span>
          <span class="hit-demo">${item.link_demo ? `<a href=${item.link_demo}><img src="/img/icons8-trial-50.png" alt="demo"></a>` : ''}</span>
          </div>
          <div class="hit-rating">score: ${item.score}</div>
        </div>
      `;
            },
        },
    }),
    configure({
        facets: ['type', 'used_prog_langs'],
        maxValuesPerFacet: 20,
    }),
    refinementList({
        container: '#blueprint-list',
        attribute: 'blueprint',
    }),
    refinementList({
        container: '#document-type-list',
        attribute: 'document_type',
    }),
    refinementList({
        container: '#content-type-list',
        attribute: 'content_type',
    }),
    refinementList({
        container: '#languages-list',
        attribute: 'used_programming_languages',
    }),
    refinementList({
        container: '#license-list',
        attribute: 'license',
    }),
    stats({
        container: "#stats",
        templates: {
            body(hit) {
                return `⚡ ${hit.nbHits} results found in ${hit.processingTimeMS}ms`;
            }
        }
    }),
    pagination({
        container: '#pagination',
    }),
]);

search.start();
