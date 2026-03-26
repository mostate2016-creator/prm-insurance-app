import nodemailer from "nodemailer";

const NOTIFICATION_EMAIL = "jessydpritchett@gmail.com";

// SMTP Configuration
// To send real emails to your Gmail, set these environment variables:
//   SMTP_HOST=smtp.gmail.com
//   SMTP_PORT=587
//   SMTP_USER=jessydpritchett@gmail.com
//   SMTP_PASS=your-gmail-app-password
//
// To get a Gmail App Password:
// 1. Go to https://myaccount.google.com/apppasswords
// 2. Sign in to your Google account
// 3. Select "Mail" and your device, then click "Generate"
// 4. Copy the 16-character password and use it as SMTP_PASS

let transporter: nodemailer.Transporter;

async function getTransporter() {
  if (transporter) return transporter;

  if (process.env.SMTP_HOST) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    console.log(`[Email] Configured with SMTP: ${process.env.SMTP_HOST}`);
  } else {
    // Fallback: Ethereal test account (emails viewable at https://ethereal.email but NOT delivered)
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log("[Email] No SMTP configured. Using Ethereal test account (emails NOT delivered to inbox).");
    console.log("[Email] Set SMTP_HOST, SMTP_USER, SMTP_PASS env vars for real delivery.");
  }

  return transporter;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendAutoQuoteNotification(quote: {
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
  vin?: string | null;
  dateOfBirth: string;
  licenseNumber?: string | null;
  currentInsurer?: string | null;
  coverageType: string;
  additionalNotes?: string | null;
}) {
  try {
    const transport = await getTransporter();

    const coverageLabels: Record<string, string> = {
      "liability": "Liability Only",
      "standard": "Standard (Liability + Collision)",
      "full": "Full Coverage (Comprehensive)",
      "not-sure": "Not Sure — Help Me Decide",
    };

    const name = escapeHtml(`${quote.firstName} ${quote.lastName}`);
    const email = escapeHtml(quote.email);
    const phone = escapeHtml(quote.phone);
    const address = escapeHtml(`${quote.address}, ${quote.city}, ${quote.state} ${quote.zip}`);
    const vehicle = escapeHtml(`${quote.vehicleYear} ${quote.vehicleMake} ${quote.vehicleModel}`);

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #1e3a5f; padding: 24px; border-radius: 8px 8px 0 0;">
          <h1 style="color: #ffffff; margin: 0; font-size: 20px;">New Auto Insurance Quote Request</h1>
          <p style="color: #a8c4e0; margin: 8px 0 0; font-size: 14px;">PRM Insurance</p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 24px; border: 1px solid #e5e7eb;">
          <h2 style="color: #1e3a5f; font-size: 16px; margin: 0 0 12px; border-bottom: 2px solid #1e3a5f; padding-bottom: 8px;">Contact Information</h2>
          <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
            <tr><td style="padding: 6px 0; color: #6b7280; width: 140px;">Name</td><td style="padding: 6px 0; font-weight: 600;">${name}</td></tr>
            <tr><td style="padding: 6px 0; color: #6b7280;">Email</td><td style="padding: 6px 0;"><a href="mailto:${email}" style="color: #1e3a5f;">${email}</a></td></tr>
            <tr><td style="padding: 6px 0; color: #6b7280;">Phone</td><td style="padding: 6px 0;"><a href="tel:${phone}" style="color: #1e3a5f;">${phone}</a></td></tr>
            <tr><td style="padding: 6px 0; color: #6b7280;">Address</td><td style="padding: 6px 0;">${address}</td></tr>
          </table>
        </div>
        
        <div style="background-color: #ffffff; padding: 24px; border: 1px solid #e5e7eb; border-top: 0;">
          <h2 style="color: #1e3a5f; font-size: 16px; margin: 0 0 12px; border-bottom: 2px solid #1e3a5f; padding-bottom: 8px;">Vehicle Details</h2>
          <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
            <tr><td style="padding: 6px 0; color: #6b7280; width: 140px;">Vehicle</td><td style="padding: 6px 0; font-weight: 600;">${vehicle}</td></tr>
            ${quote.vin ? `<tr><td style="padding: 6px 0; color: #6b7280;">VIN</td><td style="padding: 6px 0;">${escapeHtml(quote.vin)}</td></tr>` : ""}
          </table>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 24px; border: 1px solid #e5e7eb; border-top: 0;">
          <h2 style="color: #1e3a5f; font-size: 16px; margin: 0 0 12px; border-bottom: 2px solid #1e3a5f; padding-bottom: 8px;">Driver Information</h2>
          <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
            <tr><td style="padding: 6px 0; color: #6b7280; width: 140px;">Date of Birth</td><td style="padding: 6px 0;">${escapeHtml(quote.dateOfBirth)}</td></tr>
            ${quote.licenseNumber ? `<tr><td style="padding: 6px 0; color: #6b7280;">License #</td><td style="padding: 6px 0;">${escapeHtml(quote.licenseNumber)}</td></tr>` : ""}
            ${quote.currentInsurer ? `<tr><td style="padding: 6px 0; color: #6b7280;">Current Insurer</td><td style="padding: 6px 0;">${escapeHtml(quote.currentInsurer)}</td></tr>` : ""}
          </table>
        </div>
        
        <div style="background-color: #ffffff; padding: 24px; border: 1px solid #e5e7eb; border-top: 0;">
          <h2 style="color: #1e3a5f; font-size: 16px; margin: 0 0 12px; border-bottom: 2px solid #1e3a5f; padding-bottom: 8px;">Coverage</h2>
          <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
            <tr><td style="padding: 6px 0; color: #6b7280; width: 140px;">Coverage Type</td><td style="padding: 6px 0; font-weight: 600;">${coverageLabels[quote.coverageType] || escapeHtml(quote.coverageType)}</td></tr>
            ${quote.additionalNotes ? `<tr><td style="padding: 6px 0; color: #6b7280; vertical-align: top;">Notes</td><td style="padding: 6px 0;">${escapeHtml(quote.additionalNotes)}</td></tr>` : ""}
          </table>
        </div>
        
        <div style="background-color: #1e3a5f; padding: 16px 24px; border-radius: 0 0 8px 8px; text-align: center;">
          <p style="color: #a8c4e0; margin: 0; font-size: 12px;">This quote request was submitted through the PRM Insurance website.</p>
        </div>
      </div>
    `;

    const fromAddress = process.env.SMTP_USER || "quotes@prminsurance.com";

    const info = await transport.sendMail({
      from: `"PRM Insurance Quotes" <${fromAddress}>`,
      to: NOTIFICATION_EMAIL,
      subject: `New Auto Quote: ${quote.firstName} ${quote.lastName} — ${quote.vehicleYear} ${quote.vehicleMake} ${quote.vehicleModel}`,
      html,
    });

    console.log(`[Email] Auto quote notification sent: ${info.messageId}`);
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`[Email] Preview URL: ${previewUrl}`);
    }
    return true;
  } catch (error) {
    console.error("[Email] Failed to send auto quote notification:", error);
    return false;
  }
}

export async function sendHomeQuoteNotification(quote: {
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
  roofType?: string | null;
  hasPool?: string | null;
  hasSecuritySystem?: string | null;
  currentInsurer?: string | null;
  estimatedHomeValue?: string | null;
  additionalNotes?: string | null;
}) {
  try {
    const transport = await getTransporter();

    const propertyTypeLabels: Record<string, string> = {
      "single-family": "Single Family Home",
      "townhouse": "Townhouse",
      "condo": "Condo",
      "duplex": "Duplex",
      "manufactured": "Manufactured / Mobile Home",
    };

    const roofTypeLabels: Record<string, string> = {
      "asphalt-shingle": "Asphalt Shingle",
      "metal": "Metal",
      "tile": "Tile",
      "wood-shake": "Wood Shake",
      "slate": "Slate",
      "other": "Other",
    };

    const name = escapeHtml(`${quote.firstName} ${quote.lastName}`);
    const email = escapeHtml(quote.email);
    const phone = escapeHtml(quote.phone);
    const propertyAddr = escapeHtml(`${quote.propertyAddress}, ${quote.propertyCity}, ${quote.propertyState} ${quote.propertyZip}`);

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #1e3a5f; padding: 24px; border-radius: 8px 8px 0 0;">
          <h1 style="color: #ffffff; margin: 0; font-size: 20px;">New Home Insurance Quote Request</h1>
          <p style="color: #a8c4e0; margin: 8px 0 0; font-size: 14px;">PRM Insurance</p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 24px; border: 1px solid #e5e7eb;">
          <h2 style="color: #1e3a5f; font-size: 16px; margin: 0 0 12px; border-bottom: 2px solid #1e3a5f; padding-bottom: 8px;">Contact Information</h2>
          <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
            <tr><td style="padding: 6px 0; color: #6b7280; width: 140px;">Name</td><td style="padding: 6px 0; font-weight: 600;">${name}</td></tr>
            <tr><td style="padding: 6px 0; color: #6b7280;">Email</td><td style="padding: 6px 0;"><a href="mailto:${email}" style="color: #1e3a5f;">${email}</a></td></tr>
            <tr><td style="padding: 6px 0; color: #6b7280;">Phone</td><td style="padding: 6px 0;"><a href="tel:${phone}" style="color: #1e3a5f;">${phone}</a></td></tr>
          </table>
        </div>
        
        <div style="background-color: #ffffff; padding: 24px; border: 1px solid #e5e7eb; border-top: 0;">
          <h2 style="color: #1e3a5f; font-size: 16px; margin: 0 0 12px; border-bottom: 2px solid #1e3a5f; padding-bottom: 8px;">Property Details</h2>
          <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
            <tr><td style="padding: 6px 0; color: #6b7280; width: 140px;">Address</td><td style="padding: 6px 0; font-weight: 600;">${propertyAddr}</td></tr>
            <tr><td style="padding: 6px 0; color: #6b7280;">Property Type</td><td style="padding: 6px 0;">${propertyTypeLabels[quote.propertyType] || escapeHtml(quote.propertyType)}</td></tr>
            <tr><td style="padding: 6px 0; color: #6b7280;">Year Built</td><td style="padding: 6px 0;">${escapeHtml(quote.yearBuilt)}</td></tr>
            <tr><td style="padding: 6px 0; color: #6b7280;">Square Footage</td><td style="padding: 6px 0;">${escapeHtml(quote.squareFootage)} sq ft</td></tr>
            <tr><td style="padding: 6px 0; color: #6b7280;">Bedrooms</td><td style="padding: 6px 0;">${escapeHtml(quote.numberOfBedrooms)}</td></tr>
            <tr><td style="padding: 6px 0; color: #6b7280;">Bathrooms</td><td style="padding: 6px 0;">${escapeHtml(quote.numberOfBathrooms)}</td></tr>
          </table>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 24px; border: 1px solid #e5e7eb; border-top: 0;">
          <h2 style="color: #1e3a5f; font-size: 16px; margin: 0 0 12px; border-bottom: 2px solid #1e3a5f; padding-bottom: 8px;">Additional Details</h2>
          <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
            ${quote.roofType ? `<tr><td style="padding: 6px 0; color: #6b7280; width: 140px;">Roof Type</td><td style="padding: 6px 0;">${roofTypeLabels[quote.roofType] || escapeHtml(quote.roofType)}</td></tr>` : ""}
            <tr><td style="padding: 6px 0; color: #6b7280;">Swimming Pool</td><td style="padding: 6px 0;">${quote.hasPool === "yes" ? "Yes" : "No"}</td></tr>
            <tr><td style="padding: 6px 0; color: #6b7280;">Security System</td><td style="padding: 6px 0;">${quote.hasSecuritySystem === "yes" ? "Yes" : "No"}</td></tr>
            ${quote.estimatedHomeValue ? `<tr><td style="padding: 6px 0; color: #6b7280;">Est. Home Value</td><td style="padding: 6px 0; font-weight: 600;">${escapeHtml(quote.estimatedHomeValue)}</td></tr>` : ""}
            ${quote.currentInsurer ? `<tr><td style="padding: 6px 0; color: #6b7280;">Current Insurer</td><td style="padding: 6px 0;">${escapeHtml(quote.currentInsurer)}</td></tr>` : ""}
            ${quote.additionalNotes ? `<tr><td style="padding: 6px 0; color: #6b7280; vertical-align: top;">Notes</td><td style="padding: 6px 0;">${escapeHtml(quote.additionalNotes)}</td></tr>` : ""}
          </table>
        </div>
        
        <div style="background-color: #1e3a5f; padding: 16px 24px; border-radius: 0 0 8px 8px; text-align: center;">
          <p style="color: #a8c4e0; margin: 0; font-size: 12px;">This quote request was submitted through the PRM Insurance website.</p>
        </div>
      </div>
    `;

    const fromAddress = process.env.SMTP_USER || "quotes@prminsurance.com";

    const info = await transport.sendMail({
      from: `"PRM Insurance Quotes" <${fromAddress}>`,
      to: NOTIFICATION_EMAIL,
      subject: `New Home Quote: ${quote.firstName} ${quote.lastName} — ${propertyTypeLabels[quote.propertyType] || quote.propertyType} in ${quote.propertyCity}, ${quote.propertyState}`,
      html,
    });

    console.log(`[Email] Home quote notification sent: ${info.messageId}`);
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`[Email] Preview URL: ${previewUrl}`);
    }
    return true;
  } catch (error) {
    console.error("[Email] Failed to send home quote notification:", error);
    return false;
  }
}

