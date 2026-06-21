import Link from "next/link";

export const dynamic = "force-static";

export default function TermsAndConditionsPage() {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>
      <p className="text-sm mb-4">
        Welcome to OneClq. These Terms & Conditions (“Terms”) govern your use of
        the OneClq mobile application (“App”) and related services. By
        downloading, accessing, or using OneClq, you agree to these Terms. If
        you do not agree, please do not use the App.
      </p>

      {/* 1. About OneClq */}
      <h2 className="font-semibold mt-6 mb-2">1. About OneClq</h2>
      <ul className="text-sm list-disc list-outside pl-5 mb-10">
        <li>OneClq is a price comparison and discovery platform.</li>
        <li>
          We allow users to search products across multiple e-commerce platforms
          and compare prices, deals, and offers.
        </li>
        <li>
          Final purchases are completed on third-party websites or apps (e.g.,
          Amazon, Flipkart, Ajio, Myntra, Nykaa, etc.). OneClq does not sell or
          deliver products directly.
        </li>
      </ul>

      {/* 2. Eligibility */}
      <h2 className="font-semibold mt-6 mb-2">2. Eligibility</h2>
      <ul className="text-sm list-disc list-outside pl-5 mb-10">
        <li>You must be at least 13 years old to use OneClq.</li>
        <li>
          If you are under 18, you may use the App only with the involvement of
          a parent or guardian.
        </li>
      </ul>

      {/* 3. Account & User Responsibilities */}
      <h2 className="font-semibold mt-6 mb-2">
        3. Account & User Responsibilities
      </h2>
      <ul className="text-sm list-disc list-outside pl-5 mb-10">
        <li>
          Some features may require you to create an account or provide
          information.
        </li>
        <li>You agree to provide accurate and up-to-date information.</li>
        <li>
          You are responsible for maintaining the confidentiality of your
          account and activities within it.
        </li>
      </ul>

      {/* 4. Third-Party Services */}
      <h2 className="font-semibold mt-6 mb-2">4. Third-Party Services</h2>
      <p className="text-sm mb-2">
        OneClq provides links or redirects to third-party e-commerce sites. We
        are not responsible for:
      </p>
      <ul className="text-sm list-disc list-outside pl-5 mb-10">
        <li>Product descriptions, availability, pricing, or delivery.</li>
        <li>Transactions, payments, refunds, or disputes.</li>
        <li>
          Your interaction with third-party sites is governed by their
          respective terms & policies.
        </li>
      </ul>

      {/* 5. Payments & Offers */}
      <h2 className="font-semibold mt-6 mb-2">5. Payments & Offers</h2>
      <ul className="text-sm list-disc list-outside pl-5 mb-10">
        <li>
          All payments for products/services are processed on third-party
          platforms.
        </li>
        <li>OneClq does not store your payment details.</li>
        <li>
          Coupons, discounts, or cashbacks displayed in the App may be provided
          by third-party merchants and are subject to their terms.
        </li>
      </ul>

      {/* 6. Data & Privacy */}
      <h2 className="font-semibold mt-6 mb-2">6. Data & Privacy</h2>
      <ul className="text-sm list-disc list-outside pl-5 mb-10">
        <li>
          By using OneClq, you agree to our{" "}
          <Link href="/privacy-policy" className="text-blue-600">
            Privacy Policy
          </Link>
          .
        </li>
        <li>We may collect usage data to improve services.</li>
        <li>We do not sell personal data to advertisers.</li>
      </ul>

      {/* 7. Restrictions on Use */}
      <h2 className="font-semibold mt-6 mb-2">7. Restrictions on Use</h2>
      <p className="text-sm mb-2">You agree not to:</p>
      <ul className="text-sm list-disc list-outside pl-5 mb-10">
        <li>Misuse the App for fraudulent or unlawful activities.</li>
        <li>Copy, modify, reverse-engineer, or resell any part of the App.</li>
        <li>Use automated tools (bots, scrapers) without authorization.</li>
      </ul>

      {/* 8. Intellectual Property */}
      <h2 className="font-semibold mt-6 mb-2">8. Intellectual Property</h2>
      <ul className="text-sm list-disc list-outside pl-5 mb-10">
        <li>
          All rights, trademarks, and content in the OneClq App belong to us or
          our licensors.
        </li>
        <li>
          Third-party names, logos, and trademarks (e.g., Amazon, Flipkart)
          belong to their respective owners. Their use in OneClq is descriptive
          only and does not imply endorsement.
        </li>
      </ul>

      {/* 9. Limitation of Liability */}
      <h2 className="font-semibold mt-6 mb-2">9. Limitation of Liability</h2>
      <ul className="text-sm list-disc list-outside pl-5 mb-10">
        <li>OneClq is provided on an “as is” and “as available” basis.</li>
        <li>
          We do not guarantee uninterrupted access, error-free operation, or
          accuracy of third-party data.
        </li>
        <li>
          We are not liable for any loss, damage, or dispute arising from your
          use of third-party sites.
        </li>
      </ul>

      {/* 10. Termination */}
      <h2 className="font-semibold mt-6 mb-2">10. Termination</h2>
      <p className="text-sm mb-10">
        We may suspend or terminate your access to OneClq if you violate these
        Terms or misuse the App.
      </p>

      {/* 11. Changes to Terms */}
      <h2 className="font-semibold mt-6 mb-2">11. Changes to Terms</h2>
      <p className="text-sm mb-10">
        We may update these Terms from time to time. Continued use of the App
        after changes means you accept the updated Terms.
      </p>

      {/* 12. Governing Law */}
      <h2 className="font-semibold mt-6 mb-2">12. Governing Law</h2>
      <p className="text-sm mb-10">
        These Terms are governed by the laws of India. Any disputes shall be
        subject to the jurisdiction of courts in [Your City/State].
      </p>

      {/* 13. Contact Us */}
      <h2 className="font-semibold mt-6 mb-2">13. Contact Us</h2>
      <p className="text-sm mb-4">
        If you have any questions about these Terms, please contact:
      </p>
      <ul className="text-sm list-disc list-outside pl-5">
        <li>OneClq Support</li>
        <li>
          Email:{" "}
          <Link href="mailto:partner@oneclq.com" className="text-blue-600">
            partner@oneclq.com
          </Link>
        </li>
      </ul>
    </div>
  );
}
