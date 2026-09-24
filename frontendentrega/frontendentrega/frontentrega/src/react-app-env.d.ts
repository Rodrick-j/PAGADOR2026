/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference types="react-scripts" />
declare module 'react-dom/client' {
    // typing module default export as `any` will allow you to access its members without compiler warning
    // eslint-disable-next-line no-var
    var createRoot: any;
    export { createRoot };
}
