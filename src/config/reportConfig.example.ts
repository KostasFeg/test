/**
 * EXAMPLE: Report Configuration for Different Projects
 * 
 * This file shows how to configure the reports system for different projects.
 * Copy this structure and modify it for your specific needs.
 */

import { ReportConfig } from './reportConfig';

// Example configuration for a Casino Management System
export const CASINO_REPORTS: ReportConfig = {
  'daily-operations': {
    name: 'daily_operations_report',
    slug: 'casino/daily-ops',
    required: ["type", "date"],
    options: {
      'type': ['Slots', 'Tables', 'All'],
      'withTime': false,
      'withAutoTime': true
    }
  },
  'player-activity': {
    name: 'player_activity_report',
    slug: 'casino/player-activity',
    required: ["fromDate", "toDate", "playerId"],
    options: {
      'withTime': true,
      'withAutoTime': false
    }
  },
  'slot-performance': {
    name: 'slot_performance_report',
    slug: 'casino/slots',
    required: ["type", "scope"],
    options: {
      'type': ['Daily', 'Weekly', 'Monthly'],
      'scope': ['Floor', 'Zone', 'Machine']
    }
  }
};

// Example configuration for a Retail POS System  
export const RETAIL_REPORTS: ReportConfig = {
  'sales-summary': {
    name: 'retail_sales_summary',
    slug: 'retail/sales',
    required: ["type", "scope"],
    options: {
      'type': ['Day', 'Week', 'Month'],
      'scope': ['Store', 'Department', 'Category']
    }
  },
  'inventory-levels': {
    name: 'inventory_levels_report',
    slug: 'retail/inventory',
    required: ["location"],
    options: {
      'location': ['All', 'Warehouse', 'Store']
    }
  },
  'customer-analysis': {
    name: 'customer_analysis_report', 
    slug: 'retail/customers',
    required: ["fromDate", "toDate"],
    options: {
      'withTime': false,
      'withAutoTime': true
    }
  }
};

// Example configuration for a Fleet Management System
export const FLEET_REPORTS: ReportConfig = {
  'vehicle-utilization': {
    name: 'vehicle_utilization_report',
    slug: 'fleet/utilization',
    required: ["type", "vehicleType"],
    options: {
      'type': ['Daily', 'Weekly'],
      'vehicleType': ['All', 'Trucks', 'Vans', 'Cars']
    }
  },
  'maintenance-schedule': {
    name: 'maintenance_schedule_report',
    slug: 'fleet/maintenance',
    required: ["fromDate", "toDate"],
    options: {
      'withTime': false,
      'withAutoTime': true
    }
  },
  'driver-performance': {
    name: 'driver_performance_report',
    slug: 'fleet/drivers',
    required: ["driverId", "type"],
    options: {
      'type': ['Safety', 'Efficiency', 'All']
    }
  }
};

/**
 * HOW TO USE IN NAVIGATION CONFIG:
 * 
 * 1. Import your project-specific reports:
 *    import { CASINO_REPORTS } from '../config/reportConfig.example';
 * 
 * 2. Create helper function:
 *    const createCasinoReportElement = (reportSlug: string) => () => {
 *      const ReportsPageElement = React.lazy(() => import("../../pages/ReportsPage"));
 *      return React.createElement(ReportsPageElement, { reportSlug, reportConfig: CASINO_REPORTS });
 *    };
 * 
 * 3. Add to navigation:
 *    {
 *      slug: "casino-reports",
 *      label: "Casino Reports", 
 *      children: [
 *        {
 *          slug: "daily-ops",
 *          label: "Daily Operations",
 *          element: createCasinoReportElement("casino/daily-ops")
 *        },
 *        // ... more reports
 *      ]
 *    }
 */

/**
 * MOCK SERVICE CONFIGURATION:
 * 
 * You'll also need to extend the mock service with project-specific data.
 * See mockReportService.ts for examples of how to add new mock report content.
 */ 