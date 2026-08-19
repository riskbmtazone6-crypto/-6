import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth } from './firebase';
import { Case } from '../types';

export const SCOPES = [
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/spreadsheets',
];

const provider = new GoogleAuthProvider();
SCOPES.forEach(scope => provider.addScope(scope));

let isSigningIn = false;
let cachedAccessToken: string | null = null;

// Initialize auth state listener
export const initAuth = (
  onAuthSuccess?: (user: User, token: string | null) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// Google Sign-In with popup
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      // In some environments, credential might be minimal, store token or return user
      console.warn('No access token returned directly in credential');
    }
    cachedAccessToken = credential?.accessToken || null;
    return { user: result.user, accessToken: cachedAccessToken || '' };
  } catch (error: unknown) {
    console.error('Google Sign in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logout = async () => {
  await auth.signOut();
  cachedAccessToken = null;
};

// --- Google Sheets Integration ---

export interface ExportResult {
  spreadsheetId: string;
  spreadsheetUrl: string;
  rowCount: number;
}

export async function exportCasesToGoogleSheets(
  cases: Case[], 
  sheetTitle: string = `BMTA_CMS_Report_${new Date().toISOString().slice(0, 10)}`
): Promise<ExportResult> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Google Authentication required. Please Sign in with Google to export to Google Sheets.');
  }

  // 1. Create a new Spreadsheet
  const createResponse = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title: sheetTitle,
      },
      sheets: [
        {
          properties: {
            title: 'Complaints & SLA',
            gridProperties: {
              frozenRowCount: 1,
            },
          },
        },
      ],
    }),
  });

  if (!createResponse.ok) {
    const err = await createResponse.json();
    throw new Error(err.error?.message || 'Failed to create Google Spreadsheet');
  }

  const sheetData = await createResponse.json();
  const spreadsheetId = sheetData.spreadsheetId;
  const spreadsheetUrl = sheetData.spreadsheetUrl;

  // 2. Prepare headers and rows
  const headers = [
    'Case ID',
    'Subject (หัวข้อเรื่องร้องเรียน)',
    'Status (สถานะ)',
    'Priority (ความสำคัญ)',
    'Category (หมวดหมู่)',
    'Bus Route (สายรถเมล์)',
    'Vehicle ID (เบอร์รถ)',
    'Complainant (ผู้ร้องเรียน)',
    'Contact (เบอร์ติดต่อ)',
    'Incident Location (สถานที่เกิดเหตุ)',
    'Incident Date/Time (วันเวลาเกิดเหตุ)',
    'SLA Deadline (กำหนดเวลา SLA)',
    'Assigned Investigator (ผู้รับผิดชอบ)',
    'Zone (เขตการเดินรถ)',
    'Originating Channel (ช่องทางรับเรื่อง)',
    'Created Date (วันที่บันทึก)',
  ];

  const rows = cases.map(c => [
    c.id,
    c.subject,
    c.status.toUpperCase(),
    c.priority.toUpperCase(),
    c.category.replace('_', ' ').toUpperCase(),
    c.busRoute || '-',
    c.vehicleId || '-',
    c.isAnonymous ? 'Anonymous (ไม่ประสงค์ออกนาม)' : c.complainantName,
    c.isAnonymous ? '-' : c.complainantContact,
    c.incidentLocation || '-',
    c.incidentTime ? new Date(c.incidentTime).toLocaleString('th-TH') : '-',
    c.slaDeadline ? new Date(c.slaDeadline).toLocaleString('th-TH') : '-',
    c.assignedInvestigator || '-',
    c.zone || 'Zone 4',
    c.channel || 'hotline',
    c.createdAt ? new Date(c.createdAt).toLocaleString('th-TH') : '-',
  ]);

  // 3. Append Data
  const appendResponse = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Complaints%20%26%20SLA!A1:P${rows.length + 1}?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        range: `Complaints & SLA!A1:P${rows.length + 1}`,
        majorDimension: 'ROWS',
        values: [headers, ...rows],
      }),
    }
  );

  if (!appendResponse.ok) {
    const err = await appendResponse.json();
    throw new Error(err.error?.message || 'Failed to populate spreadsheet data');
  }

  return {
    spreadsheetId,
    spreadsheetUrl: spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
    rowCount: rows.length,
  };
}

// --- Google Drive Integration ---

export interface DriveUploadResult {
  fileId: string;
  name: string;
  webViewLink?: string;
  webContentLink?: string;
}

export async function uploadEvidenceToDrive(
  file: File,
  caseId: string
): Promise<DriveUploadResult> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Google Authentication required. Please Sign in with Google to upload to Google Drive.');
  }

  const metadata = {
    name: `[${caseId}] ${file.name}`,
    description: `BMTA Case Evidence for ${caseId}`,
  };

  const form = new FormData();
  form.append(
    'metadata',
    new Blob([JSON.stringify(metadata)], { type: 'application/json' })
  );
  form.append('file', file);

  const response = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,webContentLink',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: form,
    }
  );

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || 'Failed to upload file to Google Drive');
  }

  const data = await response.json();
  return {
    fileId: data.id,
    name: data.name,
    webViewLink: data.webViewLink,
    webContentLink: data.webContentLink,
  };
}

// Delete file from Google Drive (Mandatory explicit user confirmation required by skill)
export async function deleteDriveFileWithConfirm(fileId: string, fileName: string): Promise<boolean> {
  const token = await getAccessToken();
  if (!token) return false;

  const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  return response.ok;
}
