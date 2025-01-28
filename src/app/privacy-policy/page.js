import Link from "next/link";
import React from "react";

function page() {
  return (
    <div className="p-6 max-w-4xl mx-auto text-gray-800">
      <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>

      <p className="mb-4">
        Welcome to Pixel Guess Game (&quot;we,&quot; &quot;our,&quot; or
        &quot;us&quot;). This Privacy Policy explains how we collect, use,
        disclose, and safeguard your information when you visit our website{" "}
        <Link href="https://pixelguessgame.com" className="text-blue-500">
          https://pixelguessgame.com
        </Link>{" "}
        (the &quot;Site&quot;).
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        Information We Collect
      </h2>
      <p className="mb-4">
        We do not collect any personal information directly. However,
        third-party services used on our website (such as analytics or
        advertisements) may collect certain data.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Cookies</h2>
      <p className="mb-4">
        We may use cookies to enhance user experience. You can disable cookies
        through your browser settings.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Third-Party Services</h2>
      <p className="mb-4">
        Our website may contain links to third-party websites. We are not
        responsible for their privacy policies and recommend reviewing them
        separately.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        Changes to This Policy
      </h2>
      <p className="mb-4">
        We may update this Privacy Policy periodically. Any changes will be
        posted on this page with an updated revision date.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Contact Us</h2>
      <p className="mb-4">
        If you have any questions about this Privacy Policy, please contact us
        at{" "}
        <Link href="mailto:ilkerbalcilartr@gmail.com" className="text-blue-500">
          ilkerbalcilartr@gmail.com
        </Link>
        .
      </p>
    </div>
  );
}

export default page;
