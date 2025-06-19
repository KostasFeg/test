# 📊 Enhanced Report Service

This document explains the streamlined report fetching system that supports both mock and real API calls with AXIOS integration.

## ✨ Features

- **🎭 Mock Mode**: Realistic mock data for development and testing
- **🌐 API Mode**: Real backend integration with AXIOS
- **🔧 Testing Mode**: Make both mock and real requests simultaneously
- **🔌 Plug & Play**: Just provide a baseURL and everything works
- **🌍 Auto URL Building**: Automatic parameter handling and URL construction
- **🔄 Smart Fallback**: Falls back to mock data if API fails
- **📡 Network Visibility**: See all requests in your browser's Network tab

## 🚀 Quick Start

### 1. Basic Setup (Programmatic)

```typescript
import { setupReportService } from "./src/services/reportService";

// Quick setup for your backend
setupReportService("https://your-backend.com/api/reports", {
  showBothRequests: true, // Enable testing mode
  useMockData: false, // Use real API data
});
```

### 2. Using the Configuration UI

Navigate to `/report-service-demo` in your application to access the visual configuration panel where you can:

- Set your backend URL using presets or manual input
- Toggle between mock and API modes
- Enable testing mode to see both requests
- Test your API connection
- View current configuration

### 3. Using Reports

```typescript
import GenericReport from './src/components/ui/GenericReport';

// Use any report - the service handles both mock and real API calls
<GenericReport reportSlug="sales" />
<GenericReport reportSlug="commissions" />
<GenericReport reportSlug="transaction-history" />
```

## 🏗️ How It Works

### URL Structure

The service automatically constructs URLs following this pattern:

```
{baseUrl}/{applicationSlug}/{reportSlug}?param1=value1&param2=value2
```

**Example:**

```
https://your-backend.com/api/reports/current/sales?type=Day&scope=Retailer&fromDate=1234567890
```

### Parameter Handling

All report parameters are automatically converted to URL query parameters:

- `type` → `?type=Day`
- `scope` → `?scope=Retailer`
- `fromDate` → `?fromDate=1234567890`
- `toDate` → `?toDate=1234567890`
- `withTime` → `?withTime=true`
- Custom parameters via `additionalParams`

### Smart Mode Selection

1. **Mock Only** (`useMockData: true`): Always returns mock data
2. **API Only** (`useMockData: false`): Calls real API, falls back to mock on error
3. **Testing Mode** (`showBothRequests: true`): Makes both calls, shows both in Network tab

## 🔧 Configuration Options

```typescript
interface ReportServiceConfig {
  baseUrl?: string; // Your backend URL
  useMockData?: boolean; // Use mock data (default: true)
  showBothRequests?: boolean; // Testing mode (default: false)
  timeout?: number; // Request timeout (default: 10000ms)
  headers?: Record<string, string>; // Custom headers
}
```

## 📈 Real-World Usage Examples

### Development Environment

```typescript
setupReportService("http://localhost:3000/api/reports", {
  showBothRequests: true, // See both mock and real requests
  useMockData: false,
});
```

### Production Environment

```typescript
setupReportService("https://api.yourcompany.com/reports", {
  useMockData: false,
  timeout: 15000,
  headers: {
    Authorization: "Bearer your-token",
    "X-Client-Version": "1.0.0",
  },
});
```

### Testing/QA Environment

```typescript
setupReportService("https://staging-api.yourcompany.com/reports", {
  showBothRequests: true, // Compare mock vs real data
  useMockData: false,
});
```

## 🧪 Testing Your Integration

1. **Open Browser DevTools** → Network tab
2. **Navigate to** `/report-service-demo`
3. **Configure your backend URL** using the UI
4. **Enable "Show Both Requests"** checkbox
5. **Generate reports** and watch the Network tab
6. **You should see** both mock and real API calls

## 🛠️ API Requirements

Your backend should expect requests to:

```
GET /{applicationSlug}/{reportSlug}
```

With query parameters for filters:

- `type`: Day, Week, Month
- `scope`: Retailer, Agent
- `fromDate`: Unix timestamp
- `toDate`: Unix timestamp
- `withTime`: boolean
- Any custom parameters

**Example Response:**

```html
<html>
  <body>
    <h1>Sales Report</h1>
    <table>
      <!-- Your report HTML content -->
    </table>
  </body>
</html>
```

## 🔍 Debugging

### Enable Console Logging

The service automatically logs all requests and responses:

```
🌐 API Request: GET /current/sales
✅ API Response: 200 /current/sales
🎭 Fetching report from mock service: {slug: "sales", ...}
```

### Test Connection

```typescript
import { reportService } from "./src/services/reportService";

const result = await reportService.testConnection();
console.log(result); // { success: true, message: "Connected successfully" }
```

### Check Configuration

```typescript
console.log(reportService.getConfig());
console.log(reportService.isApiConfigured());
```

## 📝 Migration from Old System

### Before (Old mockReportService)

```typescript
import { mockReportService } from "./services/mockReportService";

const response = await mockReportService.getReport(params);
```

### After (Enhanced reportService)

```typescript
import { reportService } from "./services/reportService";

// Same interface, but now supports both mock and real API!
const response = await reportService.getReport(params);
```

The `GenericReport` component has been automatically updated to use the new service, so existing reports should work without changes.

## 🆘 Troubleshooting

### API Calls Not Working

1. Check that `baseUrl` is configured
2. Verify your backend is running and accessible
3. Check browser console for CORS errors
4. Test connection using the configuration UI

### Not Seeing Both Requests

1. Ensure `showBothRequests: true` is set
2. Check that you're not in mock-only mode
3. Verify baseURL is configured

### Mock Data Not Loading

1. Check that mock data exists for your report slug
2. Verify mock service is properly imported
3. Check browser console for errors

## 📚 Further Reading

- See `/src/services/reportService.ts` for implementation details
- See `/src/components/ui/ReportServiceExample.tsx` for usage examples
- See `/src/components/ui/ReportServiceConfig.tsx` for configuration UI
- Check existing mock data in `/src/services/mockReportService.ts`
