// FormSubmit.co email notification — no API key required
// Sends form data directly to jessydpritchett@gmail.com
const FORMSUBMIT_URL = "https://formsubmit.co/ajax/jessydpritchett@gmail.com";

export async function sendEmailNotification(data: {
  subject: string;
  quoteType: string;
  fields: Record<string, string>;
}) {
  try {
    const res = await fetch(FORMSUBMIT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        _subject: data.subject,
        _template: "table",
        _captcha: "false",
        ...data.fields,
      }),
    });

    const result = await res.json();
    if (result.success) {
      console.log("[Email] Notification sent successfully");
      return true;
    } else {
      console.error("[Email] Failed:", result.message);
      return false;
    }
  } catch (error) {
    console.error("[Email] Error sending notification:", error);
    return false;
  }
}

export function formatAutoQuoteEmail(quote: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  vehicleYear: string;
  vehicleMake: string;
  vehicleModel: string;
  vin?: string;
  dateOfBirth: string;
  licenseNumber?: string;
  currentInsurer?: string;
  coverageType: string;
  additionalNotes?: string;
}) {
  const coverageLabels: Record<string, string> = {
    liability: "Liability Only",
    standard: "Standard (Liability + Collision)",
    full: "Full Coverage (Comprehensive)",
    "not-sure": "Not Sure — Help Me Decide",
  };

  return {
    subject: `New Auto Quote: ${quote.firstName} ${quote.lastName} — ${quote.vehicleYear} ${quote.vehicleMake} ${quote.vehicleModel}`,
    quoteType: "Auto Insurance",
    fields: {
      "Quote Type": "AUTO INSURANCE",
      "Name": `${quote.firstName} ${quote.lastName}`,
      "Email": quote.email,
      "Phone": quote.phone,
      "Address": `${quote.address}, ${quote.city}, ${quote.state} ${quote.zip}`,
      "Vehicle": `${quote.vehicleYear} ${quote.vehicleMake} ${quote.vehicleModel}`,
      ...(quote.vin ? { "VIN": quote.vin } : {}),
      "Date of Birth": quote.dateOfBirth,
      ...(quote.licenseNumber ? { "License Number": quote.licenseNumber } : {}),
      ...(quote.currentInsurer ? { "Current Insurer": quote.currentInsurer } : {}),
      "Coverage Type": coverageLabels[quote.coverageType] || quote.coverageType,
      ...(quote.additionalNotes ? { "Additional Notes": quote.additionalNotes } : {}),
    },
  };
}

export function formatHomeQuoteEmail(quote: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  propertyAddress: string;
  propertyCity: string;
  propertyState: string;
  propertyZip: string;
  propertyType: string;
  yearBuilt: string;
  squareFootage: string;
  numberOfBedrooms: string;
  numberOfBathrooms: string;
  roofType?: string;
  hasPool?: string;
  hasSecuritySystem?: string;
  currentInsurer?: string;
  estimatedHomeValue?: string;
  additionalNotes?: string;
}) {
  const propertyTypeLabels: Record<string, string> = {
    "single-family": "Single Family Home",
    townhouse: "Townhouse",
    condo: "Condo",
    duplex: "Duplex",
    manufactured: "Manufactured / Mobile Home",
  };

  const roofTypeLabels: Record<string, string> = {
    "asphalt-shingle": "Asphalt Shingle",
    metal: "Metal",
    tile: "Tile",
    "wood-shake": "Wood Shake",
    slate: "Slate",
    other: "Other",
  };

  return {
    subject: `New Home Quote: ${quote.firstName} ${quote.lastName} — ${propertyTypeLabels[quote.propertyType] || quote.propertyType} in ${quote.propertyCity}, ${quote.propertyState}`,
    quoteType: "Home Insurance",
    fields: {
      "Quote Type": "HOME INSURANCE",
      "Name": `${quote.firstName} ${quote.lastName}`,
      "Email": quote.email,
      "Phone": quote.phone,
      "Property Address": `${quote.propertyAddress}, ${quote.propertyCity}, ${quote.propertyState} ${quote.propertyZip}`,
      "Property Type": propertyTypeLabels[quote.propertyType] || quote.propertyType,
      "Year Built": quote.yearBuilt,
      "Square Footage": `${quote.squareFootage} sq ft`,
      "Bedrooms": quote.numberOfBedrooms,
      "Bathrooms": quote.numberOfBathrooms,
      ...(quote.roofType ? { "Roof Type": roofTypeLabels[quote.roofType] || quote.roofType } : {}),
      "Swimming Pool": quote.hasPool === "yes" ? "Yes" : "No",
      "Security System": quote.hasSecuritySystem === "yes" ? "Yes" : "No",
      ...(quote.estimatedHomeValue ? { "Estimated Home Value": quote.estimatedHomeValue } : {}),
      ...(quote.currentInsurer ? { "Current Insurer": quote.currentInsurer } : {}),
      ...(quote.additionalNotes ? { "Additional Notes": quote.additionalNotes } : {}),
    },
  };
}

export function formatLifeQuoteEmail(quote: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  dateOfBirth: string;
  gender: string;
  height?: string;
  weight?: string;
  tobaccoUse: string;
  generalHealth: string;
  majorHealthConditions?: string;
  coverageAmount: string;
  policyType: string;
  currentInsurer?: string;
  beneficiary?: string;
  additionalNotes?: string;
}) {
  const policyTypeLabels: Record<string, string> = {
    term: "Term Life",
    whole: "Whole Life",
    universal: "Universal Life",
    "not-sure": "Not Sure \u2014 Help Me Decide",
  };

  const healthLabels: Record<string, string> = {
    excellent: "Excellent",
    good: "Good",
    average: "Average",
    "below-average": "Below Average",
  };

  return {
    subject: `New Life Quote: ${quote.firstName} ${quote.lastName} \u2014 ${policyTypeLabels[quote.policyType] || quote.policyType}`,
    quoteType: "Life Insurance",
    fields: {
      "Quote Type": "LIFE INSURANCE",
      "Name": `${quote.firstName} ${quote.lastName}`,
      "Email": quote.email,
      "Phone": quote.phone,
      "Address": `${quote.address}, ${quote.city}, ${quote.state} ${quote.zip}`,
      "Date of Birth": quote.dateOfBirth,
      "Gender": quote.gender,
      ...(quote.height ? { "Height": quote.height } : {}),
      ...(quote.weight ? { "Weight": `${quote.weight} lbs` } : {}),
      "Tobacco Use": quote.tobaccoUse === "yes" ? "Yes" : "No",
      "General Health": healthLabels[quote.generalHealth] || quote.generalHealth,
      ...(quote.majorHealthConditions ? { "Health Conditions": quote.majorHealthConditions } : {}),
      "Coverage Amount": quote.coverageAmount,
      "Policy Type": policyTypeLabels[quote.policyType] || quote.policyType,
      ...(quote.beneficiary ? { "Beneficiary": quote.beneficiary } : {}),
      ...(quote.currentInsurer ? { "Current Insurer": quote.currentInsurer } : {}),
      ...(quote.additionalNotes ? { "Additional Notes": quote.additionalNotes } : {}),
    },
  };
}
