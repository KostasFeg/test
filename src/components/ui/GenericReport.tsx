import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ImageScroller from "./ImageScroller";
// @ts-ignore
import styles from "./GenericReport.module.scss";

// Mocked dependencies and data
const RenderReport = ({ children }: any) => <div>{children}</div>;
const RetailerPortalStore = {
  REPORTS: {
    mockReport: {
      name: "Mock Report",
      slug: "sales",
      required: ["type", "fromDate", "toDate"],
      options: {
        type: ["Day", "Week"],
        withTime: false,
        withAutoTime: true,
      },
    },
  },
};
const getReportTitle = () => "Mock Report Title";
const getReportActionType = () => "buttons";
const service = {
  getReport: async () =>
    Promise.resolve(
      `<div><b>Sample Report Data</b><br/>Date: 2024-06-01<br/>Total: $100.00</div>`
    ),
};
const app = { print: (data: any) => alert("Printing: " + data) };
const dateFormats = {
  DateTimeOnly24Unicode: "yyyy-MM-dd HH:mm",
  shortDateUnicode: "yyyy-MM-dd",
  timeOnly: "HH:mm",
};

const DAILY_OFFSET_SLUGS = [
  "sales",
  "sales-summary",
  "commissions",
  "cashes",
  "financial-adjustments",
];

type State = {
  isLoading: boolean;
  htmlCode: string;
  params: {
    type: string;
    fromDate: number;
    toDate: number;
    withTime: boolean;
    withAutoTime: boolean;
  };
  error: string | null;
  calendarOpen: boolean;
};

function unixToDate(unix: number) {
  return new Date(unix * 1000);
}

const GenericReport = ({
  report = "mockReport",
  i18n = { get: (k: string) => k },
}) => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<State>(() => {
    const now = new Date();
    let localTimestampStart = Math.floor(now.setHours(0, 0, 0, 0) / 1000);
    let localTimestampEnd = Math.floor(now.setHours(23, 59, 59, 999) / 1000);
    return {
      isLoading: false,
      htmlCode: "",
      params: {
        type: RetailerPortalStore.REPORTS[report].options["type"][0],
        fromDate: localTimestampStart,
        toDate: localTimestampEnd,
        withTime: false,
        withAutoTime: true,
      },
      error: null,
      calendarOpen: false,
    };
  });

  useEffect(() => {
    fetchService();
    // eslint-disable-next-line
  }, []);

  const fetchService = async (params = {}) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    const newParams = { ...state.params, ...params };
    try {
      const response = await service.getReport();
      setState((prev) => ({
        ...prev,
        htmlCode: response || "",
        isLoading: false,
        params: newParams,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Error fetching report",
      }));
    }
  };

  const onCalendarChange = (date: Date | null, calendar: string) => {
    if (!date) return;
    const localTimestamp = Math.floor(date.getTime() / 1000);
    fetchService({ [calendar]: localTimestamp });
    setState((prev) => ({ ...prev, calendarOpen: false }));
  };

  const getFilters = () => {
    const filters: React.ReactNode[] = [];
    const { params } = state;
    RetailerPortalStore.REPORTS[report].required.forEach((requiredField) => {
      switch (requiredField) {
        case "type":
          filters.push(
            <div className="type" key="type-filter">
              {RetailerPortalStore.REPORTS[report].options["type"].map(
                (type: string) => (
                  <button
                    key={type}
                    className={[
                      params.type === type ? styles.active : "",
                      styles["filter-margin"],
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() => fetchService({ type })}
                    type="button"
                  >
                    {type}
                  </button>
                )
              )}
            </div>
          );
          break;
        case "fromDate":
        case "toDate":
          const timestamp = params[requiredField];
          const preSelected = Number.isFinite(timestamp)
            ? unixToDate(timestamp)
            : new Date();
          // minDate: 6 months ago, maxDate: today
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
              className={styles["filter-margin"]}
            >
              <span>{requiredField}</span>
              <DatePicker
                selected={preSelected}
                placeholderText={"select date"}
                minDate={minDate}
                maxDate={maxDate}
                onChange={(date) => onCalendarChange(date, requiredField)}
                showTimeSelect={params.withTime ?? false}
                dateFormat={
                  params.withTime || params.withAutoTime
                    ? dateFormats.DateTimeOnly24Unicode
                    : dateFormats.shortDateUnicode
                }
                timeFormat={dateFormats.timeOnly}
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
    alert("Print functionality would be triggered here.");
  };

  const { isLoading, htmlCode, error } = state;

  return (
    <div className={styles.financial_sales}>
      <div className={styles.title}>{getReportTitle()}</div>
      {report === "mockReport" && (
        <div className={styles["mock-image-scroller-wrapper"]}>
          <ImageScroller src="https://picsum.photos/800/1600" />
        </div>
      )}
      <div className={styles["filters-row"]}>
        {getFilters()}
        <button
          className={styles["print-btn"]}
          onClick={printReport}
          disabled={!htmlCode}
          type="button"
        >
          Print
        </button>
        <button
          className={styles["sample-btn"]}
          onClick={() => navigate("/sample-report")}
          type="button"
        >
          View Sample Report
        </button>
      </div>
      <div className={styles["report-container"]}>
        {isLoading && <div>Loading...</div>}
        {error && <div className={styles["report-error"]}>{error}</div>}
        {!isLoading && !htmlCode && <div>No data available</div>}
        {!isLoading && htmlCode && (
          <div ref={containerRef}>
            <RenderReport>
              <div
                id="report"
                className={styles.report}
                dangerouslySetInnerHTML={{ __html: htmlCode }}
              />
            </RenderReport>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenericReport;
