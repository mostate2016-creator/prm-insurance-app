import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { PerplexityAttribution } from "@/components/PerplexityAttribution";
import { LegalFooterLinks } from "@/components/LegalFooterLinks";

export default function TermsPage() {
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
          <h1 className="text-2xl font-bold mb-1" data-testid="text-terms-title">Terms &amp; Conditions</h1>
          <p className="text-xs text-muted-foreground mb-8">Effective date: {effectiveDate}</p>

          <p className="mb-6">
            These Terms &amp; Conditions govern your use of the PRM Insurance website (prmins.com) and any text
            messaging program offered by Farmers Insurance – Pritchett Agency ("PRM Insurance," "we," "us," or
            "our"). By using our website or opting in to receive text messages from us, you agree to these terms.
          </p>

          <h2 className="text-base font-semibold mt-8 mb-2">Messaging Terms &amp; Conditions</h2>
          <p className="mb-3">
            You agree to receive messages (including Customer Care, quote follow-ups and appointment reminders,
            policy updates, billing and renewal reminders, and promotional/marketing offers) from Farmers Insurance –
            Pritchett Agency. Messages may be sent using automated technology.
          </p>
          <ul className="list-disc pl-5 mb-3 space-y-1">
            <li><span className="font-medium">Message frequency varies.</span></li>
            <li><span className="font-medium">Message and data rates may apply.</span></li>
            <li>
              For help, reply <span className="font-medium">HELP</span> or email us at{" "}
              <a href="mailto:jessydpritchett@gmail.com" className="underline">jessydpritchett@gmail.com</a>. You can
              also call us at <a href="tel:4177661819" className="underline">(417) 766-1819</a>.
            </li>
            <li>
              You can opt out at any time by replying <span className="font-medium">STOP</span>. After opting out,
              you will receive one final confirmation message.
            </li>
            <li>
              Consent to receive text messages is not a condition of purchasing any goods or services from us.
            </li>
            <li>
              Carriers are not liable for delayed or undelivered messages.
            </li>
          </ul>

          <h2 className="text-base font-semibold mt-8 mb-2">Use of Our Website</h2>
          <p className="mb-3">
            The content on prmins.com is provided for general informational purposes about insurance products
            offered by Farmers Insurance – Pritchett Agency. It does not constitute a binding offer of coverage.
            Actual coverage is subject to the terms, conditions, and exclusions of the applicable insurance policy
            as underwritten by the relevant carrier.
          </p>

          <h2 className="text-base font-semibold mt-8 mb-2">Quote Requests</h2>
          <p className="mb-3">
            Submitting a quote request through our website does not guarantee approval, a specific rate, or the
            issuance of a policy. A licensed agent will follow up with you to discuss your options.
          </p>

          <h2 className="text-base font-semibold mt-8 mb-2">Privacy</h2>
          <p className="mb-3">
            Your use of our website and our text messaging program is also governed by our{" "}
            <Link href="/privacy-policy" className="underline">Privacy Policy</Link>, which describes how we collect,
            use, and protect your information.
          </p>

          <h2 className="text-base font-semibold mt-8 mb-2">Changes to These Terms</h2>
          <p className="mb-3">
            We may update these Terms &amp; Conditions from time to time. Any changes will be posted on this page
            with an updated effective date.
          </p>

          <h2 className="text-base font-semibold mt-8 mb-2">Contact Us</h2>
          <p className="mb-3">
            Questions about these terms? Contact us at{" "}
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
