export {};

declare global {
  interface Window {
    Menu?: new (element: Element | null, options?: any) => any;
    Helpers?: {
      toggleCollapsed: () => void;
    };
  }
}