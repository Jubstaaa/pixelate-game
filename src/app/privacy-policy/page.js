import Link from "next/link";
import React from "react";

function page() {
  return (
    <div className="prose dark:prose-invert mx-auto">
      <h1>Privacy Policy</h1>

      <p>
        Welcome to Pixel Guess Game (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). This
        Privacy Policy explains how we collect, use, disclose, and safeguard your information when
        you visit our website <Link href="/">https://pixelguessgame.com</Link> (the
        &quot;Site&quot;).
      </p>

      <h2>Information We Collect</h2>
      <p>
        We do not collect any personal information directly. However, third-party services used on
        our website (such as analytics or advertisements) may collect certain data.
      </p>

      <h2>Cookies</h2>
      <p>
        We may use cookies to enhance user experience. You can disable cookies through your browser
        settings.
      </p>

      <h2>Third-Party Services</h2>
      <p>
        Our website may contain links to third-party websites. We are not responsible for their
        privacy policies and recommend reviewing them separately.
      </p>

      <h2>Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy periodically. Any changes will be posted on this page with
        an updated revision date.
      </p>

      <h2>Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, please contact us at{" "}
        <Link href="mailto:ilkerbalcilartr@gmail.com">ilkerbalcilartr@gmail.com</Link>.
      </p>
    </div>
  );
}

export default page;
