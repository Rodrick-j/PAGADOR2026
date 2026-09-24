import { CacheBuster } from 'CacheBuster';

type VersionAlertInfo = {
    isLatestVersion: boolean;
    latestVersion?: string;
    buildVersion?: string;
};

export const isLatestVersion = async (): Promise<boolean> => {
    return CacheBuster.isLatestVersion();
};

export const setLatestVersionToStorage = async (): Promise<void> => {
    const versionInfo = await CacheBuster.getVersionInfo();

    localStorage.setItem(
        'version_alert',
        JSON.stringify({
            isLatestVersion: versionInfo.isLatestVersion,
            latestVersion: versionInfo.latestVersion,
            buildVersion: versionInfo.buildVersion,
        }),
    );
};

export const getVersionInfoFromStorage = (): VersionAlertInfo => {
    const item: string | null = localStorage.getItem('version_alert');

    return item
        ? JSON.parse(item) as VersionAlertInfo
        : { isLatestVersion: true };
};
