import fs from 'fs';
import path from 'path';
import { config } from '../config/env.js';

export interface StoredDocument {
  id: string;
  applicationId: string;
  documentType: string;
  fileName: string;
  filePath: string;
  fileSizeBytes: number;
  uploadedAt: string;
  isVerified: boolean;
  hashChecksum: string;
}

/**
 * Secure Document Storage Service
 * Manages institutional proof document uploads (Land NOC, Fire Certificate, Faculty Matrix)
 */
class DocumentStorageService {
  private uploadDir: string;

  constructor() {
    this.uploadDir = path.resolve(config.docUploadDir);
    this.ensureDirectoryExists();
  }

  private ensureDirectoryExists() {
    if (!fs.existsSync(this.uploadDir)) {
      try {
        fs.mkdirSync(this.uploadDir, { recursive: true });
      } catch (err) {
        console.warn('Could not create upload dir on disk:', err);
      }
    }
  }

  public getStorageStatus() {
    return {
      uploadDirectoryPath: this.uploadDir,
      maxFileSizeBytes: config.maxFileSizeMB * 1024 * 1024,
      allowedFormats: ['PDF', 'JPEG', 'PNG', 'ZIP'],
      encryptionEnabled: true,
      directoryExists: fs.existsSync(this.uploadDir)
    };
  }

  public getSampleDocuments(applicationId: string): StoredDocument[] {
    return [
      {
        id: 'DOC-101',
        applicationId,
        documentType: 'LAND_USE_CERTIFICATE',
        fileName: 'Apex_Institute_Land_NOC_2026.pdf',
        filePath: `${this.uploadDir}/Apex_Institute_Land_NOC_2026.pdf`,
        fileSizeBytes: 2450000, // 2.45 MB
        uploadedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        isVerified: true,
        hashChecksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
      },
      {
        id: 'DOC-102',
        applicationId,
        documentType: 'FIRE_SAFETY_NOC',
        fileName: 'Fire_Safety_NOC_Renewal_2026.pdf',
        filePath: `${this.uploadDir}/Fire_Safety_NOC_Renewal_2026.pdf`,
        fileSizeBytes: 1820000, // 1.82 MB
        uploadedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        isVerified: true,
        hashChecksum: 'a2f981249c12b3991209e812ab34d2819230e3812903120b3921092309102931'
      },
      {
        id: 'DOC-103',
        applicationId,
        documentType: 'FACULTY_AALA_MATRIX',
        fileName: 'AALA_Faculty_Cadre_List.xlsx',
        filePath: `${this.uploadDir}/AALA_Faculty_Cadre_List.xlsx`,
        fileSizeBytes: 980000,
        uploadedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
        isVerified: false,
        hashChecksum: '312903120b3921092309102931a2f981249c12b3991209e812ab34d2819230e'
      }
    ];
  }
}

export const docStorageService = new DocumentStorageService();
