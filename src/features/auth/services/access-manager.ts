import { RetailerLevel, Permission, LEVEL_AUTHORITIES } from "../models/access-model";

export interface AccessManager {
  /* ─── existing ─── */
  setLevels(levels: RetailerLevel[]): void;
  getLevels(): RetailerLevel[];
  reset(): void;

  setPermissions(perms: Permission[]): void;
  getPermissions(): Permission[];
  has(perm: Permission): boolean;

  /* ─── NEW ─── */
  /** True once a real (online or offline) login has succeeded */
  isLoggedIn(): boolean;
  /** Explicitly flag the user as logged-in / logged-out */
  setLoggedIn(state: boolean): void;

  /** True for *mock* ("offline") logins only */
  isOfflineLoggedIn(): boolean;
  /** Manually control the offline flag (does *not* affect levels) */
  setOfflineLoggedIn(state: boolean): void;
}

/** Factory — call once and re-use the instance */
export const createAccessManager = (
  initial: RetailerLevel[] = []
): AccessManager => {
  /* ── private state ─────────────────────────────────────── */
  const levels = new Set<RetailerLevel>();
  const perms = new Set<Permission>();
  let loggedIn = false;
  let offlineLoggedIn = false;

  /* recompute merged permission set */
  const recalc = () => {
    perms.clear();
    levels.forEach((lvl) =>
      LEVEL_AUTHORITIES[lvl]?.forEach((p) => perms.add(p))
    );
  };

  /* bootstrap */
  initial.forEach((l) => levels.add(l));
  recalc();

  /* ── public object ─────────────────────────────────────── */
  return {
    /* permissions API (unchanged) */
    setLevels(ls) {
      levels.clear();
      ls.forEach((l) => levels.add(l));
      recalc();
    },
    getLevels() {
      return [...levels];
    },
    reset() {
      levels.clear();
      perms.clear();
      loggedIn = false;
      offlineLoggedIn = false;
    },
    setPermissions(ps) {
      perms.clear();
      ps.forEach((p) => perms.add(p));
    },
    getPermissions() {
      return [...perms];
    },
    has(p) {
      return perms.has(p);
    },

    /* NEW session helpers */
    isLoggedIn() {
      return loggedIn;
    },
    setLoggedIn(state) {
      loggedIn = state;
      if (!state) offlineLoggedIn = false;
    },

    isOfflineLoggedIn() {
      return offlineLoggedIn;
    },
    setOfflineLoggedIn(state) {
      offlineLoggedIn = state;
      if (state) loggedIn = true; // offline login counts as "logged in"
    },
  };
};

export const accessManager = createAccessManager(); 