import { Nullable } from '@common/types';
import { createRoot, type Root } from 'react-dom/client';
import type React from 'react';
import { DocumentService, LocationService } from '../services';
import { DomObserver, RouterObserver } from '../observers';

export abstract class BaseUseCaseAbstract {
    protected readonly routerObserver = RouterObserver.getInstance();
    protected readonly domObserver = DomObserver.getInstance();
    protected readonly documentService: DocumentService =
        DocumentService.getInstance();
    protected readonly locationService: LocationService =
        LocationService.getInstance();

    protected reactRoot: Root | null = null;
    private unsubscribeUrl?: () => void;

    protected abstract readonly containerElementId: string;
    protected abstract isTargetPage(url: string): boolean;
    protected abstract install(): void;

    protected mountReact(container: HTMLElement, component: React.ReactNode) {
        this.unmountReact();
        this.reactRoot = createRoot(container);
        this.reactRoot.render(component);
    }

    protected unmountReact() {
        this.reactRoot?.unmount();
        this.reactRoot = null;
    }

    /**
     * Overlay 컨테이너를 생성하고 React 컴포넌트를 마운트합니다.
     * 이 메서드는 DOM 생성과 React 마운트를 원자적으로 처리합니다.
     *
     * @param targetElement - 기준이 될 토스 요소
     * @param elementId - 생성할 컨테이너의 ID
     * @param component - 마운트할 React 컴포넌트
     * @param zIndex - z-index 값 (기본값: 1000)
     */
    protected mountReactOverlay(
        targetElement: HTMLElement,
        elementId: string,
        component: React.ReactNode,
        zIndex: number = 1000,
    ) {
        const container = this.createOverlayContainer(
            targetElement,
            elementId,
            zIndex,
        );

        this.mountReact(container, component);
    }

    /**
     * React 컴포넌트를 언마운트하고 컨테이너 DOM을 제거합니다.
     * 이 메서드는 React 언마운트와 DOM 제거를 원자적으로 처리합니다.
     *
     */
    protected uninstall() {
        this.unmountReact();
        this.documentService.removeElement(this.containerElementId);
        this.domObserver.removeWatchId(this.containerElementId);
    }

    /**
     * Overlay 패턴으로 컨테이너를 생성합니다.
     * 기존 요소의 부모에 형제로 추가되어 위에 겹쳐 표시됩니다.
     *
     * @param targetElement - 기준이 될 토스 요소
     * @param elementId - 생성할 컨테이너의 ID
     * @param zIndex - z-index 값 (기본값: 1000)
     * @returns 생성된 overlay 컨테이너 또는 기존 컨테이너
     */
    protected createOverlayContainer(
        targetElement: HTMLElement,
        elementId: string,
        zIndex: number = 1000,
    ): HTMLDivElement {
        // 기존 컨테이너가 있으면 재사용
        const existingContainer = document.getElementById(
            elementId,
        ) as Nullable<HTMLDivElement>;
        if (existingContainer) {
            return existingContainer;
        }

        // 새로운 overlay 컨테이너 생성
        const container = document.createElement('div');
        container.id = elementId;
        container.style.position = 'absolute';
        container.style.top = '0';
        container.style.left = '0';
        container.style.right = '0';
        container.style.zIndex = String(zIndex);
        container.style.height = '100%';

        // 부모에 position: relative 설정 (overlay의 기준점)
        targetElement.style.position = 'relative';

        targetElement.prepend(container);

        return container;
    }

    public start() {
        this.handleUrlChange(location.href);
        this.unsubscribeUrl = this.routerObserver.onUrlChange((url) =>
            this.handleUrlChange(url),
        );
    }

    stop() {
        this.unsubscribeUrl?.();
    }

    private handleUrlChange(url: string) {
        const isTarget = this.isTargetPage(url);
        if (!isTarget) {
            this.uninstall();
            return;
        }

        this.install();
    }
}
