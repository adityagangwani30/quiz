import { CORRECT_ANSWERS } from './documents';
import { FORM_SECTIONS, getMandatoryFields } from './formSections';

export function calculateScore(formData, timeRemaining, totalTime) {
  const accuracyScore = calculateAccuracy(formData);
  const completionScore = calculateCompletion(formData);
  const speedScore = calculateSpeed(timeRemaining, totalTime);
  const finalScore = Math.round((accuracyScore * 0.5) + (completionScore * 0.3) + (speedScore * 0.2));
  return {
    finalScore: Math.min(100, Math.max(0, finalScore)),
    accuracy: Math.round(accuracyScore),
    completion: Math.round(completionScore),
    speedBonus: Math.round(speedScore),
    timeRemaining,
    details: {
      correctFields: getCorrectFieldCount(formData),
      totalFieldsFilled: getFilledFieldCount(formData),
      totalFields: getTotalFieldCount(),
      mandatoryFilled: getMandatoryFilledCount(formData),
      totalMandatory: getMandatoryFields().length,
    }
  };
}

function normalizeValue(val) {
  if (!val) return '';
  return String(val).trim().toLowerCase()
    .replace(/[₹,.\-/]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function stripAll(val) {
  if (!val) return '';
  return String(val).toLowerCase().replace(/[^a-z0-9]/g, '');
}

function fuzzyMatch(answer, correct) {
  if (!answer || !correct) return 0;
  
  const aClean = stripAll(answer);
  const cClean = stripAll(correct);
  
  if (!aClean) return 0;
  if (aClean === cClean) return 1;
  if (cClean.includes(aClean) || aClean.includes(cClean)) return 0.8;
  
  const a = normalizeValue(answer), c = normalizeValue(correct);
  const cp = c.split(' '), ap = a.split(' ');
  let m = 0;
  cp.forEach(p => { if (p.length > 2 && ap.some(x => x.includes(p) || p.includes(x))) m++; });
  const validParts = cp.filter(p => p.length > 2).length;
  if (validParts > 0) { const r = m / validParts; if (r > 0.5) return r * 0.8; }
  return 0;
}

function calculateAccuracy(formData) {
  let total = 0, filledCount = 0;
  Object.entries(CORRECT_ANSWERS).forEach(([k, v]) => { 
    if (formData[k] && String(formData[k]).trim() !== '') {
      filledCount++; 
      total += fuzzyMatch(formData[k], v); 
    }
  });
  
  const rawAccuracy = filledCount > 0 ? (total / filledCount) * 100 : 0;
  return Math.min(100, Math.max(0, rawAccuracy));
}

function calculateCompletion(formData) {
  const filled = getFilledFieldCount(formData), total = getTotalFieldCount();
  const mandatoryFields = getMandatoryFields();
  let mf = 0;
  mandatoryFields.forEach(id => { if (formData[id] && String(formData[id]).trim()) mf++; });
  return (filled / total) * 60 + (mandatoryFields.length > 0 ? (mf / mandatoryFields.length) * 40 : 40);
}

function calculateSpeed(timeRemaining, totalTime) {
  return timeRemaining <= 0 ? 0 : (timeRemaining / totalTime) * 100;
}

function getCorrectFieldCount(formData) {
  let c = 0;
  Object.entries(CORRECT_ANSWERS).forEach(([k, v]) => { if (formData[k] && fuzzyMatch(formData[k], v) >= 0.7) c++; });
  return c;
}

function getFilledFieldCount(formData) {
  let f = 0;
  FORM_SECTIONS.forEach(s => s.fields.forEach(field => {
    if (field.type === 'checkbox') { if (formData[field.id]) f++; }
    else { if (formData[field.id] && String(formData[field.id]).trim()) f++; }
  }));
  return f;
}

function getTotalFieldCount() {
  let t = 0;
  FORM_SECTIONS.forEach(s => { t += s.fields.length; });
  return t;
}

function getMandatoryFilledCount(formData) {
  let f = 0;
  getMandatoryFields().forEach(id => { if (formData[id] && String(formData[id]).trim()) f++; });
  return f;
}

export function getSubmissionStatus(score) {
  if (score >= 80) return { status: 'Application Approved', color: '#22c55e', icon: '✅' };
  if (score >= 60) return { status: 'Under Review', color: '#f59e0b', icon: '🔄' };
  if (score >= 40) return { status: 'Compliance Pending', color: '#f97316', icon: '⚠️' };
  return { status: 'Application Rejected', color: '#ef4444', icon: '❌' };
}
