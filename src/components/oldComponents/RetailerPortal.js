import { action, computed, makeObservable, observable } from 'mobx';
import RetailerLevels from "Stores/RetailerLevels";

class RetailerPortalStore {

       static GENERIC_VIEWS = Object.freeze({
              LOGIN: 'login',
              HOME: 'home',
              REPORTS_MENU: 'reports-menu'
       });

       static REPORT_VIEWS = Object.freeze({
              CASH_REPORT: 'cash-report',
              LAST_PLAY_RECEIPTS_REPORT: 'last-play-receipts-report',
              LAST_POS_RECEIPTS_REPORT: 'last-pos-receipts-report',
              LAST_VOUCHER_RECEIPTS_REPORT: 'last-voucher-receipts-report',
              TRANSACTION_REPORT: 'transaction-report',
              FINANCIAL_REPORT: 'financial-report',
              FINANCIAL_ADJUSTMENT_REPORT: 'financial-adjustment-report',
              SUMMARY_REPORT: 'summary-report',
              FINANCIAL_VALIDATIONS_REPORT: 'financial-validations-report',
              FINANCIAL_COMMISSIONS_REPORT: 'financial-commissions-report',
              FINANCIAL_COUPONS_REPORT: 'financial-coupons-report',
              SHIFTS_REPORT: 'shift-report',
              MACHINE_SETTINGS_REPORT: 'machine-settings-report',
              TICKET_HISTORY_REPORT: 'ticket-history-report',
              ALL_GAMES_JACKPOT_INFO_REPORT: 'all-games-jackpot-info-report',
              ALL_GAMES_LAST_INFO_REPORT: 'all-games-last-info-report',
              TREASURY_PLAY_INCENTIVES_REPORT: 'treasury-play-incentives-report',
              CASHES_REPORT: 'cashes-report',
              CURRENT_JACKPOTS_REPORT: 'current-jackpots',
              WINNING_NUMBERS_REPORT: 'winning-numbers',
              CURRENT_SETTLEMENT_REPORT: 'current_settlement_report',
              PREVIOUS_SETTLEMENT_REPORT: 'previous_settlement_report',
              TRANSACTION_HISTORY_REPORT: 'transaction_history_report',
              GAMESTATION_SHIFT_REPORT: 'gamestation_shift_report'
       });

       static AVAILABLE_VIEWS = Object.freeze(
              Object.assign({}, RetailerPortalStore.GENERIC_VIEWS, RetailerPortalStore.REPORT_VIEWS)
       );

