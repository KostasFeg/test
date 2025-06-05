import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import ImageScroller from "../components/ui/ImageScroller";
import SimpleDatePicker from "../components/DatePicker/SimpleDatePicker";
import Spinner from "../components/ui/Spinner";
import { mockReportService, ReportParams } from "../services/mockReportService";
import {
  REPORTS,
  getReportTitle,
  getReportActionType,
  getReportBySlug,
} from "../config/reportConfig";
import "./ReportsPage.scss"; // Reuse the same styles

interface ReportState {
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
}

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
      fromDate_label: "From Date",
      toDate_label: "To Date",
      print_report: "Print Report",
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

const UniversalReportsPage: React.FC = () => {
  const location = useLocation();

  // Extract report slug from current path
  const reportSlug = useMemo(() => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    return pathSegments[pathSegments.length - 1] || "";
  }, [location.pathname]);

  // Find the report configuration by slug
  const reportConfig = useMemo(() => {
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
    };
  });

  // Fetch report data
  const fetchReport = async (params: Partial<ReportState["params"]> = {}) => {
    if (!reportConfig) return;

    const newParams = { ...state.params, ...params };
    setState((prev) => ({
      ...prev,
      isLoading: true,
      params: newParams,
      error: null,
    }));

    try {
      const requestParams: ReportParams = {
        slug: reportConfig.slug,
        type: newParams.type || undefined,
        scope: newParams.scope || undefined,
        offset: newParams.offset,
        fromDate: newParams.fromDate,
        toDate: newParams.toDate,
        withTime: newParams.withTime,
        withAutoTime: newParams.withAutoTime,
      };

      // Handle offset for daily reports (similar to old GenericReport logic)
      if (
        DAILY_OFFSET_SLUGS.includes(reportConfig.slug) &&
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

      // Convert to UTC for autoTime reports
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

      const response = await mockReportService.getReport(requestParams);
      setState((prev) => ({ ...prev, htmlCode: response, isLoading: false }));
    } catch (error) {
      console.error("Error fetching report:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Error fetching report",
      }));
    }
  };

  // Initial load when report config changes
  useEffect(() => {
    if (reportConfig) {
      fetchReport();
    }
  }, [reportConfig]);

  const handleDateChange = (
    date: Date | null,
    field: "fromDate" | "toDate"
  ) => {
    if (!date) return;
    const timestamp = Math.floor(date.getTime() / 1000);
    fetchReport({ [field]: timestamp });
  };

  const getFilters = () => {
    if (!reportConfig) return [];

    const filters: React.ReactNode[] = [];
    const { params } = state;

    reportConfig.required.forEach((requiredField) => {
      switch (requiredField) {
        case "type":
          if (
            reportConfig.options?.type &&
            reportConfig.options.type.length > 1
          ) {
            filters.push(
              <div className="report-filters__type" key="type-filter">
                <span className="report-filters__label">Report Type:</span>
                <div className="report-filters__buttons">
                  {reportConfig.options.type.map((type: string) => (
                    <button
                      key={type}
                      className={`report-filters__button ${
                        params.type === type ? "active" : ""
                      }`}
                      onClick={() => fetchReport({ type, scope: "Retailer" })}
                      type="button"
                    >
                      {i18n.get(`${type.toLowerCase()}_filter`)}
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
          const selectedDate = new Date(timestamp * 1000);

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
              className="report-filters__date"
            >
              <span className="report-filters__label">
                {i18n.get(`${requiredField}_label`)}:
              </span>
              <SimpleDatePicker
                selected={selectedDate}
                placeholderText="Select date"
                minDate={minDate}
                maxDate={maxDate}
                onChange={(date) => handleDateChange(date, requiredField)}
                showTimeSelect={params.withTime}
                dateFormat={
                  params.withTime || params.withAutoTime
                    ? "yyyy-MM-dd HH:mm"
                    : "yyyy-MM-dd"
                }
                timeFormat="HH:mm"
              />
            </div>
          );
          break;

        default:
          break;
      }
    });

    return filters;
  };

  const printReport = () => {
    // Mock print functionality
    alert(
      "Print functionality would be triggered here with the report content."
    );
  };

  const renderActions = () => {
    const filters = getFilters();

    return (
      <div className="report-actions">
        <div className="report-filters">{filters}</div>
        <button
          className={`report-actions__print ${
            !state.htmlCode ? "disabled" : ""
          }`}
          onClick={printReport}
          disabled={!state.htmlCode}
        >
          {i18n.get("print_report")}
        </button>
      </div>
    );
  };

  if (!reportConfig) {
    return (
      <div className="reports-page">
        <div className="reports-page__error">
          <h2>Report Not Found</h2>
          <p>The requested report "{reportSlug}" was not found.</p>
        </div>
      </div>
    );
  }

  const { isLoading, htmlCode, error } = state;

  return (
    <div className="reports-page">
      <div className="reports-page__header">
        <h1 className="reports-page__title">{reportConfig.navigation.label}</h1>
      </div>

      {renderActions()}

      <div className="reports-page__content">
        {isLoading && (
          <div className="reports-page__loading">
            <Spinner size={40} />
            <span>Loading report...</span>
          </div>
        )}

        {error && (
          <div className="reports-page__error">
            <div className="alert alert-danger">{error}</div>
          </div>
        )}

        {!isLoading && !htmlCode && !error && (
          <div className="reports-page__no-data">
            <p>No data available for this report.</p>
          </div>
        )}

        {!isLoading && htmlCode && (
          <div className="reports-page__report">
            <ImageScroller fill>
              <div
                className="report-content"
                style={{
                  minWidth: "680px",
                  background: "#fff",
                  fontFamily: "Arial, sans-serif",
                  padding: "20px",
                }}
                dangerouslySetInnerHTML={{ __html: htmlCode }}
              />
            </ImageScroller>
          </div>
        )}
      </div>
    </div>
  );
};

export default UniversalReportsPage;