export async function sendLifeQuoteNotification(quote: {
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
  height?: string | null;
  weight?: string | null;
  tobaccoUse: string;
  generalHealth: string;
  majorHealthConditions?: string | null;
  coverageAmount: string;
  policyType: string;
  currentInsurer?: string | null;
  beneficiary?: string | null;
  additionalNotes?: string | null;
}) {
  try {
    const transport = await getTransporter();

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

    const name = escapeHtml(`${quote.firstName} ${quote.lastName}`);
    const email = escapeHtml(quote.email);
    const phone = escapeHtml(quote.phone);
    const address = escapeHtml(`${quote.address}, ${quote.city}, ${quote.state} ${quote.zip}`);

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #1e3a5f; padding: 24px; border-radius: 8px 8px 0 0;">
          <h1 style="color: #ffffff; margin: 0; font-size: 20px;">New Life Insurance Quote Request</h1>
          <p style="color: #a8c4e0; margin: 8px 0 0; font-size: 14px;">PRM Insurance</p>
        </div>
        <div style="background-color: #f8f9fa; padding: 24px; border: 1px solid #e5e7eb;">
          <h2 style="color: #1e3a5f; font-size: 16px; margin: 0 0 12px; border-bottom: 2px solid #1e3a5f; padding-bottom: 8px;">Contact Information</h2>
          <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
            <tr><td style="padding: 6px 0; color: #6b7280; width: 140px;">Name</td><td style="padding: 6px 0; font-weight: 600;">${name}</td></tr>
            <tr><td style="padding: 6px 0; color: #6b7280;">Email</td><td style="padding: 6px 0;"><a href="mailto:${email}" style="color: #1e3a5f;">${email}</a></td></tr>
            <tr><td style="padding: 6px 0; color: #6b7280;">Phone</td><td style="padding: 6px 0;"><a href="tel:${phone}" style="color: #1e3a5f;">${phone}</a></td></tr>
            <tr><td style="padding: 6px 0; color: #6b7280;">Address</td><td style="padding: 6px 0;">${address}</td></tr>
          </table>
        </div>
        <div style="background-color: #ffffff; padding: 24px; border: 1px solid #e5e7eb; border-top: 0;">
          <h2 style="color: #1e3a5f; font-size: 16px; margin: 0 0 12px; border-bottom: 2px solid #1e3a5f; padding-bottom: 8px;">Personal Information</h2>
          <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
            <tr><td style="padding: 6px 0; color: #6b7280; width: 140px;">Date of Birth</td><td style="padding: 6px 0;">${escapeHtml(quote.dateOfBirth)}</td></tr>
            <tr><td style="padding: 6px 0; color: #6b7280;">Gender</td><td style="padding: 6px 0;">${escapeHtml(quote.gender)}</td></tr>
            ${quote.height ? `<tr><td style="padding: 6px 0; color: #6b7280;">Height</td><td style="padding: 6px 0;">${escapeHtml(quote.height)}</td></tr>` : ""}
            ${quote.weight ? `<tr><td style="padding: 6px 0; color: #6b7280;">Weight</td><td style="padding: 6px 0;">${escapeHtml(quote.weight)} lbs</td></tr>` : ""}
          </table>
        </div>
        <div style="background-color: #f8f9fa; padding: 24px; border: 1px solid #e5e7eb; border-top: 0;">
          <h2 style="color: #1e3a5f; font-size: 16px; margin: 0 0 12px; border-bottom: 2px solid #1e3a5f; padding-bottom: 8px;">Health &amp; Lifestyle</h2>
          <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
            <tr><td style="padding: 6px 0; color: #6b7280; width: 140px;">Tobacco Use</td><td style="padding: 6px 0;">${quote.tobaccoUse === "yes" ? "Yes" : "No"}</td></tr>
            <tr><td style="padding: 6px 0; color: #6b7280;">General Health</td><td style="padding: 6px 0;">${healthLabels[quote.generalHealth] || escapeHtml(quote.generalHealth)}</td></tr>
            ${quote.majorHealthConditions ? `<tr><td style="padding: 6px 0; color: #6b7280; vertical-align: top;">Health Conditions</td><td style="padding: 6px 0;">${escapeHtml(quote.majorHealthConditions)}</td></tr>` : ""}
          </table>
        </div>
        <div style="background-color: #ffffff; padding: 24px; border: 1px solid #e5e7eb; border-top: 0;">
          <h2 style="color: #1e3a5f; font-size: 16px; margin: 0 0 12px; border-bottom: 2px solid #1e3a5f; padding-bottom: 8px;">Coverage Preferences</h2>
          <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
            <tr><td style="padding: 6px 0; color: #6b7280; width: 140px;">Coverage Amount</td><td style="padding: 6px 0; font-weight: 600;">${escapeHtml(quote.coverageAmount)}</td></tr>
            <tr><td style="padding: 6px 0; color: #6b7280;">Policy Type</td><td style="padding: 6px 0; font-weight: 600;">${policyTypeLabels[quote.policyType] || escapeHtml(quote.policyType)}</td></tr>
            ${quote.currentInsurer ? `<tr><td style="padding: 6px 0; color: #6b7280;">Current Insurer</td><td style="padding: 6px 0;">${escapeHtml(quote.currentInsurer)}</td></tr>` : ""}
            ${quote.beneficiary ? `<tr><td style="padding: 6px 0; color: #6b7280;">Beneficiary</td><td style="padding: 6px 0;">${escapeHtml(quote.beneficiary)}</td></tr>` : ""}
            ${quote.additionalNotes ? `<tr><td style="padding: 6px 0; color: #6b7280; vertical-align: top;">Notes</td><td style="padding: 6px 0;">${escapeHtml(quote.additionalNotes)}</td></tr>` : ""}
          </table>
        </div>
        <div style="background-color: #1e3a5f; padding: 16px 24px; border-radius: 0 0 8px 8px; text-align: center;">
          <p style="color: #a8c4e0; margin: 0; font-size: 12px;">This quote request was submitted through the PRM Insurance website.</p>
        </div>
      </div>
    `;

    const fromAddress = process.env.SMTP_USER || "quotes@prminsurance.com";
    const info = await transport.sendMail({
      from: `"PRM Insurance Quotes" <${fromAddress}>`,
      to: NOTIFICATION_EMAIL,
      subject: `New Life Quote: ${quote.firstName} ${quote.lastName} \u2014 ${policyTypeLabels[quote.policyType] || quote.policyType}`,
      html,
    });

    console.log(`[Email] Life quote notification sent: ${info.messageId}`);
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`[Email] Preview URL: ${previewUrl}`);
    }
    return true;
  } catch (error) {
    console.error("[Email] Failed to send life quote notification:", error);
    return false;
  }
}
