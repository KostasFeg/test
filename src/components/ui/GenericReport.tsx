import React, { useRef, useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import SimpleDatePicker from "../DatePicker/SimpleDatePicker";
import ImageScroller from "./ImageScroller";
import Spinner from "./Spinner";
import {
  mockReportService,
  ReportParams,
} from "../../services/mockReportService";
import { getReportBySlug } from "../../config/reportConfig";
import { format } from "date-fns";
// @ts-ignore
import styles from "./GenericReport.module.scss";

// Simple utility to convert Unix timestamp to Date
const unixToDate = (timestamp: number): Date => new Date(timestamp * 1000);

const DAILY_OFFSET_SLUGS = [
  "sales",
  "sales-summary",
  "commissions",
  "cashes",
  "financial-adjustments",
];

// Mock i18n function for labels
const i18n = {
  get: (key: string) => {
    const labels: Record<string, string> = {
      day_filter: "Day",
      week_filter: "Week",
      month_filter: "Month",
      fromDate_label: "From Date",
      toDate_label: "To Date",
      print_report: "Print Report",
      generate_report: "Generate Report",
      financial_sales_report: "Financial Sales Report",
      financial_commissions_report: "Financial Commissions Report",
      cash_reconciliation_report: "Cash Reconciliation Report",
      transaction_history_report: "Transaction History Report",
      financial_adjustment_report: "Financial Adjustment Report",
      summary_report: "Summary Report",
      shifts_report: "Shifts Report",
      current_jackpots_report: "Current Jackpots Report",
      winning_numbers_report: "Winning Numbers Report",
    };
    return (
      labels[key] ||
      key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    );
  },
};

type ReportState = {
  isLoading: boolean;
  htmlCode: string;
  params: {
    type: string | null;
    scope: string | null;
    offset: number;
    fromDate: number;
    toDate: number;
    withTime: boolean;
    withAutoTime: boolean;
  };
  error: string | null;
  calendarOpen: boolean;
};

interface GenericReportProps {
  /**
   * Optional report slug override. If not provided, will extract from URL.
   * This allows the component to work both as a standalone component
   * and as part of the auto-generated navigation system.
   */
  reportSlug?: string;

  /**
   * Optional i18n override for custom translations
   */
  i18n?: typeof i18n;

  /**
   * Additional filters/parameters to pass to the report
   */
  additionalParams?: Record<string, any>;

  /**
   * Custom class name for styling
   */
  className?: string;
}

const GenericReport: React.FC<GenericReportProps> = ({
  reportSlug: propReportSlug,
  i18n: propI18n = i18n,
  additionalParams = {},
  className = "",
}) => {
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);

  // Extract report slug from URL if not provided as prop
  const reportSlug = useMemo(() => {
    if (propReportSlug) return propReportSlug;

    // Extract from URL path - get the last segment
    const pathSegments = location.pathname.split("/").filter(Boolean);
    return pathSegments[pathSegments.length - 1] || "";
  }, [propReportSlug, location.pathname]);

  // Find the report configuration by slug
  const reportConfig = useMemo(() => {
    if (!reportSlug) return null;
    return getReportBySlug(reportSlug);
  }, [reportSlug]);

  // Initialize state based on report configuration
  const [state, setState] = useState<ReportState>(() => {
    const now = new Date();
    const startOfDay = Math.floor(now.setHours(0, 0, 0, 0) / 1000);
    const endOfDay = Math.floor(now.setHours(23, 59, 59, 999) / 1000);

    const withTime = reportConfig?.options?.withTime || false;
    const withAutoTime = reportConfig?.options?.withAutoTime || false;

    return {
      isLoading: false,
      htmlCode: "",
      params: {
        type: reportConfig?.options?.type?.[0] || null,
        scope: reportConfig?.options?.scope?.[0] || null,
        offset: 0,
        fromDate: withAutoTime ? startOfDay : Math.floor(Date.now() / 1000),
        toDate: withAutoTime ? endOfDay : Math.floor(Date.now() / 1000),
        withTime,
        withAutoTime,
      },
      error: null,
      calendarOpen: false,
    };
  });

  // Fetch report data
  const fetchReport = async (params: Partial<ReportState["params"]> = {}) => {
    const newParams = { ...state.params, ...params };
    setState((prev) => ({
      ...prev,
      isLoading: true,
      params: newParams,
      error: null,
    }));

    try {
      const requestParams: ReportParams = {
        slug: reportSlug,
        type: newParams.type || undefined,
        scope: newParams.scope || undefined,
        offset: newParams.offset,
        fromDate: newParams.fromDate,
        toDate: newParams.toDate,
        withTime: newParams.withTime,
        withAutoTime: newParams.withAutoTime,
        ...additionalParams, // Allow additional parameters
      };

      // Handle offset for daily reports (preserving old logic)
      if (
        DAILY_OFFSET_SLUGS.includes(reportSlug) &&
        requestParams.type === "Day"
      ) {
        if (
          typeof requestParams.offset === "number" &&
          requestParams.offset > 1e9
        ) {
          // Convert timestamp to days offset
          const offsetDays = Math.floor(
            (Date.now() / 1000 - requestParams.offset) / 86400
          );
          requestParams.offset =
            offsetDays === 0 ? undefined : String(offsetDays);
        } else if (requestParams.offset === 0) {
          delete requestParams.offset;
        }
      }

      // Convert to UTC for autoTime reports (preserving old logic)
      if (requestParams.withAutoTime) {
        const localFromDate = new Date(requestParams.fromDate! * 1000);
        const utcFromTimestamp =
          Math.floor(localFromDate.getTime() / 1000) -
          localFromDate.getTimezoneOffset() * 60;
        requestParams.fromDate = utcFromTimestamp;

        const localToDate = new Date(requestParams.toDate! * 1000);
        const utcToTimestamp =
          Math.floor(localToDate.getTime() / 1000) -
          localToDate.getTimezoneOffset() * 60;
        requestParams.toDate = utcToTimestamp;
      }

      // Use the enhanced mock service
      const response = await mockReportService.getReport(requestParams);
      setState((prev) => ({
        ...prev,
        htmlCode: response || "",
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error fetching report:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Error fetching report",
      }));
    }
  };

  // Initial load when report slug changes
  useEffect(() => {
    if (reportSlug) {
      fetchReport();
    }
  }, [reportSlug]);

  const handleDateChange = (
    date: Date | null,
    field: "fromDate" | "toDate"
  ) => {
    if (!date) return;
    const timestamp = Math.floor(date.getTime() / 1000);
    fetchReport({ [field]: timestamp });
  };

  const getFilters = () => {
    const filters: React.ReactNode[] = [];
    const { params } = state;

    (effectiveReportConfig.filters || []).forEach((requiredField) => {
      switch (requiredField) {
        case "type":
          if (
            effectiveReportConfig.options?.type &&
            effectiveReportConfig.options.type.length > 1
          ) {
            filters.push(
              <div className={styles["filter-section"]} key="type-filter">
                <span className={styles["filter-label"]}>Report Type:</span>
                <div className={styles["filter-buttons"]}>
                  {effectiveReportConfig.options.type.map((type: string) => (
                    <button
                      key={type}
                      className={`${styles["filter-button"]} ${
                        params.type === type ? styles.active : ""
                      }`}
                      onClick={() => fetchReport({ type, scope: "Retailer" })}
                      type="button"
                    >
                      {propI18n.get(`${type.toLowerCase()}_filter`)}
                    </button>
                  ))}
                </div>
              </div>
            );
          }
          break;

        case "scope":
          if (
            effectiveReportConfig.options?.scope &&
            effectiveReportConfig.options.scope.length > 1
          ) {
            filters.push(
              <div className={styles["filter-section"]} key="scope-filter">
                <span className={styles["filter-label"]}>Scope:</span>
                <div className={styles["filter-buttons"]}>
                  {effectiveReportConfig.options.scope.map((scope: string) => (
                    <button
                      key={scope}
                      className={`${styles["filter-button"]} ${
                        params.scope === scope ? styles.active : ""
                      }`}
                      onClick={() => fetchReport({ scope })}
                      type="button"
                    >
                      {scope}
                    </button>
                  ))}
                </div>
              </div>
            );
          }
          break;

        case "fromDate":
        case "toDate":
          const timestamp = params[requiredField];
          const preSelected = Number.isFinite(timestamp)
            ? unixToDate(timestamp)
            : new Date();

          // Date constraints: 6 months ago to today
          const now = new Date();
          const minDate = new Date(
            now.getFullYear(),
            now.getMonth() - 6,
            now.getDate()
          );
          const maxDate = now;

          filters.push(
            <div
              key={`date-picker-${requiredField}`}
              className={styles["filter-section"]}
            >
              <span className={styles["filter-label"]}>
                {propI18n.get(`${requiredField}_label`)}
              </span>
              <SimpleDatePicker
                selected={preSelected}
                placeholderText={"Select date"}
                minDate={minDate}
                maxDate={maxDate}
                onChange={(date) => handleDateChange(date, requiredField)}
                showTimeSelect={params.withTime ?? false}
                dateFormat={
                  params.withTime || params.withAutoTime
                    ? "yyyy-MM-dd HH:mm"
                    : "yyyy-MM-dd"
                }
                timeFormat="HH:mm"
                className={styles["date-picker"]}
              />
            </div>
          );
          break;

        default:
          // Handle other filter types if needed
          break;
      }
    });

    return filters;
  };

  const handlePrintReport = () => {
    // For now, just show an alert. In real implementation, this would
    // trigger the actual printing functionality
    alert("Print functionality would be triggered here.");
    console.log("Print report:", {
      reportSlug,
      htmlCode: state.htmlCode,
      params: state.params,
    });
  };

  const { isLoading, htmlCode, error } = state;

  // If no report slug, show a helpful message
  if (!reportSlug) {
    return (
      <div className={`${styles.financial_sales} ${className}`}>
        <div className={styles["error-message"]}>
          <h3>No Report Selected</h3>
          <p>
            Unable to determine which report to display. Please navigate to a
            specific report or provide a reportSlug prop.
          </p>
        </div>
      </div>
    );
  }

  // Create effective config - use found config or simple fallback
  const effectiveReportConfig = reportConfig || {
    name:
      reportSlug
        .replace(/[\/\-]/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase()) + " Report",
    filters: [],
    options: {},
  };
  const filters = getFilters();

  return (
    <div className={`${styles.financial_sales} ${className}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          {propI18n.get(effectiveReportConfig.name)}
        </h1>

        {/* Action buttons and filters */}
        {filters.length > 0 && (
          <div className={styles["action-container"]}>
            <div className={styles.filters}>{filters}</div>
            <div className={styles["action-buttons"]}>
              <button
                className={`${styles["generate-btn"]} ${
                  !htmlCode ? styles.disabled : ""
                }`}
                onClick={() => fetchReport()}
                disabled={isLoading}
              >
                {isLoading ? "Generating..." : propI18n.get("generate_report")}
              </button>
              <button
                className={`${styles["print-btn"]} ${
                  !htmlCode ? styles.disabled : ""
                }`}
                onClick={handlePrintReport}
                disabled={!htmlCode || isLoading}
              >
                {propI18n.get("print_report")}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Report content area */}
      <div className={styles["report-section"]}>
        {isLoading && (
          <div className={styles["loading-container"]}>
            <Spinner size={40} />
            <span>Loading report...</span>
          </div>
        )}

        {error && (
          <div className={styles["report-error"]}>
            <h4>Error Loading Report</h4>
            <p>{error}</p>
            <button
              className={styles["retry-btn"]}
              onClick={() => fetchReport()}
            >
              Retry
            </button>
          </div>
        )}

        {!isLoading && !htmlCode && !error && (
          <div className={styles["no-data"]}>
            <h4>No Data Available</h4>
            <p>No data available for this report configuration.</p>
            <button
              className={styles["generate-btn"]}
              onClick={() => fetchReport()}
            >
              Generate Report
            </button>
          </div>
        )}

        {!isLoading && htmlCode && (
          <div style={{ flex: 1, overflow: "hidden", minHeight: 0 }}>
            <ImageScroller fill>
              <div
                ref={containerRef}
                className={styles["report-content"]}
                style={{
                  minWidth: window.innerWidth > 850 ? "680px" : "100%",
                  background: "#fff",
                  fontFamily: "Arial, sans-serif",
                  padding: window.innerWidth > 600 ? "20px" : "10px",
                }}
                dangerouslySetInnerHTML={{ __html: htmlCode }}
              />
            </ImageScroller>
          </div>
        )}
      </div>

      {/* Debug info in development */}
      {typeof window !== "undefined" &&
        window.location.hostname === "localhost" && (
          <div className={styles["debug-info"]}>
            <details>
              <summary>Debug Info</summary>
              <pre>
                {JSON.stringify(
                  {
                    reportSlug,
                    reportConfig: reportConfig
                      ? {
                          name: reportConfig.name,
                          filters: reportConfig.filters,
                          options: reportConfig.options,
                        }
                      : null,
                    currentParams: state.params,
                    location: location.pathname,
                  },
                  null,
                  2
                )}
              </pre>
            </details>
          </div>
        )}
    </div>
  );
};

export default GenericReport;
