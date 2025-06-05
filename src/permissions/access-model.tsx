// ---- Retailer & permission catalogue ---------------------------------

export enum RetailerLevel {
  ADMINISTRATOR = 'sst-administrator',
  AGENT_MANAGER = 'sst-agent-manager',
  AGENT_CLERK   = 'sst-agent-clerk',
}

// tuple → union trick keeps type & value in sync
const PERMISSIONS = [
  'reload', 'reports', 'sign_off_terminal', 'restart', 'reboot',
  'shutdown', 'show_dmc_gui', 'end_shift', 'show_diagnostics',
  'hw-status-bar',
] as const;

export type Permission = typeof PERMISSIONS[number];

// Level-to-permission map
export const LEVEL_AUTHORITIES: Readonly<Record<RetailerLevel, readonly Permission[]>> = {
  [RetailerLevel.ADMINISTRATOR]: [
    'reload','reports','sign_off_terminal','restart','reboot',
    'shutdown','show_dmc_gui','end_shift','show_diagnostics','hw-status-bar',
  ],
  [RetailerLevel.AGENT_MANAGER]: [
    'reload','reports','sign_off_terminal','restart','reboot',
    'shutdown','end_shift','show_diagnostics','hw-status-bar',
  ],
  [RetailerLevel.AGENT_CLERK]: [
    'reload','reports','show_dmc_gui','show_diagnostics',
  ],
} as const;
