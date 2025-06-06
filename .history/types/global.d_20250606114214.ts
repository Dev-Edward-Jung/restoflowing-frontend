export {};

declare global {
  interface Window {
    Helpers?: {
      toggleCollapsed: () => void;
    };
  }
}