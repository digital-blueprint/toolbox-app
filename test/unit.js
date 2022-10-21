import {assert} from 'chai';

import {init} from '../src/dbp-overview-app.js';

suite('dbp-overview-app integration', () => {
    let mainSection;
    let searchbox;
    let currentRefinements;
    let clearRefinements;
    let hits;
    let targetAudience;
    // let blueprintList;
    let blueprintMenu;
    let documentTypeList;
    let contentTypeList;
    let languagesList;
    let licenseList;
    let maintainedByList;
    let labsList;
    let stats;
    let pagination;
    let cb;
    let sel;

    suiteSetup(async () => {
        mainSection = document.createElement('div');
        mainSection.id = 'main-section';
        document.body.append(mainSection);
        searchbox = document.createElement('div');
        searchbox.id = 'searchbox';
        document.body.append(searchbox);
        currentRefinements = document.createElement('div');
        currentRefinements.id = 'current-refinements';
        document.body.append(currentRefinements);
        clearRefinements = document.createElement('div');
        clearRefinements.id = 'clear-refinements';
        document.body.append(clearRefinements);
        hits = document.createElement('div');
        hits.id = 'hits';
        document.body.append(hits);
        targetAudience = document.createElement('div');
        targetAudience.id = 'targetaudience-list';
        document.body.append(targetAudience);
        // blueprintList = document.createElement('div');
        // blueprintList.id = 'blueprint-list';
        // document.body.append(blueprintList);
        blueprintMenu = document.createElement('div');
        blueprintMenu.id = 'blueprint-menu';
        document.body.append(blueprintMenu);
        documentTypeList = document.createElement('div');
        documentTypeList.id = 'document-type-list';
        document.body.append(documentTypeList);
        contentTypeList = document.createElement('div');
        contentTypeList.id = 'content-type-list';
        document.body.append(contentTypeList);
        languagesList = document.createElement('div');
        languagesList.id = 'languages-list';
        document.body.append(languagesList);
        licenseList = document.createElement('div');
        licenseList.id = 'license-list';
        document.body.append(licenseList);
        maintainedByList = document.createElement('div');
        maintainedByList.id = 'maintained-by-list';
        document.body.append(maintainedByList);
        labsList = document.createElement('div');
        labsList.id = 'labs-list';
        document.body.append(labsList);
        stats = document.createElement('div');
        stats.id = 'stats';
        document.body.append(stats);
        pagination = document.createElement('div');
        pagination.id = 'pagination';
        document.body.append(pagination);
        cb = document.createElement('input');
        cb.id = 'filter-changed';
        document.body.append(cb);
        sel = document.createElement('select');
        sel.id = 'timespan';
        document.body.append(sel);
    });

    suiteTeardown(() => {
        mainSection.remove();
        searchbox.remove();
        hits.remove();
        targetAudience.remove();
        // blueprintList.remove();
        blueprintMenu.remove();
        documentTypeList.remove();
        contentTypeList.remove();
        languagesList.remove();
        licenseList.remove();
        maintainedByList.remove();
        labsList.remove();
        stats.remove();
        pagination.remove();
        cb.remove();
        sel.remove();
    });

    test('should render', () => {
        let typesenseConfig = {
            host: 'typesense-dev.tugraz.at',
            port: '443',
            protocol: 'https',
            key: 'bRQ0Hrg9SAPGR3CVu5hm5bBTggUhsq0e',
        };

        let ok = init(typesenseConfig, {active: false, range: 86400}, '');
        assert(ok);
    });
});
