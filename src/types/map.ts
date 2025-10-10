export type LayerType =
  | 'all'
  | 'accommodation'
  | 'waterStation'
  | 'restroom'
  | 'showerStation'
  | 'medicalStation'
  | 'shuttle'
  | 'disaster';

export interface UserPosition {
  lat: number;
  lng: number;
}

// TODO:
export interface HelpRequestData {
  peopleNeeded: number;
  type: string;
  urgency: string;
  contactPerson: string;
  contactPhone: string;
  location: string;
  description: string;
  coordinates?: UserPosition;
  timestamp: string;
}

export interface IssueReportData {
  location_type: string;
  location_id: string;
  name: string;
  reason: string;
  status: string;
}
