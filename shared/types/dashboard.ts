/**
 * Dashboard API response types
 */

export interface DashboardMetrics {
  pageViews: number
  uniqueVisitors: number
  sessionDuration: number // in seconds
  bounceRate: number // percentage 0-100
  pageViewsTrend: number // percentage change vs previous period
  visitorsTrend: number // percentage change
  sessionDurationTrend: number // percentage change
  bounceRateTrend: number // percentage change
}

export interface ChartDataPoint {
  date: string // ISO date or formatted date
  value: number
}

export interface PageViewsData {
  data: ChartDataPoint[]
}

export interface VisitorsData {
  data: ChartDataPoint[]
}

export interface TopPage {
  url: string
  views: number
  percentage: number
}

export interface TopPagesData {
  pages: TopPage[]
}

export interface Referrer {
  source: string
  visits: number
}

export interface ReferrerData {
  referrers: Referrer[]
}

export interface DeviceStats {
  type: 'mobile' | 'desktop' | 'tablet'
  count: number
  percentage: number
}

export interface DeviceDistributionData {
  devices: DeviceStats[]
}

export interface LocationData {
  country: string
  city: string
  visitors: number
  percentage: number
}

export interface TopLocationsData {
  locations: LocationData[]
}

/**
 * Dashboard aggregated response (all data at once)
 */
export interface DashboardData {
  metrics: DashboardMetrics
  pageViewsChart: PageViewsData
  visitorsChart: VisitorsData
  topPages: TopPagesData
  referrers: ReferrerData
  devices: DeviceDistributionData
  locations: TopLocationsData
  lastUpdated: string // ISO timestamp
}
