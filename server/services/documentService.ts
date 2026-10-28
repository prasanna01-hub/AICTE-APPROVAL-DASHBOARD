import crypto from 'crypto';

export interface DocumentRecord {
  id: number;
  applicationId: number;
  institutionId: number;
  documentType: string;
  fileName: string;
  filePath: string;
  fileSizeBytes: number;
  fileMimeType: string;
  checksumSha256: string;
  uploadDate: string;
  validFrom?: string;
  expiryDate?: string;
  verificationStatus: 'PENDING_VERIFICATION' | 'VERIFIED' | 'EXPIRED' | 'REJECTED';
}

class DocumentService {
  private documentsStore: DocumentRecord[] = [
    {
      id: 1,
      applicationId: 1,
      institutionId: 1,
      documentType: 'LAND_NOC',
      fileName: 'Apex_Institute_Land_NOC_2026.pdf',
      filePath: './uploads/documents/Apex_Institute_Land_NOC_2026.pdf',
      fileSizeBytes: 2450000,
      fileMimeType: 'application/pdf',
      checksumSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      uploadDate: new Date(Date.now() - 86400000 * 30).toISOString(),
      validFrom: '2024-01-01',
      expiryDate: '2029-12-31',
      verificationStatus: 'VERIFIED'
    },
    {
      id: 2,
      applicationId: 1,
      institutionId: 1,
      documentType: 'FIRE_SAFETY_NOC',
      fileName: 'Fire_Safety_NOC_Renewal_2026.pdf',
      filePath: './uploads/documents/Fire_Safety_NOC_Renewal_2026.pdf',
      fileSizeBytes: 1820000,
      fileMimeType: 'application/pdf',
      checksumSha256: 'a2f981249c12b3991209e812ab34d2819230e3812903120b3921092309102931',
      uploadDate: new Date(Date.now() - 86400000 * 15).toISOString(),
      validFrom: '2023-11-01',
      expiryDate: '2026-11-15',
      verificationStatus: 'VERIFIED'
    },
    {
      id: 3,
      applicationId: 2,
      institutionId: 2,
      documentType: 'FIRE_SAFETY_NOC',
      fileName: 'Pharmacy_Fire_NOC_Expired.pdf',
      filePath: './uploads/documents/Pharmacy_Fire_NOC_Expired.pdf',
      fileSizeBytes: 1100000,
      fileMimeType: 'application/pdf',
      checksumSha256: '991209e812ab34d2819230e3812903120b3921092309102931a2f981249c12b3',
      uploadDate: new Date(Date.now() - 86400000 * 100).toISOString(),
      validFrom: '2021-05-01',
      expiryDate: '2026-05-01',
      verificationStatus: 'EXPIRED'
    }
  ];

  public getDocumentsForApplication(applicationId: number): DocumentRecord[] {
    return this.documentsStore.filter(d => d.applicationId === applicationId);
  }

  /**
   * Monitor document validity and identify missing or expired required documents
   */
  public monitorDocumentExpiry(applicationId: number): {
    missingDocuments: string[];
    expiredDocuments: DocumentRecord[];
    soonToExpireDocuments: DocumentRecord[];
    verifiedDocuments: DocumentRecord[];
  } {
    const requiredTypes = ['LAND_NOC', 'FIRE_SAFETY_NOC', 'BUILDING_SAFETY', 'FACULTY_CADRE_MATRIX'];
    const docs = this.getDocumentsForApplication(applicationId);

    const uploadedTypes = docs.map(d => d.documentType);
    const missingDocuments = requiredTypes.filter(t => !uploadedTypes.includes(t));

    const now = new Date();
    const thirtyDaysAhead = new Date(now.getTime() + 86400000 * 30);

    const expiredDocuments: DocumentRecord[] = [];
    const soonToExpireDocuments: DocumentRecord[] = [];
    const verifiedDocuments: DocumentRecord[] = [];

    docs.forEach(doc => {
      if (!doc.expiryDate) {
        verifiedDocuments.push(doc);
        return;
      }

      const expiry = new Date(doc.expiryDate);
      if (expiry < now) {
        doc.verificationStatus = 'EXPIRED';
        expiredDocuments.push(doc);
      } else if (expiry <= thirtyDaysAhead) {
        soonToExpireDocuments.push(doc);
      } else {
        verifiedDocuments.push(doc);
      }
    });

    return {
      missingDocuments,
      expiredDocuments,
      soonToExpireDocuments,
      verifiedDocuments
    };
  }

  /**
   * Safe document register simulation
   */
  public registerDocument(docData: Omit<DocumentRecord, 'id' | 'checksumSha256' | 'uploadDate'>): DocumentRecord {
    const checksumSha256 = crypto.createHash('sha256').update(docData.fileName + Date.now()).digest('hex');
    const newDoc: DocumentRecord = {
      ...docData,
      id: this.documentsStore.length + 1,
      checksumSha256,
      uploadDate: new Date().toISOString()
    };
    this.documentsStore.push(newDoc);
    return newDoc;
  }
}

export const documentService = new DocumentService();
