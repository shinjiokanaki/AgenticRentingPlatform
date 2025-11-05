import type { Property, TenantPassport } from "./schema";

export type MatchCategory = "0-25%" | "26-50%" | "51-75%" | "76-100%";
export type MatchLabel = "Poor" | "Fair" | "Good" | "Excellent";

export interface MatchScore {
  percentage: number;
  category: MatchCategory;
  label: MatchLabel;
  score: number; // 0-100
  metCount: number;
  totalCount: number;
  reasons: string[];
  gaps: string[];
}

/**
 * Calculate match percentage based on must-haves and red flags alignment
 * @param tenantMustHaves Array of tenant's must-haves
 * @param tenantRedFlags Array of tenant's red flags (deal breakers)
 * @param propertyMustHaves Array of property's must-haves (landlord requirements)
 * @param propertyRedFlags Array of property's red flags (landlord deal breakers)
 * @param propertyFeatures Object of property features
 * @param tenantProfile Object of tenant profile data
 */
export function calculateMatchPercentage(
  tenantMustHaves: string[],
  tenantRedFlags: string[],
  propertyMustHaves: string[],
  propertyRedFlags: string[],
  propertyFeatures: Record<string, any>,
  tenantProfile: Record<string, any>
): MatchScore {
  const reasons: string[] = [];
  const gaps: string[] = [];
  
  let metCount = 0;
  let totalCount = 0;
  
  // Check tenant must-haves against property features
  for (const mustHave of tenantMustHaves) {
    totalCount++;
    const isMet = checkRequirement(mustHave, propertyFeatures);
    if (isMet) {
      metCount++;
      reasons.push(`✓ ${mustHave}`);
    } else {
      gaps.push(`✗ ${mustHave} not met`);
    }
  }
  
  // Check property must-haves (landlord requirements) against tenant profile
  for (const mustHave of propertyMustHaves) {
    totalCount++;
    const isMet = checkRequirement(mustHave, tenantProfile);
    if (isMet) {
      metCount++;
      reasons.push(`✓ ${mustHave}`);
    } else {
      gaps.push(`✗ ${mustHave} not met`);
    }
  }
  
  // Check tenant red flags - if ANY red flag is violated, it's a deal breaker
  for (const redFlag of tenantRedFlags) {
    totalCount++;
    const isViolated = checkRequirement(redFlag, propertyFeatures);
    if (!isViolated) {
      metCount++;
      reasons.push(`✓ Avoids: ${redFlag}`);
    } else {
      gaps.push(`⚠ Red flag: ${redFlag}`);
    }
  }
  
  // Check property red flags - if tenant violates ANY, it's a deal breaker
  for (const redFlag of propertyRedFlags) {
    totalCount++;
    const isViolated = checkRequirement(redFlag, tenantProfile);
    if (!isViolated) {
      metCount++;
      reasons.push(`✓ Avoids: ${redFlag}`);
    } else {
      gaps.push(`⚠ Red flag: ${redFlag}`);
    }
  }
  
  // Calculate percentage
  const percentage = totalCount > 0 ? Math.round((metCount / totalCount) * 100) : 0;
  
  // Categorize
  let category: MatchCategory;
  let label: MatchLabel;
  
  if (percentage <= 25) {
    category = "0-25%";
    label = "Poor";
  } else if (percentage <= 50) {
    category = "26-50%";
    label = "Fair";
  } else if (percentage <= 75) {
    category = "51-75%";
    label = "Good";
  } else {
    category = "76-100%";
    label = "Excellent";
  }
  
  return {
    percentage,
    category,
    label,
    score: percentage,
    metCount,
    totalCount,
    reasons,
    gaps,
  };
}

/**
 * Check if a requirement is met based on features/profile
 */
