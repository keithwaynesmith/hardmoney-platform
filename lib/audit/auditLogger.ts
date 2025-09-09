interface AuditEvent {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  outcome: 'success' | 'failure' | 'pending';
}

class AuditLogger {
  private static instance: AuditLogger;
  private events: AuditEvent[] = [];

  private constructor() {}

  public static getInstance(): AuditLogger {
    if (!AuditLogger.instance) {
      AuditLogger.instance = new AuditLogger();
    }
    return AuditLogger.instance;
  }

  public log(event: Omit<AuditEvent, 'id' | 'timestamp'>): void {
    const auditEvent: AuditEvent = {
      ...event,
      id: this.generateId(),
      timestamp: new Date(),
    };

    this.events.push(auditEvent);
    
    // In a real application, this would send to your logging service
    console.log('Audit Event:', auditEvent);
    
    // Send to external logging service (e.g., Splunk, DataDog, etc.)
    this.sendToExternalService(auditEvent);
  }

  public getUserEvents(userId: string, limit: number = 100): AuditEvent[] {
    return this.events
      .filter(event => event.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  public getResourceEvents(resource: string, resourceId?: string, limit: number = 100): AuditEvent[] {
    return this.events
      .filter(event => 
        event.resource === resource && 
        (!resourceId || event.resourceId === resourceId)
      )
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  public getEventsBySeverity(severity: string, limit: number = 100): AuditEvent[] {
    return this.events
      .filter(event => event.severity === severity)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  public getEventsByDateRange(startDate: Date, endDate: Date, limit: number = 100): AuditEvent[] {
    return this.events
      .filter(event => 
        event.timestamp >= startDate && event.timestamp <= endDate
      )
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  public searchEvents(query: string, limit: number = 100): AuditEvent[] {
    const lowercaseQuery = query.toLowerCase();
    return this.events
      .filter(event => 
        event.action.toLowerCase().includes(lowercaseQuery) ||
        event.resource.toLowerCase().includes(lowercaseQuery) ||
        JSON.stringify(event.details).toLowerCase().includes(lowercaseQuery)
      )
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  public getStatistics(): {
    totalEvents: number;
    eventsBySeverity: Record<string, number>;
    eventsByAction: Record<string, number>;
    eventsByOutcome: Record<string, number>;
    recentActivity: number;
  } {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const eventsBySeverity = this.events.reduce((acc, event) => {
      acc[event.severity] = (acc[event.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const eventsByAction = this.events.reduce((acc, event) => {
      acc[event.action] = (acc[event.action] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const eventsByOutcome = this.events.reduce((acc, event) => {
      acc[event.outcome] = (acc[event.outcome] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const recentActivity = this.events.filter(
      event => event.timestamp >= oneDayAgo
    ).length;

    return {
      totalEvents: this.events.length,
      eventsBySeverity,
      eventsByAction,
      eventsByOutcome,
      recentActivity,
    };
  }

  private generateId(): string {
    return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async sendToExternalService(event: AuditEvent): Promise<void> {
    try {
      // In a real application, this would send to your logging service
      // Examples: Splunk, DataDog, CloudWatch, etc.
      
      // For now, we'll just simulate an API call
      await fetch('/api/audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });
    } catch (error) {
      console.error('Failed to send audit event to external service:', error);
    }
  }
}

// Predefined audit actions for consistency
export const AuditActions = {
  // Authentication
  LOGIN: 'user.login',
  LOGOUT: 'user.logout',
  LOGIN_FAILED: 'user.login_failed',
  PASSWORD_CHANGE: 'user.password_change',
  PASSWORD_RESET: 'user.password_reset',
  TWO_FACTOR_ENABLE: 'user.2fa_enable',
  TWO_FACTOR_DISABLE: 'user.2fa_disable',

  // Deal Management
  DEAL_CREATE: 'deal.create',
  DEAL_UPDATE: 'deal.update',
  DEAL_DELETE: 'deal.delete',
  DEAL_APPROVE: 'deal.approve',
  DEAL_REJECT: 'deal.reject',
  DEAL_FUND: 'deal.fund',

  // Investment Management
  INVESTMENT_CREATE: 'investment.create',
  INVESTMENT_UPDATE: 'investment.update',
  INVESTMENT_CANCEL: 'investment.cancel',
  INVESTMENT_APPROVE: 'investment.approve',
  INVESTMENT_REJECT: 'investment.reject',

  // Document Management
  DOCUMENT_UPLOAD: 'document.upload',
  DOCUMENT_DOWNLOAD: 'document.download',
  DOCUMENT_DELETE: 'document.delete',
  DOCUMENT_VIEW: 'document.view',

  // Payment Processing
  PAYMENT_INITIATE: 'payment.initiate',
  PAYMENT_COMPLETE: 'payment.complete',
  PAYMENT_FAIL: 'payment.fail',
  PAYMENT_REFUND: 'payment.refund',

  // Administrative
  USER_CREATE: 'admin.user_create',
  USER_UPDATE: 'admin.user_update',
  USER_DELETE: 'admin.user_delete',
  USER_SUSPEND: 'admin.user_suspend',
  USER_ACTIVATE: 'admin.user_activate',
  SYSTEM_CONFIG_UPDATE: 'admin.system_config_update',

  // Security
  SUSPICIOUS_ACTIVITY: 'security.suspicious_activity',
  UNAUTHORIZED_ACCESS: 'security.unauthorized_access',
  DATA_EXPORT: 'security.data_export',
  DATA_IMPORT: 'security.data_import',
} as const;

// Helper function to create audit events
export function createAuditEvent(
  userId: string,
  action: string,
  resource: string,
  details: Record<string, any> = {},
  options: {
    resourceId?: string;
    ipAddress?: string;
    userAgent?: string;
    severity?: 'low' | 'medium' | 'high' | 'critical';
    outcome?: 'success' | 'failure' | 'pending';
  } = {}
): void {
  const logger = AuditLogger.getInstance();
  
  logger.log({
    userId,
    action,
    resource,
    resourceId: options.resourceId,
    details,
    ipAddress: options.ipAddress || 'unknown',
    userAgent: options.userAgent || 'unknown',
    severity: options.severity || 'low',
    outcome: options.outcome || 'success',
  });
}

export default AuditLogger;

