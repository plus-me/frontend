/* eslint-disable */

interface CordovaPlugins {
    firebase: {
      messaging: {
        onMessage: (callback: (payload: unknown) => void) => void;
        onBackgroundMessage: (callback: (payload: unknown) => void) => void;
        requestPermission: (options?: { forceShow: boolean }) => Promise<void>;
        getToken: (type?: 'apns-buffer' | 'apns-string') => Promise<string>
        clearNotifications: (callback: () => void) => void;
        onTokenRefresh: (callback: () => void) => void;
        subscribe: (topic: string) => void;
        unsubscribe: (topic: string) => void;
        getBadge: () => Promise<number>;
        setBadge: (value: number) => void;
      }
    }
}
