import React, { createContext, ReactNode, useContext } from 'react';
import {
    BackendApiService,
    DocumentService,
    LocationService,
    TossWtsApiService,
} from '../../services';

export interface Services {
    backend: BackendApiService;
    document: DocumentService;
    location: LocationService;
    tossWts: TossWtsApiService;
}

const ServiceContext = createContext<Services | null>(null);

export const ServiceProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const services: Services = {
        backend: BackendApiService.getInstance(),
        document: DocumentService.getInstance(),
        location: LocationService.getInstance(),
        tossWts: TossWtsApiService.getInstance(),
    };

    return (
        <ServiceContext.Provider value={services}>
            {children}
        </ServiceContext.Provider>
    );
};

export const useServiceContext = () => {
    const context = useContext(ServiceContext);
    if (!context) {
        throw new Error(
            'useServiceContext must be used within ServiceProvider. ' +
                'Wrap your component tree with <ServiceProvider>.',
        );
    }
    return context;
};
