import axios, { AxiosInstance } from 'axios';
import { mockReportService, ReportParams } from './mockReportService';

export interface ReportServiceConfig {
  baseUrl?: string;
  useMockData?: boolean;
  showBothRequests?: boolean;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface ApiReportParams extends ReportParams {
  applicationSlug?: string;
}

// Module-level state
let config: ReportServiceConfig = {
  useMockData: true,
  showBothRequests: false,
  timeout: 10000,
};

let axiosInstance: AxiosInstance;

// Initialize axios instance
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: config.baseUrl,
    timeout: config.timeout,
    headers: {
      'Content-Type': 'application/json',
      ...config.headers,
    },
  });

  // Add interceptors
  instance.interceptors.request.use(
    (config) => {
      console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
        data: config.data,
      });
      return config;
    },
    (error) => {
      console.error('🚫 API Request Error:', error);
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`, {
        data: response.data,
      });
      return response;
    },
    (error) => {
      console.error('🚫 API Response Error:', error);
      return Promise.reject(error);
    }
  );

  return instance;
};

// Initialize on module load
axiosInstance = createAxiosInstance();

// Configuration functions
export const updateConfig = (newConfig: Partial<ReportServiceConfig>) => {
  config = { ...config, ...newConfig };
  
  // Recreate axios instance with new config
  axiosInstance = createAxiosInstance();
  
  console.log('📊 Report Service configured:', {
    baseUrl: config.baseUrl || 'Not set',
    useMockData: config.useMockData ?? true,
    showBothRequests: config.showBothRequests ?? false,
    isApiConfigured: Boolean(config.baseUrl),
  });
};

export const getConfig = (): ReportServiceConfig => ({ ...config });

export const isApiConfigured = (): boolean => Boolean(config.baseUrl);

// Main report fetching function
export const getReport = async (params: ApiReportParams): Promise<string> => {
  const { useMockData, showBothRequests } = config;

  // Testing mode - make both requests
  if (showBothRequests) {
    console.log('🔧 Testing mode: Making both mock and real requests');
    
    try {
      const [mockResult, apiResult] = await Promise.allSettled([
        fetchReportFromMock(params),
        config.baseUrl ? fetchReportFromApi(params) : Promise.resolve('No baseURL configured')
      ]);

      console.log('🎭 Mock result:', mockResult);
      console.log('🌐 API result:', apiResult);

      if (mockResult.status === 'fulfilled') {
        return mockResult.value;
      } else {
        throw new Error('Mock request failed');
      }
    } catch (error) {
      console.error('❌ Error in testing mode:', error);
      return await fetchReportFromMock(params);
    }
  }

  // Normal operation
  if (useMockData || !config.baseUrl) {
    return await fetchReportFromMock(params);
  } else {
    try {
      return await fetchReportFromApi(params);
    } catch (error) {
      console.warn('⚠️ API request failed, falling back to mock data:', error);
      return await fetchReportFromMock(params);
    }
  }
};

// Helper functions
const buildUrlParams = (params: ApiReportParams): Record<string, string> => {
  const urlParams: Record<string, string> = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      urlParams[key] = String(value);
    }
  });
  return urlParams;
};

const fetchReportFromApi = async (params: ApiReportParams): Promise<string> => {
  try {
    const applicationSlug = params.applicationSlug || 'current';
    const endpoint = `/${applicationSlug}/${params.slug}`;
    
    const { slug, applicationSlug: _, ...queryParams } = params;
    const urlParams = buildUrlParams(queryParams as ApiReportParams);

    console.log(`🔄 Fetching report from API: ${endpoint}`, { params: urlParams });

    const response = await axiosInstance.get(endpoint, { params: urlParams });
    return response.data;
  } catch (error) {
    console.error('❌ API Error:', error);
    throw new Error(`Failed to fetch report from API: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

const fetchReportFromMock = async (params: ReportParams): Promise<string> => {
  console.log('🎭 Fetching report from mock service:', params);
  return await mockReportService.getReport(params);
};

// Connection test function
export const testConnection = async (): Promise<{ success: boolean; message: string }> => {
  if (!config.baseUrl) {
    return { success: false, message: 'No baseURL configured' };
  }

  try {
    const response = await axiosInstance.get('/health', { timeout: 5000 });
    return { success: true, message: `Connected successfully: ${response.status}` };
  } catch (error) {
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Connection failed' 
    };
  }
};

// Convenience functions
export const setupReportService = (baseUrl: string, options: Partial<ReportServiceConfig> = {}) => {
  updateConfig({
    baseUrl,
    useMockData: false,
    showBothRequests: true,
    ...options,
  });
};

export const resetToMockOnly = () => {
  updateConfig({
    useMockData: true,
    showBothRequests: false,
    baseUrl: undefined,
  });
};

// Legacy compatibility - keep the same interface
export const configureReportService = updateConfig; 