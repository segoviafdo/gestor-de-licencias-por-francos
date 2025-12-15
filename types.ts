export interface ExtractedData {
  employeeName: string;
  dni: string;
  daysRequested: string;
  generatedDate: string;
  requestedStartDate: string;
  comments: string;
}

export interface LicenseRequest {
  employeeName: string;
  daysRequested: number;
  generatedDate: string; 
  requestedStartDate: string;
  comments: string;
}

export interface AIResponse {
  formalEmail: string;
  summaryStatus: string;
  subject: string;
  extractedData?: ExtractedData;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isTyping?: boolean;
}

export enum AppStatus {
  IDLE = 'IDLE',      // Initial state
  CHATTING = 'CHATTING', // User is interacting with bot
  SUCCESS = 'SUCCESS', // Request generated
  ERROR = 'ERROR'
}