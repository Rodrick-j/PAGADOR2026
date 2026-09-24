// https://gist.github.com/augustolazaro/a7c6fdbf4ec021ecc237aa36ad47202d
// https://usehooks.com/useLocalStorage/

import { useIsMounted } from 'hooks/useIsMounted';
import React from 'react';

const originalSetItem = localStorage.setItem;
localStorage.setItem = function () {
    const event = new Event('storageChange');
    document.dispatchEvent(event);
    originalSetItem.apply(this, arguments as any);
};
const originalRemoveItem = localStorage.removeItem;
localStorage.removeItem = function () {
    const event = new Event('storageChange');
    document.dispatchEvent(event);
    originalRemoveItem.apply(this, arguments as any);
};

// SUPPORT   string or object values only
function useLocalStorage<T>(key: string, defaultValue: T): [T, (value: T) => void] {
    const isObject = typeof defaultValue === 'object';
    const isMounted = useIsMounted();

    const getParseValue = (value: string | null) => {
        let parsedValue: T = (value || defaultValue) as T;
        try {
            parsedValue = value && isObject && value !== null && (value.startsWith('{') || value.startsWith('[')) ? JSON.parse(value) : parsedValue;
        } catch (err) {}
        return parsedValue;
    };

    const storageItem = localStorage.getItem(key);
    const [storedValue, setValue] = React.useState<T>(getParseValue(storageItem));

    const setLocalItem = () => {
        /** local storage update is not that fast */
        /** it makes sure that we are getting the new value  */
        setTimeout(() => {
            const itemValueFromStorage = localStorage.getItem(key);
            const value = getParseValue(itemValueFromStorage);
            if (isMounted()) setValue(value);
        }, 50);
    };
    const setLocalItemCallback = React.useCallback(setLocalItem, []);

    const setStoredValue = (value: T | null) => {
        if (value === null) return localStorage.removeItem(key);
        const parsedValue = isObject ? JSON.stringify(value) : String(value);
        return localStorage.setItem(key, parsedValue);
    };

    React.useEffect(() => {
        document.addEventListener('storageChange', setLocalItemCallback, false);
        return () => document.removeEventListener('storageChange', setLocalItemCallback);
    }, [setLocalItemCallback]);

    return [storedValue, setStoredValue];
}

export default useLocalStorage;
