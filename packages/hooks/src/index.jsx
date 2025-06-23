export * from '#renderer';
export * from '#model';
export * from '#forms';
export * from '#constants';
export * from '#helpers';

export function useGenerator(generator) {
    if (typeof generator === 'function') {
        // The generator is a hook; use it
        return generator();
    } else {
        return generator;
    }
}