       static REPORTS = {
              [RetailerPortalStore.AVAILABLE_VIEWS.LAST_PLAY_RECEIPTS_REPORT]: {
                     name: 'last_play_receipts_report'
              },
              [RetailerPortalStore.AVAILABLE_VIEWS.LAST_VOUCHER_RECEIPTS_REPORT]: {
                     name: 'last_voucher_receipts_report'
              },
              [RetailerPortalStore.AVAILABLE_VIEWS.LAST_POS_RECEIPTS_REPORT]: {
                     name: 'last_pos_receipts_report'
              },
              [RetailerPortalStore.AVAILABLE_VIEWS.TICKET_HISTORY_REPORT]: {
                     name: 'ticket_history_report'
              },
              [RetailerPortalStore.AVAILABLE_VIEWS.CASH_REPORT]: {
                     name: 'cash_reconciliation_report'
              },
              [RetailerPortalStore.AVAILABLE_VIEWS.TRANSACTION_REPORT]: {
                     name: 'terminal_transaction_report'
              },
              [RetailerPortalStore.AVAILABLE_VIEWS.FINANCIAL_REPORT]: {
                     name: 'financial_sales_report',
                     slug: 'sales',
                     required: ["type", "scope"],
                     options: {
                            'type': ['Day', 'Week'],
                            'scope': ['Retailer']
                     }
              },
              [RetailerPortalStore.AVAILABLE_VIEWS.FINANCIAL_ADJUSTMENT_REPORT]: {
                     name: 'financial_adjustment_report',
                     slug: 'financial-adjustments',
                     required: ["type", "scope"],
                     options: {
                            'type': ['Day', 'Week'],
                            'scope': ['Retailer']
                     }
              },
              [RetailerPortalStore.AVAILABLE_VIEWS.SUMMARY_REPORT]: {
                     name: 'summary_report',
                     slug: 'sales-summary',
                     required: ["type", "scope"],
                     options: {
                            'type': ['Day', 'Week'],
                            'scope': ['Retailer']
                     }
              },
              [RetailerPortalStore.AVAILABLE_VIEWS.FINANCIAL_VALIDATIONS_REPORT]: {
                     name: 'financial_validations_report'
              },
              [RetailerPortalStore.AVAILABLE_VIEWS.FINANCIAL_COMMISSIONS_REPORT]: {
                     name: 'financial_commissions_report',
                     slug: 'commissions',
                     required: ["type", "scope"],
                     options: {
                            'type': ['Day', 'Week'],
                            'scope': ['Retailer']
                     }
              },
              [RetailerPortalStore.AVAILABLE_VIEWS.FINANCIAL_COUPONS_REPORT]: {
                     name: 'financial_coupons_report'
              },
              [RetailerPortalStore.AVAILABLE_VIEWS.CASHES_REPORT]: {
                     name: 'cashes_report',
                     slug: 'cashes',
                     required: ["type", "scope"],
                     options: {
                            'type': ['Day', 'Week'],
                            'scope': ['Retailer']
                     }
              },
              [RetailerPortalStore.AVAILABLE_VIEWS.SHIFTS_REPORT]: {
                     name: 'shifts_report'
              },
              [RetailerPortalStore.AVAILABLE_VIEWS.MACHINE_SETTINGS_REPORT]: {
                     name: 'machine_settings'
              },
              [RetailerPortalStore.AVAILABLE_VIEWS.ALL_GAMES_JACKPOT_INFO_REPORT]: {
                     name: 'all_games_jackpot_info_report'
              },
              [RetailerPortalStore.AVAILABLE_VIEWS.ALL_GAMES_LAST_INFO_REPORT]: {
                     name: 'all_games_last_info_report'
              },
              [RetailerPortalStore.AVAILABLE_VIEWS.TREASURY_PLAY_INCENTIVES_REPORT]: {
                     name: 'treasury_play_incentives_report'
              },
              [RetailerPortalStore.AVAILABLE_VIEWS.CURRENT_JACKPOTS_REPORT]: {
                     name: 'current_jackpots_report',
                     slug: 'games/current-jackpots',
                     required: []
              },
              [RetailerPortalStore.AVAILABLE_VIEWS.WINNING_NUMBERS_REPORT]: {
                     name: 'winning_numbers_report',
                     slug: 'games/winning-numbers',
                     required: []
              },
              [RetailerPortalStore.AVAILABLE_VIEWS.CURRENT_SETTLEMENT_REPORT]: {
                     name: 'current_settlement_report',
                     slug: 'weekly-invoice',
                     required: []
              },
              [RetailerPortalStore.AVAILABLE_VIEWS.PREVIOUS_SETTLEMENT_REPORT]: {
                     name: 'previous_settlement_report',
                     slug: 'weekly-invoice',
                     required: ["offset"]
              },
              [RetailerPortalStore.AVAILABLE_VIEWS.TRANSACTION_HISTORY_REPORT]: {
                     name: 'transaction_history_report',
                     slug: 'transaction-history',
                     required: ["fromDate", "toDate"]
              },
              [RetailerPortalStore.AVAILABLE_VIEWS.GAMESTATION_SHIFT_REPORT]: {
                     name: 'gamestation_shift_report',
                     slug: 'gamestation-shift',
                     required: ["type"],
                     options: {
                            'type': ['LastClosed', 'Interim']
                     }
              }
       };

       constructor() {
              makeObservable(this, {
                     _currentView: observable,
                     _isLoggedIn: observable,
                     _isOfflineLoggedIn: observable,
                     currentView: computed,
                     isLoggedIn: computed,
                     isOfflineLoggedIn: computed,
                     isRetailerLoggedIn: computed,
              });
              this.currentView = RetailerPortalStore.AVAILABLE_VIEWS.HOME;
              this.retailer = new RetailerLevels();
       }

       _currentView;
       _isLoggedIn = false;
       _isOfflineLoggedIn = false;
       _accessToken = null;

       get currentView() {
              if (this._isLoggedIn || this._isOfflineLoggedIn) {
                     return this._currentView;
              }
              return RetailerPortalStore.AVAILABLE_VIEWS.LOGIN;
       }

       set currentView(value) {
              this._currentView = value;
       }

       get isLoggedIn() {
              return this._isLoggedIn;
       }

       set isLoggedIn(value) {
              this._isLoggedIn = value;
       }

       set accessToken(token){
              this._accessToken = token;
       }

       get isOfflineLoggedIn() {
              return this._isOfflineLoggedIn;
       }

       set isOfflineLoggedIn(value) {
              this._isOfflineLoggedIn = value;
       }

       get isRetailerLoggedIn() {
              return this._isLoggedIn || this._isOfflineLoggedIn;
       }

       get accessToken(){
              return this._accessToken;
       }


}

export default new RetailerPortalStore();
export { RetailerPortalStore };