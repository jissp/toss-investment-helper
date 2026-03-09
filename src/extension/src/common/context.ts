import {
    BackendApiService,
    DocumentService,
    LocationService,
    TossWtsApiService,
} from '@extension/src/content/services';
import { ComponentFactory } from '@extension/src/content/components';

export const context = {
    tossWtsApiClient: new TossWtsApiService(),
    documentService: new DocumentService(),
    locationService: new LocationService(),
    backendApi: new BackendApiService(),
    componentFactory: new ComponentFactory(),
};
