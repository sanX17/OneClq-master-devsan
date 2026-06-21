import Link from "next/link";

export const dynamic = "force-static";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-sm mb-4">
        OneClq (“we,” “our,” or “us”) operates as a super app and price
        comparison platform. This Privacy Policy explains how we collect, use,
        and protect your information when you use our app. If you do not agree,
        please do not use the App.
      </p>

      {/* 1. Information We Collect */}
      <h2 className="font-semibold mt-6 mb-2">1. Information We Collect</h2>
      <p className="text-sm mb-2">When you use OneClq, we may collect:</p>
      <ul className="text-sm list-disc list-outside pl-5 mb-4">
        <li>
          <strong>Account Information:</strong> Name, email, phone number (for
          login/signup).
        </li>
        <li>
          <strong>Usage Data:</strong> Search queries, preferences, interactions
          with products.
        </li>
        <li>
          <strong>Device Information:</strong> Device type, operating system, IP
          address.
        </li>
        <li>
          <strong>Cookies & Tracking:</strong> To improve app performance and
          show relevant content.
        </li>
      </ul>
      <p className="text-sm mb-10">
        We do not collect or store payment details.
      </p>

      {/* 2. How We Use Your Information */}
      <h2 className="font-semibold mt-6 mb-2">
        2. How We Use Your Information
      </h2>
      <ul className="text-sm list-disc list-outside pl-5 mb-10">
        <li>Provide and improve our services.</li>
        <li>Personalize recommendations and search results.</li>
        <li>Communicate updates, offers, or security alerts.</li>
        <li>Ensure account security and fraud prevention.</li>
      </ul>

      {/* 3. Affiliate Links & Third-Party Sites */}
      <h2 className="font-semibold mt-6 mb-2">
        3. Affiliate Links & Third-Party Sites
      </h2>
      <ul className="text-sm list-disc list-outside pl-5 mb-10">
        <li>OneClq provides product comparisons using affiliate links.</li>
        <li>
          When you click on a product, you may be redirected to third-party
          platforms such as Amazon, Flipkart, Ajio, Myntra, Nykaa, etc.
        </li>
        <li>
          Payments are made directly on those platforms. OneClq does not process
          or store any payment details.
        </li>
        <li>
          Prices and product details may change. Comparison results may not
          always be 100% accurate.
        </li>
      </ul>

      {/* 4. Data Sharing */}
      <h2 className="font-semibold mt-6 mb-2">4. Data Sharing</h2>
      <p className="text-sm mb-2">
        We do not sell or rent your personal data. We may share limited
        information with:
      </p>
      <ul className="text-sm list-disc list-outside pl-5 mb-10">
        <li>Service Providers</li>
        <li>
          Legal Authorities (if required by law or to protect rights and
          safety).
        </li>
      </ul>

      {/* 5. Data Security */}
      <h2 className="font-semibold mt-6 mb-2">5. Data Security</h2>
      <p className="text-sm mb-10">
        We use industry-standard security measures to protect your data.
        However, no system is fully secure, and we cannot guarantee absolute
        security.
      </p>

      {/* 6. Your Rights */}
      <h2 className="font-semibold mt-6 mb-2">6. Your Rights</h2>
      <p className="text-sm mb-2">You can:</p>
      <ul className="text-sm list-disc list-outside pl-5 mb-10">
        <li>Access, update, or delete your account information.</li>
        <li>Opt out of promotional emails.</li>
        <li>Request data deletion by contacting us.</li>
      </ul>

      {/* 7. Changes to This Privacy Policy */}
      <h2 className="font-semibold mt-6 mb-2">
        7. Changes to This Privacy Policy
      </h2>
      <p className="text-sm mb-10">
        We may update this Privacy Policy from time to time. Any changes will be
        posted here with an updated “Last Updated” date. We encourage you to
        review it periodically.
      </p>

      {/* 8. Contact Information */}
      <h2 className="font-semibold mt-6 mb-2">8. Contact Information</h2>
      <p className="text-sm mb-4">
        If you have questions or concerns about this Privacy Policy, contact us
        at:{" "}
        <Link href="mailto:partner@oneclq.com" className="text-blue-600">
          partner@oneclq.com
        </Link>
      </p>
    </div>
  );
}
