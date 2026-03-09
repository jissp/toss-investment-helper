import {
    BackendApiService,
    DocumentService,
    LocationService,
    TemplateService,
    TossWtsApiService,
} from '@extension/src/content/services';

export const context = {
    tossWtsApiClient: new TossWtsApiService(),
    documentService: new DocumentService(),
    locationService: new LocationService(),
    backendApi: new BackendApiService(),
    templateService: new TemplateService(),
};
