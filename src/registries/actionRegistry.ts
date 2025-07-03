/**
 * ACTION REGISTRY
 *  Maps action identifiers from config.json to real functions.
 *
 *  Example nav item in config.json:
 *    {
 *      "slug": "force-reload",
 *      "label": "Force Reload",
 *      "kind": "action",
 *      "action": "forceReload",
 *      "params": { "clearCache": true }
 *    }
 */

export type ActionHandler = (params?: any, node?: any) => void | Promise<void>;

export const actionRegistry: Record<string, ActionHandler> = {
  /**
   * Simple page reload – useful for debugging / dev portals
   */
  forceReload: () => {
    window.location.reload();
  },

  /**
   * Example logout action – relies on AuthContext or service existing.
   * Replace with your real auth service implementation.
   */
  logout: async () => {
    try {
      const { accessManager } = await import("../features/auth/services/access-manager");
      accessManager.reset();
    } catch {
      /* no-op */
    }
    window.location.href = "/login";
  },

  showAlert: (params?: any) => {
    alert(params?.message || "Hello from actionRegistry!");
  },
}; 