function checkRequirement(requirement: string, features: Record<string, any>): boolean {
  const req = requirement.toLowerCase();
  
  // Pets
  if (req.includes("pet") && req.includes("allow")) {
    return features.petsAllowed === true || features.pets_allowed === true;
  }
  if (req.includes("no pet")) {
    return features.hasPets === false || features.has_pets === false;
  }
  
  // Furnished
  if (req.includes("furnished")) {
    return features.furnished === true;
  }
  if (req.includes("unfurnished")) {
    return features.furnished === false;
  }
  
  // Students
  if (req.includes("student") && req.includes("allow")) {
    return features.studentsAllowed === true || features.students_allowed === true;
  }
  if (req.includes("no student")) {
    return features.studentsAllowed === false || features.students_allowed === false;
  }
  
  // Income multiple
  if (req.includes("income") && req.includes("multiple")) {
    const salary = features.salaryAnnual || features.salary_annual || 0;
    const rent = features.rentPcm || features.rent_pcm || 0;
    const requiredMultiple = features.incomeMultiple || features.income_multiple || 2.8;
    const actualMultiple = rent > 0 ? (salary / 12) / rent : 0;
    return actualMultiple >= requiredMultiple;
  }
  
  // Employment verification
  if (req.includes("employment") && (req.includes("verification") || req.includes("letter"))) {
    return features.employer != null && features.employer !== "";
  }
  
  // Landlord reference
  if (req.includes("landlord") && req.includes("reference")) {
    return features.hasLandlordRef === true || features.has_landlord_ref === true;
  }
  
  // Credit check
  if (req.includes("credit") && (req.includes("check") || req.includes("report"))) {
    return features.hasCreditReport === true || features.has_credit_report === true;
  }
  
  // ID verification
  if (req.includes("id") && (req.includes("verification") || req.includes("verified"))) {
    return features.hasIdDoc === true || features.has_id_doc === true;
  }
  
  // Payslips
  if (req.includes("payslip") || req.includes("pay slip")) {
    return features.hasPayslips === true || features.has_payslips === true;
  }
  
  // Move-in timing
  if (req.includes("move") && req.includes("in") && req.includes("match")) {
    const tenantMoveIn = features.moveInFrom || features.move_in_from;
    const propertyAvailable = features.availableFrom || features.available_from;
    if (tenantMoveIn && propertyAvailable) {
      const tenantDate = new Date(tenantMoveIn);
      const propertyDate = new Date(propertyAvailable);
      const diffDays = Math.abs((tenantDate.getTime() - propertyDate.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays <= 14; // Within 2 weeks
    }
    return false;
  }
  
  // Guarantor
  if (req.includes("guarantor")) {
    return features.hasGuarantor === true || features.has_guarantor === true;
  }
  
  // Default: check if property has the feature
  return features[requirement] === true;
}

/**
 * Calculate Tenant→Property score (tenant perspective)
 */
export function calculateTenantPropertyScore(
  tenant: TenantPassport,
  property: Property
): MatchScore {
  const tenantMustHaves = (tenant.mustHaves as string[]) || [];
  const tenantRedFlags = (tenant.redFlags as string[]) || [];
  const propertyMustHaves = (property.mustHaves as string[]) || [];
  const propertyRedFlags = (property.redFlags as string[]) || [];
  
  const propertyFeatures = {
    petsAllowed: property.petsAllowed,
    furnished: property.furnished,
    studentsAllowed: property.studentsAllowed,
    rentPcm: property.rentPcm,
    availableFrom: property.availableFrom,
    beds: property.beds,
    baths: property.baths,
  };
  
  const tenantProfile = {
    salaryAnnual: tenant.salaryAnnual,
    hasPets: tenant.hasPets,
    householdSize: tenant.householdSize,
    moveInFrom: tenant.moveInFrom,
    employer: tenant.employer,
  };
  
  return calculateMatchPercentage(
    tenantMustHaves,
    tenantRedFlags,
    propertyMustHaves,
    propertyRedFlags,
    propertyFeatures,
    tenantProfile
  );
}

/**
 * Calculate Property→Tenant score (landlord perspective)
 */
export function calculatePropertyTenantScore(
  property: Property,
  tenant: TenantPassport
): MatchScore {
  const propertyMustHaves = (property.mustHaves as string[]) || [];
  const propertyRedFlags = (property.redFlags as string[]) || [];
  const tenantMustHaves = (tenant.mustHaves as string[]) || [];
  const tenantRedFlags = (tenant.redFlags as string[]) || [];
  
  const tenantProfile = {
    salaryAnnual: tenant.salaryAnnual,
    hasPets: tenant.hasPets,
    householdSize: tenant.householdSize,
    moveInFrom: tenant.moveInFrom,
    employer: tenant.employer,
    rentPcm: property.rentPcm, // For income multiple calculation
    incomeMultiple: property.incomeMultiple,
  };
  
  const propertyFeatures = {
    petsAllowed: property.petsAllowed,
    furnished: property.furnished,
    studentsAllowed: property.studentsAllowed,
    availableFrom: property.availableFrom,
  };
  
  return calculateMatchPercentage(
    propertyMustHaves,
    propertyRedFlags,
    tenantMustHaves,
    tenantRedFlags,
    tenantProfile,
    propertyFeatures
  );
}

/**
 * Get simple label from percentage
 */
export function getMatchLabelFromPercentage(percentage: number): MatchLabel {
  if (percentage <= 25) return "Poor";
  if (percentage <= 50) return "Fair";
  if (percentage <= 75) return "Good";
  return "Excellent";
}

/**
 * Get category from percentage
 */
export function getCategoryFromPercentage(percentage: number): MatchCategory {
  if (percentage <= 25) return "0-25%";
  if (percentage <= 50) return "26-50%";
  if (percentage <= 75) return "51-75%";
  return "76-100%";
}
