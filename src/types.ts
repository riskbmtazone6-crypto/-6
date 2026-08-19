export type CaseStatus = 'new' | 'investigating' | 'pending_approval' | 'completed' | 'overdue';

export type PriorityLevel = 'low' | 'medium' | 'high';

export type CaseCategory = 
  | 'driver_conduct'
  | 'schedule_delay'
  | 'vehicle_condition'
  | 'ticketing_issue'
  | 'route_change'
  | 'safety_violation'
  | 'other';

export type OriginatingChannel = 'hotline' | 'website' | 'social_media' | 'in_person' | 'mobile_app';

export interface Case {
  id: string; // e.g. CR-2026-00124
  subject: string;
  category: CaseCategory;
  channel: OriginatingChannel;
  priority: PriorityLevel;
  status: CaseStatus;
  
  // Complainant
  complainantName: string;
  complainantContact: string;
  complainantEmail: string;
  isAnonymous: boolean;

  // Incident Details
  busRoute: string; // e.g. "514 (Minburi - Silom)"
  vehicleId: string; // e.g. "12-3456 / Bus-8A"
  incidentTime: string; // ISO string
  incidentLocation: string; // e.g. "Ratchada Intersection"
  narrative: string;
  tags: string[];

  // Assignment & Zone
  assignedInvestigator: string; // e.g. "Kittipong N."
  assignedManager: string; // e.g. "Somchai T."
  zone: string; // e.g. "Zone 4", "Zone 6"

  // SLA & Timestamps
  slaDeadline: string; // ISO string
  createdAt: string; // ISO string
  updatedAt: string; // ISO string

  // Approval
  managerNotes?: string;
  approvalStatus?: 'pending' | 'approved' | 'revised';
  approvedAt?: string;
  approvedBy?: string;
}

export interface Evidence {
  id: string;
  caseId: string;
  fileName: string;
  fileType: 'video' | 'image' | 'document' | 'audio' | 'other';
  fileUrl?: string;
  driveFileId?: string;
  driveViewLink?: string;
  fileSize: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface TimelineEvent {
  id: string;
  caseId: string;
  title: string;
  description: string;
  type: 'created' | 'investigation' | 'evidence_added' | 'status_change' | 'manager_action' | 'note';
  timestamp: string;
  author: string;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: 'officer' | 'investigator' | 'manager' | 'admin';
  zone: string;
  avatarUrl?: string;
}

export type ActiveTab = 'dashboard' | 'complaints' | 'investigations' | 'analytics' | 'user_management' | 'settings';
export type CaseDetailTab = 'overview' | 'investigation' | 'evidence' | 'timeline' | 'approval';
