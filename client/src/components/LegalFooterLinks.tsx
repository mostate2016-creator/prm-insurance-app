import { Link } from "wouter";

export function LegalFooterLinks() {
  return (
    <p className="text-xs text-muted-foreground">
      <Link href="/privacy-policy" className="hover:underline" data-testid="link-privacy-policy">
        Privacy Policy
      </Link>
      {" · "}
      <Link href="/terms" className="hover:underline" data-testid="link-terms-conditions">
        Terms &amp; Conditions
      </Link>
    </p>
  );
}
