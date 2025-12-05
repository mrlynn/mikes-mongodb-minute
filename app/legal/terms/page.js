"use client";

import { Box, Typography, Container, Paper, Divider } from "@mui/material";
import Link from "next/link";

export default function TermsOfServicePage() {
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
            Terms of Service
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
              1. Acceptance of Terms
            </Typography>
            <Typography variant="body1" sx={{ color: "#5F6C76", lineHeight: 1.7, mb: 2 }}>
              By accessing and using MongoDB Minute ("the Service"), you accept and agree to be bound by the terms and
              provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </Typography>
            <Typography variant="body1" sx={{ color: "#5F6C76", lineHeight: 1.7 }}>
              MongoDB Minute is an educational platform providing 60-second MongoDB tips and tutorials. The Service is
              provided for informational and educational purposes only.
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
              2. Use License
            </Typography>
            <Typography variant="body1" sx={{ color: "#5F6C76", lineHeight: 1.7, mb: 2 }}>
              Permission is granted to temporarily access the materials on MongoDB Minute for personal, non-commercial
              transitory viewing only. This is the grant of a license, not a transfer of title, and under this license
              you may not:
            </Typography>
            <Box component="ul" sx={{ pl: 3, mb: 2, "& li": { mb: 1, color: "#5F6C76", lineHeight: 1.7 } }}>
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to reverse engineer any software contained on MongoDB Minute</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
            </Box>
            <Typography variant="body1" sx={{ color: "#5F6C76", lineHeight: 1.7 }}>
              This license shall automatically terminate if you violate any of these restrictions and may be terminated
              by MongoDB Minute at any time.
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
              3. User Accounts
            </Typography>
            <Typography variant="body1" sx={{ color: "#5F6C76", lineHeight: 1.7, mb: 2 }}>
              Certain features of the Service may require you to create an account. You are responsible for:
            </Typography>
            <Box component="ul" sx={{ pl: 3, mb: 2, "& li": { mb: 1, color: "#5F6C76", lineHeight: 1.7 } }}>
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use of your account</li>
            </Box>
            <Typography variant="body1" sx={{ color: "#5F6C76", lineHeight: 1.7 }}>
              We reserve the right to suspend or terminate accounts that violate these Terms of Service or engage in
              fraudulent, abusive, or illegal activity.
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
              4. Content and Intellectual Property
            </Typography>
            <Typography variant="body1" sx={{ color: "#5F6C76", lineHeight: 1.7, mb: 2 }}>
              All content on MongoDB Minute, including but not limited to text, graphics, logos, images, and software, is
              the property of MongoDB Minute or its content suppliers and is protected by copyright, trademark, and
              other intellectual property laws.
            </Typography>
            <Typography variant="body1" sx={{ color: "#5F6C76", lineHeight: 1.7, mb: 2 }}>
              MongoDB Minute is not affiliated with, endorsed by, or sponsored by MongoDB, Inc. The use of "MongoDB" in
              the service name is for descriptive purposes only and does not imply any official relationship with
              MongoDB, Inc.
            </Typography>
            <Typography variant="body1" sx={{ color: "#5F6C76", lineHeight: 1.7 }}>
              You may not reproduce, distribute, modify, create derivative works of, publicly display, or otherwise use
              any content from the Service without express written permission.
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
              5. User-Generated Content
            </Typography>
            <Typography variant="body1" sx={{ color: "#5F6C76", lineHeight: 1.7, mb: 2 }}>
              If you submit content to the Service (such as comments, feedback, or contributions), you grant MongoDB
              Minute a non-exclusive, royalty-free, perpetual, and worldwide license to use, reproduce, modify, adapt,
              publish, translate, and distribute such content.
            </Typography>
            <Typography variant="body1" sx={{ color: "#5F6C76", lineHeight: 1.7 }}>
              You represent and warrant that you own or have the necessary rights to grant this license and that your
              content does not violate any third-party rights or applicable laws.
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
              6. Disclaimer
            </Typography>
            <Typography variant="body1" sx={{ color: "#5F6C76", lineHeight: 1.7, mb: 2 }}>
              The materials on MongoDB Minute are provided on an "as is" basis. MongoDB Minute makes no warranties,
              expressed or implied, and hereby disclaims and negates all other warranties including, without limitation,
              implied warranties or conditions of merchantability, fitness for a particular purpose, or
              non-infringement of intellectual property or other violation of rights.
            </Typography>
            <Typography variant="body1" sx={{ color: "#5F6C76", lineHeight: 1.7 }}>
              Further, MongoDB Minute does not warrant or make any representations concerning the accuracy, likely
              results, or reliability of the use of the materials on its website or otherwise relating to such materials
              or on any sites linked to this site.
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
              7. Limitations
            </Typography>
            <Typography variant="body1" sx={{ color: "#5F6C76", lineHeight: 1.7, mb: 2 }}>
              In no event shall MongoDB Minute or its suppliers be liable for any damages (including, without
              limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or
              inability to use the materials on MongoDB Minute, even if MongoDB Minute or a MongoDB Minute authorized
              representative has been notified orally or in writing of the possibility of such damage.
            </Typography>
            <Typography variant="body1" sx={{ color: "#5F6C76", lineHeight: 1.7 }}>
              Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for
              consequential or incidental damages, these limitations may not apply to you.
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
              8. Revisions and Errata
            </Typography>
            <Typography variant="body1" sx={{ color: "#5F6C76", lineHeight: 1.7 }}>
              The materials appearing on MongoDB Minute could include technical, typographical, or photographic errors.
              MongoDB Minute does not warrant that any of the materials on its website are accurate, complete, or
              current. MongoDB Minute may make changes to the materials contained on its website at any time without
              notice.
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
              9. Links
            </Typography>
            <Typography variant="body1" sx={{ color: "#5F6C76", lineHeight: 1.7 }}>
              MongoDB Minute has not reviewed all of the sites linked to its website and is not responsible for the
              contents of any such linked site. The inclusion of any link does not imply endorsement by MongoDB Minute of
              the site. Use of any such linked website is at the user's own risk.
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
              10. Modifications to Terms of Service
            </Typography>
            <Typography variant="body1" sx={{ color: "#5F6C76", lineHeight: 1.7 }}>
              MongoDB Minute may revise these terms of service for its website at any time without notice. By using this
              website you are agreeing to be bound by the then current version of these terms of service.
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
              11. Governing Law
            </Typography>
            <Typography variant="body1" sx={{ color: "#5F6C76", lineHeight: 1.7 }}>
              These terms and conditions are governed by and construed in accordance with the laws of the United States
              and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </Typography>
          </section>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ textAlign: "center" }}>
          <Typography variant="body2" sx={{ color: "#5F6C76", mb: 2 }}>
            Questions about these Terms of Service?
          </Typography>
          <Link
            href="/legal/privacy"
            style={{
              color: "#00684A",
              textDecoration: "none",
              fontWeight: 500,
              marginRight: "16px",
            }}
          >
            Privacy Policy
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

