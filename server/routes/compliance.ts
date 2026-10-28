import { Router, Request, Response } from 'express';

const router = Router();

// Official AICTE Handbook Benchmark Norms
const AICTE_BENCHMARK_NORMS = {
  facultyStudentRatio: {
    engineering: '1:15',
    pharmacy: '1:15',
    management: '1:20',
    architecture: '1:10'
  },
  landRequirementAcres: {
    urban: 2.5,
    rural: 5.0,
    megaCity: 1.5
  },
  cadLabRequirement: '1 Cad Lab per 240 Intake',
  builtUpAreaSqmPerStudent: 10.5,
  safetyCertificatesRequired: ['FIRE_SAFETY_NOC', 'BUILDING_STABILITY_CERT', 'ENVIRONMENTAL_CLEARANCE']
};

/**
 * GET /api/compliance/rules
 * Get official AICTE Approval Process Handbook norms and guidelines
 */
router.get('/rules', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: AICTE_BENCHMARK_NORMS
  });
});

/**
 * POST /api/compliance/audit
 * Instant Compliance Audit Engine evaluating institution inputs against AICTE norms
 */
router.post('/audit', (req: Request, res: Response) => {
  const { totalIntake, facultyCount, totalLandAcres, cadLabsCount, fireSafetyValid, buildingSafetyValid } = req.body;

  const intake = parseInt(totalIntake || 480, 10);
  const faculty = parseInt(facultyCount || 32, 10);
  const land = parseFloat(totalLandAcres || 5.5);
  const cad = parseInt(cadLabsCount || 3, 10);

  // 1. FSR calculation
  const currentFsr = intake / Math.max(faculty, 1);
  const isFsrCompliant = currentFsr <= 15.0;
  const facultyDeficit = isFsrCompliant ? 0 : Math.ceil(intake / 15) - faculty;

  // 2. Land compliance
  const isLandCompliant = land >= 5.0;

  // 3. Cad Lab compliance
  const isCadCompliant = cad >= 3;

  // Overall compliance summary
  const totalDeficiencies = (isFsrCompliant ? 0 : 1) + 
                          (isLandCompliant ? 0 : 1) + 
                          (isCadCompliant ? 0 : 1) + 
                          (fireSafetyValid ? 0 : 1) + 
                          (buildingSafetyValid ? 0 : 1);

  const complianceStatus = totalDeficiencies === 0 ? 'FULLY_COMPLIANT' : totalDeficiencies <= 2 ? 'PARTIALLY_COMPLIANT' : 'NON_COMPLIANT';

  res.json({
    success: true,
    data: {
      status: complianceStatus,
      totalDeficiencies,
      auditDate: new Date().toISOString(),
      evaluations: {
        facultyStudentRatio: {
          current: `1:${currentFsr.toFixed(1)}`,
          requiredNorm: '1:15',
          isCompliant: isFsrCompliant,
          facultyDeficit
        },
        landInfrastructure: {
          currentAcres: land,
          requiredAcres: 5.0,
          isCompliant: isLandCompliant
        },
        cadLaboratory: {
          currentLabs: cad,
          requiredLabs: 3,
          isCompliant: isCadCompliant
        },
        safetyCertificates: {
          fireSafetyValid: !!fireSafetyValid,
          buildingSafetyValid: !!buildingSafetyValid,
          isCompliant: !!fireSafetyValid && !!buildingSafetyValid
        }
      }
    }
  });
});

export default router;
