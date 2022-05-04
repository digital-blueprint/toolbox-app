import {assert} from 'chai';

import {init} from '../src/dbp-overview-app.js';

suite('dbp-overview-app integration', () => {
    let searchbox;
    let hits;
    let blueprintList;
    let documentTypeList;
    let contentTypeList;
    let languagesList;
    let licenseList;
    let maintainedByList;
    let stats;
    let pagination;

    suiteSetup(async () => {
        searchbox = document.createElement('div');
        searchbox.id = 'searchbox';
        document.body.append(searchbox);
        hits = document.createElement('div');
        hits.id = 'hits';
        document.body.append(hits);
        blueprintList = document.createElement('div');
        blueprintList.id = 'blueprint-list';
        document.body.append(blueprintList);
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
        stats = document.createElement('div');
        stats.id = 'stats';
        document.body.append(stats);
        pagination = document.createElement('div');
        pagination.id = 'pagination';
        document.body.append(pagination);
    });

    suiteTeardown(() => {
        searchbox.remove();
        hits.remove();
        blueprintList.remove();
        documentTypeList.remove();
        contentTypeList.remove();
        languagesList.remove();
        licenseList.remove();
        maintainedByList.remove();
        stats.remove();
        pagination.remove();
    });

    test('should render', () => {
        let typesenseConfig = {
            host: 'localhost',
            port: '8108',
            protocol: 'http',
            key: 'xyz'
        };

        let ok = init(typesenseConfig);
        assert(ok);
    });
});
