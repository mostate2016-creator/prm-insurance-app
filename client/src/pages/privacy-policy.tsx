import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { PerplexityAttribution } from "@/components/PerplexityAttribution";
import { LegalFooterLinks } from "@/components/LegalFooterLinks";

export default function PrivacyPolicyPage() {
  const effectiveDate = "July 14, 2026";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground" data-testid="link-back-home">
            <ArrowLeft className="w-4 h-4" />
            Back to PRM Insurance
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 text-sm leading-relaxed text-foreground">
          <h1 className="text-2xl font-bold mb-1" data-testid="text-privacy-title">Privacy Policy</h1>
          <p className="text-xs text-muted-foreground mb-8">Effective date: {effectiveDate}</p>

          <p className="mb-6">
            This Privacy Policy explains how Farmers Insurance – Pritchett Agency ("PRM Insurance," "we," "us," or
            "our") collects, uses, and protects information you provide to us through our website (prmins.com),
            phone, text messaging, and in-person interactions. By using our website or providing your information to
            us, you agree to the terms of this Privacy Policy.
          </p>

          <h2 className="text-base font-semibold mt-8 mb-2">1. Information We Collect</h2>
          <p className="mb-3">We may collect the following types of information:</p>
          <ul className="list-disc pl-5 mb-3 space-y-1">
            <li>Contact information, such as your name, mailing address, email address, and phone number</li>
            <li>Insurance-related information you provide when requesting a quote, such as vehicle, home, or life
              insurance details</li>
            <li>Communications you send us, including messages submitted through web forms, email, phone calls, or
              text messages</li>
            <li>Basic technical information collected automatically when you visit our website, such as browser
              type and general usage data</li>
          </ul>

          <h2 className="text-base font-semibold mt-8 mb-2">2. How We Use Your Information</h2>
          <p className="mb-3">We use the information we collect to:</p>
          <ul className="list-disc pl-5 mb-3 space-y-1">
            <li>Provide insurance quotes and respond to your inquiries</li>
            <li>Service existing policies, including billing, renewal, and policy update communications</li>
            <li>Follow up on quote requests and schedule appointments</li>
            <li>Send promotional offers and marketing communications about products that may interest you</li>
            <li>Improve our website and customer service</li>
            <li>Comply with legal and regulatory obligations</li>
          </ul>

          <h2 className="text-base font-semibold mt-8 mb-2">3. Data Use and Sharing</h2>
          <p className="mb-3">
            We do not sell your personal information. We may share information with third-party service providers
            (such as insurance carriers, quoting platforms, or communication vendors) solely to help us provide
            quotes, service policies, and communicate with you.
          </p>
          <p className="mb-3 font-medium">
            Mobile information will not be shared with third parties or affiliates for marketing or promotional
            purposes. This excludes text messaging opt-in data and consent, which will not be shared with any third
            parties.
          </p>
          <p className="mb-3">
            No mobile opt-in data or consent will be shared with any third party, regardless of purpose, except as
            required to provide the messaging service itself (e.g., our SMS platform provider) or as required by
            law.
          </p>

          <h2 className="text-base font-semibold mt-8 mb-2">4. Text Messaging</h2>
          <p className="mb-3">
            If you opt in to receive text messages from us, we use that information only to send you the messages
            you agreed to receive. See our <Link href="/terms" className="underline">Terms &amp; Conditions</Link>{" "}
            for details on message types, frequency, and how to opt out.
          </p>

          <h2 className="text-base font-semibold mt-8 mb-2">5. Data Security</h2>
          <p className="mb-3">
            We take reasonable administrative and technical measures to protect the information you provide to us
            from unauthorized access, use, or disclosure.
          </p>

          <h2 className="text-base font-semibold mt-8 mb-2">6. Your Choices</h2>
          <p className="mb-3">
            You may opt out of text messages at any time by replying STOP, and you may unsubscribe from marketing
            emails using the link provided in those emails. You may also contact us directly using the information
            below to update or request removal of your information.
          </p>

          <h2 className="text-base font-semibold mt-8 mb-2">7. Changes to This Policy</h2>
          <p className="mb-3">
            We may update this Privacy Policy from time to time. Any changes will be posted on this page with an
            updated effective date.
          </p>

          <h2 className="text-base font-semibold mt-8 mb-2">8. Contact Us</h2>
          <p className="mb-3">
            If you have questions about this Privacy Policy, contact us at{" "}
            <a href="mailto:jessydpritchett@gmail.com" className="underline">jessydpritchett@gmail.com</a> or call{" "}
            <a href="tel:4177661819" className="underline">(417) 766-1819</a>.
          </p>
        </div>
      </main>

      <footer className="py-6 text-center border-t border-border space-y-2">
        <LegalFooterLinks />
        <PerplexityAttribution />
      </footer>
    </div>
  );
}
