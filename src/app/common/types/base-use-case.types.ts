export interface BaseUseCase<T = void, R = unknown> {
    execute: (args: T) => R;
}
