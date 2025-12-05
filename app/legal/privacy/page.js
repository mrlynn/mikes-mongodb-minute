"use client";

import { Box, Typography, Container, Paper, Divider } from "@mui/material";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
      <Paper
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 8,
          backgroundColor: "#FFFFFF",
        }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 600,
              mb: 2,
              fontSize: { xs: "1.75rem", md: "2.25rem" },
              color: "#001E2B",
            }}
          >
            Privacy Policy
          </Typography>
          <Typography variant="body2" sx={{ color: "#5F6C76", fontSize: "0.875rem" }}>
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Box sx={{ "& > section": { mb: 4 } }}>
          <section>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                mb: 2,
                fontSize: { xs: "1.25rem", md: "1.5rem" },
                color: "#001E2B",
              }}
            >
              1. Introduction
            </Typography>
            <Typography variant="body1" sx={{ color: "#5F6C76", lineHeight: 1.7, mb: 2 }}>
              MongoDB Minute ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your information when you use our Service.
            </Typography>
            <Typography variant="body1" sx={{ color: "#5F6C76", lineHeight: 1.7 }}>
              Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy,
              please do not access the Service.
            </Typography>
          </section>

          <section>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                mb: 2,
                fontSize: { xs: "1.25rem", md: "1.5rem" },
                color: "#001E2B",
              }}
            >
              2. Information We Collect
            </Typography>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 1.5,
                mt: 3,
                fontSize: "1.125rem",
                color: "#001E2B",
              }}
            >
              2.1 Information You Provide
            </Typography>
            <Typography variant="body1" sx={{ color: "#5F6C76", lineHeight: 1.7, mb: 2 }}>
              We collect information that you provide directly to us, including:
            </Typography>
            <Box component="ul" sx={{ pl: 3, mb: 2, "& li": { mb: 1, color: "#5F6C76", lineHeight: 1.7 } }}>
              <li>
                <strong>Account Information:</strong> Email address (for admin users, restricted to @mongodb.com
                addresses)
              </li>
              <li>
                <strong>User Settings:</strong> Social media handles, API keys (encrypted), and other preferences
              </li>
              <li>
                <strong>Content:</strong> Episode scripts, metadata, and other content you create or submit
              </li>
              <li>
                <strong>Communications:</strong> Information you provide when contacting us for support
              </li>
            </Box>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 1.5,
                mt: 3,
                fontSize: "1.125rem",
                color: "#001E2B",
              }}
            >
              2.2 Automatically Collected Information
            </Typography>
            <Typography variant="body1" sx={{ color: "#5F6C76", lineHeight: 1.7, mb: 2 }}>
              When you access the Service, we may automatically collect certain information, including:
            </Typography>
            <Box component="ul" sx={{ pl: 3, mb: 2, "& li": { mb: 1, color: "#5F6C76", lineHeight: 1.7 } }}>
              <li>
                <strong>Usage Data:</strong> Information about how you interact with the Service, including pages
                visited, time spent, and features used
              </li>
              <li>
                <strong>Device Information:</strong> Browser type, operating system, device identifiers, and IP address
              </li>
              <li>
                <strong>Cookies and Tracking Technologies:</strong> See our{" "}
                <Link href="/legal/cookies" style={{ color: "#00684A", textDecoration: "none" }}>
                  Cookie Policy
                </Link>{" "}
                for more information
              </li>
            </Box>
          </section>

          <section>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                mb: 2,
                fontSize: { xs: "1.25rem", md: "1.5rem" },
                color: "#001E2B",
              }}
            >
              3. How We Use Your Information
            </Typography>
            <Typography variant="body1" sx={{ color: "#5F6C76", lineHeight: 1.7, mb: 2 }}>
              We use the information we collect to:
            </Typography>
            <Box component="ul" sx={{ pl: 3, mb: 2, "& li": { mb: 1, color: "#5F6C76", lineHeight: 1.7 } }}>
              <li>Provide, maintain, and improve the Service</li>
              <li>Authenticate users and manage accounts</li>
              <li>Process and manage content submissions</li>
              <li>Send administrative information, including updates and security alerts</li>
              <li>Respond to your comments, questions, and requests</li>
              <li>Monitor and analyze usage patterns and trends</li>
              <li>Detect, prevent, and address technical issues and security threats</li>
              <li>Comply with legal obligations and enforce our Terms of Service</li>
            </Box>
          </section>

          <section>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                mb: 2,
                fontSize: { xs: "1.25rem", md: "1.5rem" },
                color: "#001E2B",
              }}
            >
              4. Information Sharing and Disclosure
            </Typography>
            <Typography variant="body1" sx={{ color: "#5F6C76", lineHeight: 1.7, mb: 2 }}>
              We do not sell, trade, or rent your personal information to third parties. We may share your information
              in the following circumstances:
            </Typography>
            <Box component="ul" sx={{ pl: 3, mb: 2, "& li": { mb: 1, color: "#5F6C76", lineHeight: 1.7 } }}>
              <li>
                <strong>Service Providers:</strong> We may share information with third-party service providers who
                perform services on our behalf, such as hosting, analytics, and email delivery
              </li>
              <li>
                <strong>Legal Requirements:</strong> We may disclose information if required by law or in response to
                valid requests by public authorities
              </li>
              <li>
                <strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your
                information may be transferred
              </li>
              <li>
                <strong>With Your Consent:</strong> We may share information with your explicit consent
              </li>
            </Box>
          </section>

          <section>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                mb: 2,
                fontSize: { xs: "1.25rem", md: "1.5rem" },
                color: "#001E2B",
              }}
            >
              5. Data Security
            </Typography>
            <Typography variant="body1" sx={{ color: "#5F6C76", lineHeight: 1.7, mb: 2 }}>
              We implement appropriate technical and organizational security measures to protect your information against
              unauthorized access, alteration, disclosure, or destruction. These measures include:
            </Typography>
            <Box component="ul" sx={{ pl: 3, mb: 2, "& li": { mb: 1, color: "#5F6C76", lineHeight: 1.7 } }}>
              <li>Encryption of sensitive data, including API keys</li>
              <li>Secure authentication mechanisms (magic link authentication)</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls and authentication requirements for admin functions</li>
            </Box>
            <Typography variant="body1" sx={{ color: "#5F6C76", lineHeight: 1.7 }}>
              However, no method of transmission over the Internet or electronic storage is 100% secure. While we
              strive to use commercially acceptable means to protect your information, we cannot guarantee absolute
              security.
            </Typography>
          </section>

          <section>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                mb: 2,
                fontSize: { xs: "1.25rem", md: "1.5rem" },
                color: "#001E2B",
              }}
            >
              6. Data Retention
            </Typography>
            <Typography variant="body1" sx={{ color: "#5F6C76", lineHeight: 1.7, mb: 2 }}>
              We retain your information for as long as necessary to fulfill the purposes outlined in this Privacy
              Policy, unless a longer retention period is required or permitted by law. Specifically:
            </Typography>
            <Box component="ul" sx={{ pl: 3, mb: 2, "& li": { mb: 1, color: "#5F6C76", lineHeight: 1.7 } }}>
              <li>Account information is retained while your account is active</li>
              <li>Published content may be retained indefinitely for public access</li>
              <li>We may retain certain information for legal, regulatory, or business purposes</li>
            </Box>
          </section>

          <section>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                mb: 2,
                fontSize: { xs: "1.25rem", md: "1.5rem" },
                color: "#001E2B",
              }}
            >
              7. Your Rights and Choices
            </Typography>
            <Typography variant="body1" sx={{ color: "#5F6C76", lineHeight: 1.7, mb: 2 }}>
              Depending on your location, you may have certain rights regarding your personal information, including:
            </Typography>
            <Box component="ul" sx={{ pl: 3, mb: 2, "& li": { mb: 1, color: "#5F6C76", lineHeight: 1.7 } }}>
              <li>
                <strong>Access:</strong> Request access to your personal information
              </li>
              <li>
                <strong>Correction:</strong> Request correction of inaccurate or incomplete information
              </li>
              <li>
                <strong>Deletion:</strong> Request deletion of your personal information
              </li>
              <li>
                <strong>Objection:</strong> Object to processing of your personal information
              </li>
              <li>
                <strong>Portability:</strong> Request transfer of your data to another service
              </li>
              <li>
                <strong>Withdrawal of Consent:</strong> Withdraw consent where processing is based on consent
              </li>
            </Box>
            <Typography variant="body1" sx={{ color: "#5F6C76", lineHeight: 1.7 }}>
              To exercise these rights, please contact us using the information provided in the "Contact Us" section
              below.
            </Typography>
          </section>

          <section>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                mb: 2,
                fontSize: { xs: "1.25rem", md: "1.5rem" },
                color: "#001E2B",
              }}
            >
              8. Third-Party Services
            </Typography>
            <Typography variant="body1" sx={{ color: "#5F6C76", lineHeight: 1.7, mb: 2 }}>
              The Service may contain links to third-party websites or integrate with third-party services (such as
              social media platforms). We are not responsible for the privacy practices of these third parties. We
              encourage you to review their privacy policies.
            </Typography>
            <Typography variant="body1" sx={{ color: "#5F6C76", lineHeight: 1.7 }}>
              When you connect your social media accounts (YouTube, TikTok, LinkedIn, Instagram, X), you authorize us to
              access certain information from those services as permitted by their terms and your privacy settings.
            </Typography>
          </section>

          <section>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                mb: 2,
                fontSize: { xs: "1.25rem", md: "1.5rem" },
                color: "#001E2B",
              }}
            >
              9. Children's Privacy
            </Typography>
            <Typography variant="body1" sx={{ color: "#5F6C76", lineHeight: 1.7 }}>
              The Service is not intended for children under the age of 13. We do not knowingly collect personal
              information from children under 13. If you are a parent or guardian and believe your child has provided
              us with personal information, please contact us immediately.
            </Typography>
          </section>

          <section>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                mb: 2,
                fontSize: { xs: "1.25rem", md: "1.5rem" },
                color: "#001E2B",
              }}
            >
              10. International Data Transfers
            </Typography>
            <Typography variant="body1" sx={{ color: "#5F6C76", lineHeight: 1.7 }}>
              Your information may be transferred to and processed in countries other than your country of residence.
              These countries may have data protection laws that differ from those in your country. By using the
              Service, you consent to the transfer of your information to these countries.
            </Typography>
          </section>

          <section>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                mb: 2,
                fontSize: { xs: "1.25rem", md: "1.5rem" },
                color: "#001E2B",
              }}
            >
              11. Changes to This Privacy Policy
            </Typography>
            <Typography variant="body1" sx={{ color: "#5F6C76", lineHeight: 1.7 }}>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new
              Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy
              Policy periodically for any changes.
            </Typography>
          </section>

          <section>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                mb: 2,
                fontSize: { xs: "1.25rem", md: "1.5rem" },
                color: "#001E2B",
              }}
            >
              12. Contact Us
            </Typography>
            <Typography variant="body1" sx={{ color: "#5F6C76", lineHeight: 1.7, mb: 2 }}>
              If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
            </Typography>
            <Box
              sx={{
                p: 2,
                backgroundColor: "#F7FAFC",
                borderRadius: 2,
                border: "1px solid #E2E8F0",
              }}
            >
              <Typography variant="body1" sx={{ color: "#001E2B", fontWeight: 500, mb: 0.5 }}>
                MongoDB Minute
              </Typography>
              <Typography variant="body2" sx={{ color: "#5F6C76" }}>
                Email: privacy@mongodbminute.com
              </Typography>
            </Box>
          </section>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ textAlign: "center" }}>
          <Typography variant="body2" sx={{ color: "#5F6C76", mb: 2 }}>
            Related Policies
          </Typography>
          <Link
            href="/legal/terms"
            style={{
              color: "#00684A",
              textDecoration: "none",
              fontWeight: 500,
              marginRight: "16px",
            }}
          >
            Terms of Service
          </Link>
          <Link
            href="/legal/cookies"
            style={{
              color: "#00684A",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Cookie Policy
          </Link>
        </Box>
      </Paper>
    </Container>
  );
}

