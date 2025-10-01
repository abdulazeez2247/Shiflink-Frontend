
export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  inApp: boolean;
  reminderDays: number[];
}

export interface NotificationData {
  credentialId: string;
  credentialName: string;
  daysUntilExpiry: number;
  criticality: 'low' | 'medium' | 'high' | 'critical';
  type: 'reminder' | 'expired' | 'renewed';
}

class NotificationService {
  private static instance: NotificationService;
  private notifications: NotificationData[] = [];

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async sendEmailNotification(data: NotificationData, userEmail: string): Promise<boolean> {
    // In a real app, this would integrate with an email service
    console.log('Sending email notification:', {
      to: userEmail,
      subject: this.getEmailSubject(data),
      body: this.getEmailBody(data)
    });
    
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 1000);
    });
  }

  async sendSMSNotification(data: NotificationData, phoneNumber: string): Promise<boolean> {
    // In a real app, this would integrate with an SMS service
    console.log('Sending SMS notification:', {
      to: phoneNumber,
      message: this.getSMSMessage(data)
    });
    
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 1000);
    });
  }

  sendInAppNotification(data: NotificationData, toastFunction: (notification: any) => void): void {
    const notification = {
      title: this.getInAppTitle(data),
      description: this.getInAppDescription(data),
      variant: data.criticality === 'critical' ? 'destructive' : 'default'
    };
    
    toastFunction(notification);
  }

  private getEmailSubject(data: NotificationData): string {
    if (data.type === 'expired') {
      return `URGENT: ${data.credentialName} has expired`;
    }
    return `Reminder: ${data.credentialName} expires in ${data.daysUntilExpiry} days`;
  }

  private getEmailBody(data: NotificationData): string {
    const urgencyText = data.criticality === 'critical' ? 'CRITICAL: ' : '';
    
    if (data.type === 'expired') {
      return `${urgencyText}Your ${data.credentialName} has expired and needs immediate attention. Please renew as soon as possible to maintain compliance.`;
    }
    
    return `${urgencyText}Your ${data.credentialName} will expire in ${data.daysUntilExpiry} day${data.daysUntilExpiry !== 1 ? 's' : ''}. Please plan for renewal to avoid any disruption in your ability to work.`;
  }

  private getSMSMessage(data: NotificationData): string {
    if (data.type === 'expired') {
      return `URGENT: ${data.credentialName} has expired. Renew immediately.`;
    }
    return `${data.credentialName} expires in ${data.daysUntilExpiry} days. Plan renewal soon.`;
  }

  private getInAppTitle(data: NotificationData): string {
    if (data.type === 'expired') {
      return 'Credential Expired';
    }
    return 'Credential Expiring Soon';
  }

  private getInAppDescription(data: NotificationData): string {
    if (data.type === 'expired') {
      return `${data.credentialName} has expired`;
    }
    return `${data.credentialName} expires in ${data.daysUntilExpiry} day${data.daysUntilExpiry !== 1 ? 's' : ''}`;
  }

  scheduleNotifications(credentials: any[], preferences: NotificationPreferences): void {
    // This would typically integrate with a job scheduler or cron service
    console.log('Scheduling notifications for', credentials.length, 'credentials');
    
    credentials.forEach(credential => {
      preferences.reminderDays.forEach(days => {
        if (credential.daysUntilExpiry === days) {
          const notificationData: NotificationData = {
            credentialId: credential.id,
            credentialName: credential.name,
            daysUntilExpiry: credential.daysUntilExpiry,
            criticality: credential.criticality,
            type: credential.daysUntilExpiry <= 0 ? 'expired' : 'reminder'
          };
          
          this.notifications.push(notificationData);
        }
      });
    });
  }

  getScheduledNotifications(): NotificationData[] {
    return this.notifications;
  }

  clearNotifications(): void {
    this.notifications = [];
  }
}

export default NotificationService;
