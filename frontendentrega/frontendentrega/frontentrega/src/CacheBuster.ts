import compareVersions from 'compare-versions';
import packageJson from '../package.json';

export type VersionInfo = {
    version: string;
    date: string;
    latestVersion: string;
    buildVersion: string;
    isLatestVersion: boolean;
};

export class CacheBuster {
    static async getVersionInfo(): Promise<VersionInfo> {
        const versionInfo = {
            version: '0.0.0',
            date: new Date('2000-01-01').toISOString(),
            isLatestVersion: true,
            latestVersion: '0.0.0',
            buildVersion: '0.0.0'
        };
        await fetch(`/meta.json?t=${Date.now()}`, { cache: 'no-store' })
            .then((response) => response.json())
            .then((meta: VersionInfo) => {
                const latestVersion = meta.version;
                const buildVersion = packageJson.version;
                versionInfo.latestVersion = latestVersion;
                versionInfo.buildVersion = buildVersion;
                versionInfo.version = meta.version;
                versionInfo.date = new Date(meta.date).toISOString();
                versionInfo.isLatestVersion = !compareVersions.compare(latestVersion, buildVersion, '>');
            })
            .catch(() => ({}));
        return versionInfo;
    }

    static async isLatestVersion(): Promise<boolean> {
        return (await CacheBuster.getVersionInfo()).isLatestVersion;
    }

    static async updateToLastVersion(force = false): Promise<boolean> {
        const isLatestVersion = (await CacheBuster.getVersionInfo()).isLatestVersion;
        if (isLatestVersion && !force) {
            return false;
        }

        // Remueve los serviceworkers registrados
        const serviceWorkersToRemove: Promise<boolean>[] = [];
        await navigator.serviceWorker.getRegistrations().then((registrations) => {
            for (let registration of registrations) {
                serviceWorkersToRemove.push(registration.unregister());
            }
        });
        for (let i in serviceWorkersToRemove) {
            await serviceWorkersToRemove[i].catch(() => ({}));
        }

        // Elimina la cache
        const cachesToRemove: Promise<boolean>[] = [];
        await caches.keys().then((keys) => {
            for (let key of keys) {
                cachesToRemove.push(caches.delete(key));
            }
        });
        for (let i in cachesToRemove) {
            await cachesToRemove[i].catch(() => ({}));
        }

        // Refresca la ventana
        window.location.replace(window.location.pathname + window.location.search);
        return true;
    }
}
