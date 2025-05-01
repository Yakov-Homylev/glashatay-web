export function debounce<T extends (...args: any[]) => any>(
    func: T,
    ms: number,
): (...args: Parameters<T>) => ReturnType<T> | void {
    let timeout: ReturnType<typeof setTimeout> | undefined;

    return function (this: ThisParameterType<T>, ...args: Parameters<T>): ReturnType<T> | void {
        clearTimeout(timeout);

        timeout = setTimeout(() => {
            func.apply(this, args);
        }, ms);
    };
}
