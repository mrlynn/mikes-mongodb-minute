"use client";

import { Box, Typography, Container, Paper, Divider } from "@mui/material";
import Link from "next/link";

export default function CookiePolicyPage() {
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
            Cookie Policy
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
              1. What Are Cookies?
            </Typography>
            <Typography variant="body1" sx={{ color: "#5F6C76", lineHeight: 1.7, mb: 2 }}>
              Cookies are small text files that are placed on your device when you visit a website. They are widely
              used to make websites work more efficiently and provide information to website owners.
            </Typography>
            <Typography variant="body1" sx={{ color: "#5F6C76", lineHeight: 1.7 }}>
              MongoDB Minute uses cookies and similar tracking technologies to enhance your experience, analyze usage
              patterns, and improve our Service.
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
              2. Types of Cookies We Use
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
              2.1 Essential Cookies
            </Typography>
            <Typography variant="body1" sx={{ color: "#5F6C76", lineHeight: 1.7, mb: 2 }}>
              These cookies are necessary for the Service to function properly. They enable core functionality such as
              authentication, security, and access to restricted areas. Without these cookies, services you have asked
              for cannot be provided.
            </Typography>
            <Box
              component="table"
              sx={{
                width: "100%",
                borderCollapse: "collapse",
                mb: 3,
                "& th, & td": {
                  border: "1px solid #E2E8F0",
                  padding: "12px",
                  textAlign: "left",
                },
                "& th": {
                  backgroundColor: "#F7FAFC",
                  fontWeight: 600,
                  color: "#001E2B",
                },
              }}
            >
              <thead>
                <tr>
                  <th>Cookie Name</th>
                  <th>Purpose</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code style={{ fontSize: "0.875rem", color: "#00684A" }}>auth-token</code>
                  </td>
                  <td>Stores authentication token for logged-in users</td>
                  <td>Session / 15 minutes</td>
                </tr>
                <tr>
                  <td>
                    <code style={{ fontSize: "0.875rem", color: "#00684A" }}>session-id</code>
                  </td>
                  <td>Maintains user session state</td>
                  <td>Session</td>
                </tr>
              </tbody>
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
              2.2 Functional Cookies
            </Typography>
            <Typography variant="body1" sx={{ color: "#5F6C76", lineHeight: 1.7, mb: 2 }}>
              These cookies allow the Service to remember choices you make (such as language preferences) and provide
              enhanced, personalized features.
            </Typography>
            <Box
              component="table"
              sx={{
                width: "100%",
                borderCollapse: "collapse",
                mb: 3,
                "& th, & td": {
                  border: "1px solid #E2E8F0",
                  padding: "12px",
                  textAlign: "left",
                },
                "& th": {
                  backgroundColor: "#F7FAFC",
                  fontWeight: 600,
                  color: "#001E2B",
                },
              }}
            >
              <thead>
                <tr>
                  <th>Cookie Name</th>
                  <th>Purpose</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code style={{ fontSize: "0.875rem", color: "#00684A" }}>preferences</code>
                  </td>
                  <td>Stores user interface preferences and settings</td>
                  <td>1 year</td>
                </tr>
                <tr>
                  <td>
                    <code style={{ fontSize: "0.875rem", color: "#00684A" }}>tour-completed</code>
                  </td>
                  <td>Remembers if user has completed onboarding tour</td>
                  <td>1 year</td>
                </tr>
              </tbody>
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
              2.3 Analytics Cookies
            </Typography>
            <Typography variant="body1" sx={{ color: "#5F6C76", lineHeight: 1.7, mb: 2 }}>
              These cookies help us understand how visitors interact with the Service by collecting and reporting
              information anonymously. This helps us improve the Service.
            </Typography>
            <Typography variant="body2" sx={{ color: "#5F6C76", fontStyle: "italic", mb: 2 }}>
              Note: We may use third-party analytics services that set their own cookies. Please refer to their privacy
              policies for more information.
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
              3. Third-Party Cookies
            </Typography>
            <Typography variant="body1" sx={{ color: "#5F6C76", lineHeight: 1.7, mb: 2 }}>
              In addition to our own cookies, we may also use various third-party cookies to report usage statistics of
              the Service and deliver advertisements on and through the Service. These third parties may include:
            </Typography>
            <Box component="ul" sx={{ pl: 3, mb: 2, "& li": { mb: 1, color: "#5F6C76", lineHeight: 1.7 } }}>
              <li>
                <strong>Analytics Providers:</strong> Services that help us analyze how users interact with the Service
              </li>
              <li>
                <strong>Social Media Platforms:</strong> When you connect social media accounts or share content
              </li>
              <li>
                <strong>Content Delivery Networks:</strong> Services that help deliver content efficiently
              </li>
            </Box>
            <Typography variant="body1" sx={{ color: "#5F6C76", lineHeight: 1.7 }}>
              These third parties may use cookies to collect information about your online activities across different
              websites. We do not control these third-party cookies, and they are subject to the respective third
              party's privacy policies.
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
              4. How to Control Cookies
            </Typography>
            <Typography variant="body1" sx={{ color: "#5F6C76", lineHeight: 1.7, mb: 2 }}>
              You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by
              setting your preferences in your browser settings. Most browsers allow you to:
            </Typography>
            <Box component="ul" sx={{ pl: 3, mb: 2, "& li": { mb: 1, color: "#5F6C76", lineHeight: 1.7 } }}>
              <li>See what cookies you have and delete them individually</li>
              <li>Block third-party cookies</li>
              <li>Block cookies from particular sites</li>
              <li>Block all cookies from being set</li>
              <li>Delete all cookies when you close your browser</li>
            </Box>
            <Typography variant="body1" sx={{ color: "#5F6C76", lineHeight: 1.7, mb: 2 }}>
              Please note that if you choose to block or delete cookies, some features of the Service may not function
              properly. Essential cookies cannot be disabled as they are necessary for the Service to function.
            </Typography>
            <Box
              sx={{
                p: 2,
                backgroundColor: "#F7FAFC",
                borderRadius: 2,
                border: "1px solid #E2E8F0",
                mb: 2,
              }}
            >
              <Typography variant="body2" sx={{ color: "#001E2B", fontWeight: 500, mb: 1 }}>
                Browser-Specific Instructions:
              </Typography>
              <Box component="ul" sx={{ pl: 3, m: 0, "& li": { mb: 0.5, color: "#5F6C76", fontSize: "0.875rem" } }}>
                <li>
                  <strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data
                </li>
                <li>
                  <strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data
                </li>
                <li>
                  <strong>Safari:</strong> Preferences → Privacy → Cookies and website data
                </li>
                <li>
                  <strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data
                </li>
              </Box>
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
              5. Do Not Track Signals
            </Typography>
            <Typography variant="body1" sx={{ color: "#5F6C76", lineHeight: 1.7 }}>
              Some browsers include a "Do Not Track" (DNT) feature that signals to websites you visit that you do not
              want to have your online activity tracked. Currently, there is no standard for how DNT signals should be
              interpreted. As such, we do not respond to DNT browser signals or mechanisms at this time.
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
              6. Updates to This Cookie Policy
            </Typography>
            <Typography variant="body1" sx={{ color: "#5F6C76", lineHeight: 1.7 }}>
              We may update this Cookie Policy from time to time to reflect changes in our practices or for other
              operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new
              Cookie Policy on this page and updating the "Last updated" date.
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
              7. Contact Us
            </Typography>
            <Typography variant="body1" sx={{ color: "#5F6C76", lineHeight: 1.7, mb: 2 }}>
              If you have any questions about our use of cookies or this Cookie Policy, please contact us at:
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
            href="/legal/privacy"
            style={{
              color: "#00684A",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Privacy Policy
          </Link>
        </Box>
      </Paper>
    </Container>
  );
}

