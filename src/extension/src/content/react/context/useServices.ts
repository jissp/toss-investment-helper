import { Services, useServiceContext } from './ServiceProvider';

/**
 * 모든 서비스에 접근하는 Hook
 * @example const { backend, location } = useServices();
 */
export const useServices = (): Services => useServiceContext();

/**
 * BackendApiService만 접근하는 Hook
 */
export const useBackendApi = () => useServiceContext().backend;

/**
 * DocumentService만 접근하는 Hook
 */
export const useDocumentService = () => useServiceContext().document;

/**
 * LocationService만 접근하는 Hook
 */
export const useLocationService = () => useServiceContext().location;

/**
 * TossWtsApiService만 접근하는 Hook
 */
export const useTossWtsApi = () => useServiceContext().tossWts;
