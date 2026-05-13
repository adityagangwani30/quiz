// Simplified KIADB Application Form — optimized for gameplay
export const FORM_SECTIONS = [
  {
    id: 'applicant',
    title: 'Applicant Details',
    icon: '👤',
    description: 'Primary applicant identification',
    fields: [
      { id: 'applicant_name', label: 'Full Name of Applicant', type: 'text', mandatory: true, placeholder: 'As per Aadhaar / PAN' },
      { id: 'applicant_phone', label: 'Mobile Number', type: 'text', mandatory: true, placeholder: '10-digit mobile number' },
      { id: 'applicant_address', label: 'Address', type: 'text', mandatory: true, placeholder: 'Residential address' },
      { id: 'applicant_id_number', label: 'Aadhaar / PAN Number', type: 'text', mandatory: true, placeholder: 'Identity document number' },
    ]
  },
  {
    id: 'business',
    title: 'Business Information',
    icon: '🏢',
    description: 'Company and enterprise details',
    fields: [
      { id: 'business_name', label: 'Company / Startup Name', type: 'text', mandatory: true, placeholder: 'Registered business name' },
      { id: 'business_category', label: 'Business Category', type: 'select', mandatory: true, options: ['Manufacturing', 'Services', 'IT/ITES', 'Food Processing', 'Textile', 'Chemical', 'Other'] },
      { id: 'business_product', label: 'Product / Service Description', type: 'text', mandatory: true, placeholder: 'What does the business produce?' },
      { id: 'business_gstin', label: 'GSTIN (if available)', type: 'text', mandatory: false, placeholder: '15-digit GSTIN' },
    ]
  },
  {
    id: 'land',
    title: 'Land Requirements',
    icon: '🗺️',
    description: 'Proposed industrial land details',
    fields: [
      { id: 'land_area', label: 'Total Land Area Required', type: 'text', mandatory: true, placeholder: 'e.g. 2 Acres 15 Guntas' },
      { id: 'land_location', label: 'Location (Village / Taluk / District)', type: 'text', mandatory: true, placeholder: 'e.g. Sompura, Nelamangala, Bengaluru Rural' },
      { id: 'land_survey_number', label: 'Survey Number', type: 'text', mandatory: true, placeholder: 'e.g. 45/2A' },
    ]
  },
  {
    id: 'financial',
    title: 'Financial Details',
    icon: '💰',
    description: 'Investment and banking information',
    fields: [
      { id: 'finance_investment', label: 'Total Project Investment (₹)', type: 'text', mandatory: true, placeholder: 'Total project cost' },
      { id: 'finance_bank_name', label: 'Bank Name', type: 'text', mandatory: true, placeholder: 'Primary banker name' },
      { id: 'finance_ifsc', label: 'IFSC Code', type: 'text', mandatory: false, placeholder: 'Branch IFSC code' },
    ]
  },
  {
    id: 'employment',
    title: 'Employment Projection',
    icon: '👷',
    description: 'Expected job creation details',
    fields: [
      { id: 'employment_total', label: 'Total Expected Employees', type: 'text', mandatory: true, placeholder: 'Direct + Indirect' },
      { id: 'employment_direct', label: 'Direct Employment', type: 'text', mandatory: false, placeholder: 'Number of direct jobs' },
    ]
  },
  {
    id: 'compliance',
    title: 'Compliance & Declaration',
    icon: '🌿',
    description: 'Environmental and regulatory compliance',
    fields: [
      { id: 'compliance_pollution', label: 'Pollution Category', type: 'select', mandatory: true, options: ['Green', 'White', 'Orange', 'Red'] },
      { id: 'compliance_msme', label: 'Enterprise Type (MSME)', type: 'select', mandatory: false, options: ['Micro', 'Small', 'Medium', 'Large', 'Not Applicable'] },
      { id: 'compliance_declaration', label: 'Declaration', type: 'checkbox', mandatory: true, checkboxLabel: 'I declare that all information provided is true and correct to the best of my knowledge.' },
      { id: 'compliance_terms', label: 'Terms', type: 'checkbox', mandatory: true, checkboxLabel: 'I accept the KIADB land allotment terms and conditions.' },
    ]
  }
];

export const getTotalFields = () => {
  let count = 0;
  FORM_SECTIONS.forEach(s => s.fields.forEach(f => { if (f.type !== 'checkbox') count++; }));
  return count;
};

export const getMandatoryFields = () => {
  const fields = [];
  FORM_SECTIONS.forEach(s => s.fields.forEach(f => { if (f.mandatory) fields.push(f.id); }));
  return fields;
};
