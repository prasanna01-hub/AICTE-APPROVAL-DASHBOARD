-- =========================================================================================
-- REPEATABLE SEED DATA FOR AICTE APPROVAL & COMPLIANCE AUTOMATION SYSTEM
-- =========================================================================================

-- 1. Insert Roles & Permissions
INSERT INTO roles (name, description) VALUES
('ADMINISTRATOR', 'Full system access and compliance oversight'),
('INSTITUTION_USER', 'Institutional applicant (Principal/Director)'),
('REVIEWING_OFFICIAL', 'AICTE Regional Officer & Scrutiny Board member'),
('EVC_COORDINATOR', 'Expert Visit Committee Inspection Coordinator')
ON CONFLICT (name) DO NOTHING;

-- 2. Seed Users
INSERT INTO users (username, email, password_hash, role, institution_id) VALUES
('admin_aicte', 'admin@aicte-india.org', 'scrypt_hashed_admin_pass_2026', 'ADMINISTRATOR', NULL),
('principal_apex', 'principal@apextech.edu.in', 'scrypt_hashed_apex_pass_2026', 'INSTITUTION_USER', 1),
('ro_viswanathan', 'ro.southern@aicte-india.org', 'scrypt_hashed_ro_pass_2026', 'REVIEWING_OFFICIAL', NULL),
('evc_coord_ananya', 'evc.coord@aicte-india.org', 'scrypt_hashed_evc_pass_2026', 'EVC_COORDINATOR', NULL)
ON CONFLICT (username) DO NOTHING;

-- 3. Seed Institutions
INSERT INTO institutions (id, aicte_permanent_id, name, state, region, category, institution_type, total_approved_intake, faculty_count, total_land_acres, cad_labs_count) VALUES
(1, '1-109283741', 'Apex Institute of Technology & Engineering', 'Tamil Nadu', 'Southern', 'Engineering & Technology', 'PRIVATE_SELF_FINANCING', 480, 32, 5.5, 4),
(2, '1-982736452', 'National College of Pharmacy & Research', 'Karnataka', 'South-Western', 'Pharmacy', 'PRIVATE_SELF_FINANCING', 240, 14, 2.2, 2),
(3, '1-554129038', 'Central Institute of Management', 'Maharashtra', 'Western', 'Management', 'GOVT_AIDED', 300, 20, 4.0, 3)
ON CONFLICT (id) DO NOTHING;

-- 4. Seed Applications
INSERT INTO applications (id, application_number, institution_id, academic_year, approval_type, current_stage, status) VALUES
(1, 'APP-2026-8912', 1, '2024-2025', 'Extension of Approval (EoA)', 'REGIONAL_SCRUTINY', 'IN_PROGRESS'),
(2, 'APP-2026-4410', 2, '2024-2025', 'New Course Addition (B.Pharm Data Analytics)', 'EVC_INSPECTION', 'IN_PROGRESS'),
(3, 'APP-2026-1029', 3, '2024-2025', 'Increase in Approved Intake', 'SUBMITTED', 'IN_PROGRESS')
ON CONFLICT (id) DO NOTHING;

-- 5. Seed Handbook 2024-2027 Compliance Rules (With Source Citations)
INSERT INTO compliance_rules (id, rule_code, title, category, source_handbook, source_section, applicable_year, is_verified_official, threshold_value, threshold_unit, severity_level) VALUES
(1, 'RULE-FSR-115', 'Faculty-Student Ratio Compliance', 'FACULTY_RATIO', 'AICTE Approval Process Handbook 2024-2027', 'Section 2.4.1 (Cadre Ratio & FSR)', '2024-2027', TRUE, 15.0, 'Ratio (1:15)', 'CRITICAL'),
(2, 'RULE-LAND-05', 'Minimum Land Infrastructure Norm', 'LAND_INFRASTRUCTURE', 'AICTE Approval Process Handbook 2024-2027', 'Appendix 4.1 (Land Norms for Rural/Urban)', '2024-2027', TRUE, 5.0, 'Acres', 'HIGH'),
(3, 'RULE-CAD-03', 'CAD/CAM Laboratory Requirement', 'CAD_LAB', 'AICTE Approval Process Handbook 2024-2027', 'Appendix 5.2 (Laboratory Equipment)', '2024-2027', TRUE, 3.0, 'Count', 'MEDIUM'),
(4, 'RULE-NOC-FIRE', 'Fire Safety Certificate NOC Validity', 'SAFETY_NOC', 'AICTE Approval Process Handbook 2024-2027', 'Section 1.8.2 (Mandatory Safety Certificates)', '2024-2027', TRUE, 1.0, 'Valid Certificate', 'CRITICAL'),
(5, 'RULE-NOC-BLDG', 'Building Stability Certificate Validity', 'SAFETY_NOC', 'AICTE Approval Process Handbook 2024-2027', 'Section 1.8.3 (PWD/Chartered Engineer NOC)', '2024-2027', TRUE, 1.0, 'Valid Certificate', 'HIGH')
ON CONFLICT (id) DO NOTHING;

-- 6. Seed Documents
INSERT INTO documents (id, application_id, institution_id, document_type, file_name, file_path, file_size_bytes, checksum_sha256, valid_from, expiry_date, verification_status) VALUES
(1, 1, 1, 'LAND_NOC', 'Apex_Institute_Land_NOC_2026.pdf', './uploads/documents/Apex_Institute_Land_NOC_2026.pdf', 2450000, 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', '2024-01-01', '2029-12-31', 'VERIFIED'),
(2, 1, 1, 'FIRE_SAFETY_NOC', 'Fire_Safety_NOC_Renewal_2026.pdf', './uploads/documents/Fire_Safety_NOC_Renewal_2026.pdf', 1820000, 'a2f981249c12b3991209e812ab34d2819230e3812903120b3921092309102931', '2023-11-01', '2026-11-15', 'VERIFIED'),
(3, 2, 2, 'FIRE_SAFETY_NOC', 'Pharmacy_Fire_NOC_Expired.pdf', './uploads/documents/Pharmacy_Fire_NOC_Expired.pdf', 1100000, '991209e812ab34d2819230e3812903120b3921092309102931a2f981249c12b3', '2021-05-01', '2026-05-01', 'EXPIRED')
ON CONFLICT (id) DO NOTHING;

-- 7. Seed EVC Schedules
INSERT INTO evc_schedules (id, application_id, institution_id, scheduled_date, venue_address, assigned_experts, evc_status, preparation_checklist_completed) VALUES
(1, 2, 2, '2026-11-10 10:00:00+00', 'National College of Pharmacy, Campus Hall A, Bengaluru', 'Prof. H. R. Nagendra, Dr. Priya Swaminathan', 'SCHEDULED', FALSE)
ON CONFLICT (id) DO NOTHING;

-- 8. Seed Alerts
INSERT INTO alerts (id, application_id, institution_id, title, message, severity, reason, recommended_action, status, deduplication_hash) VALUES
(1, 2, 2, 'Critical: Fire Safety NOC Expired for Application APP-2026-4410', 'The submitted Fire Safety NOC Certificate expired on 2026-05-01. EVC inspection cannot proceed until a valid certificate is uploaded.', 'CRITICAL', 'EXPIRED_DOCUMENT', 'Upload renewed Fire Safety Certificate issued by State Fire Department.', 'ACTIVE', 'HASH-EXPIRED-FIRE-DOC-2')
ON CONFLICT (id) DO NOTHING;
