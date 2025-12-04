"use client";

import { useState } from "react";
import {
  Paper,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  RateReview as ReviewIcon,
  Verified as VerifiedIcon,
  Edit as EditIcon,
  Send as SendIcon,
  Error as ErrorIcon,
} from "@mui/icons-material";

const WORKFLOW_STAGES = ["draft", "tech-review", "approved"];

const STAGE_LABELS = {
  draft: "Draft",
  "tech-review": "Tech Review",
  approved: "Approved",
};

const STAGE_COLORS = {
  draft: "#5F6C76",
  "tech-review": "#0077B5",
  approved: "#00684A",
};

export default function WorkflowStatus({ episode, onWorkflowUpdate }) {
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const workflow = episode.workflow || {
    currentStage: "draft",
    history: [],
  };

  const currentStageIndex = WORKFLOW_STAGES.indexOf(workflow.currentStage);

  async function handleSubmitForReview() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/episodes/${episode._id}/workflow/submit-review`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Failed to submit for review");
      }

      const data = await res.json();
      onWorkflowUpdate?.(data.episode);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleReview(decision) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/episodes/${episode._id}/workflow/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision, notes }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit review");
      }

      const data = await res.json();
      onWorkflowUpdate?.(data.episode);
      setReviewDialogOpen(false);
      setNotes("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/episodes/${episode._id}/workflow/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });

      if (!res.ok) {
        throw new Error("Failed to approve episode");
      }

      const data = await res.json();
      onWorkflowUpdate?.(data.episode);
      setApproveDialogOpen(false);
      setNotes("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  }

  function getActionIcon(action) {
    switch (action) {
      case "created":
        return <EditIcon />;
      case "submitted-for-review":
        return <SendIcon />;
      case "review-approved":
        return <ReviewIcon />;
      case "changes-requested":
        return <ErrorIcon />;
      case "approved":
        return <VerifiedIcon />;
      default:
        return <CheckCircleIcon />;
    }
  }

  function getActionColor(action) {
    switch (action) {
      case "created":
        return "grey";
      case "submitted-for-review":
        return "info";
      case "review-approved":
        return "primary";
      case "changes-requested":
        return "warning";
      case "approved":
        return "success";
      default:
        return "default";
    }
  }

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        Workflow Status
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {/* Workflow Stepper */}
      <Stepper activeStep={currentStageIndex} sx={{ mb: 4 }}>
        {WORKFLOW_STAGES.map((stage, index) => (
          <Step key={stage} completed={index < currentStageIndex}>
            <StepLabel
              StepIconProps={{
                sx: {
                  color: index <= currentStageIndex ? STAGE_COLORS[stage] : undefined,
                },
              }}
            >
              {STAGE_LABELS[stage]}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Current Stage Info */}
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Current Stage:
          </Typography>
          <Chip
            label={STAGE_LABELS[workflow.currentStage]}
            sx={{
              backgroundColor: `${STAGE_COLORS[workflow.currentStage]}15`,
              color: STAGE_COLORS[workflow.currentStage],
              fontWeight: 600,
              borderColor: STAGE_COLORS[workflow.currentStage],
              borderWidth: 1,
              borderStyle: "solid",
            }}
          />
        </Stack>

        {/* Stage-specific information */}
        {workflow.draftedBy && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Drafted by: {workflow.draftedBy.name} on {formatDate(workflow.draftedBy.timestamp)}
          </Typography>
        )}
        {workflow.submittedForReview && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Submitted for review by: {workflow.submittedForReview.name} on{" "}
            {formatDate(workflow.submittedForReview.timestamp)}
          </Typography>
        )}
        {workflow.reviewedBy && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Reviewed by: {workflow.reviewedBy.name} on {formatDate(workflow.reviewedBy.timestamp)}
            {workflow.reviewedBy.notes && ` - ${workflow.reviewedBy.notes}`}
          </Typography>
        )}
        {workflow.approvedBy && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Approved by: {workflow.approvedBy.name} on {formatDate(workflow.approvedBy.timestamp)}
            {workflow.approvedBy.notes && ` - ${workflow.approvedBy.notes}`}
          </Typography>
        )}
      </Box>

      {/* Action Buttons */}
      <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
        {workflow.currentStage === "draft" && (
          <Button
            variant="contained"
            startIcon={loading ? <CircularProgress size={16} /> : <SendIcon />}
            onClick={handleSubmitForReview}
            disabled={loading}
          >
            Submit for Review
          </Button>
        )}
        {workflow.currentStage === "tech-review" && (
          <>
            <Button
              variant="contained"
              color="success"
              startIcon={loading ? <CircularProgress size={16} /> : <CheckCircleIcon />}
              onClick={() => setReviewDialogOpen(true)}
              disabled={loading}
            >
              Approve Review
            </Button>
            <Button
              variant="outlined"
              color="warning"
              startIcon={loading ? <CircularProgress size={16} /> : <ErrorIcon />}
              onClick={() => setReviewDialogOpen(true)}
              disabled={loading}
            >
              Request Changes
            </Button>
          </>
        )}
        {workflow.currentStage === "tech-review" && workflow.reviewedBy?.decision === "approved" && (
          <Button
            variant="contained"
            color="success"
            startIcon={loading ? <CircularProgress size={16} /> : <VerifiedIcon />}
            onClick={() => setApproveDialogOpen(true)}
            disabled={loading}
          >
            Final Approval
          </Button>
        )}
      </Stack>

      {/* Workflow History */}
      {workflow.history && workflow.history.length > 0 && (
        <>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
            Workflow History
          </Typography>
          <List sx={{ bgcolor: "#F7FAFC", borderRadius: 2, p: 0 }}>
            {workflow.history.slice().reverse().map((entry, index) => (
              <Box key={index}>
                <ListItem
                  sx={{
                    py: 2,
                    px: 2,
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ width: "100%", mb: 1 }}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: getActionColor(entry.action) === "success" ? "#00684A15" :
                                getActionColor(entry.action) === "primary" ? "#0077B515" :
                                getActionColor(entry.action) === "warning" ? "#ED640015" :
                                getActionColor(entry.action) === "info" ? "#0066CC15" : "#5F6C7615",
                        color: getActionColor(entry.action) === "success" ? "#00684A" :
                               getActionColor(entry.action) === "primary" ? "#0077B5" :
                               getActionColor(entry.action) === "warning" ? "#ED6400" :
                               getActionColor(entry.action) === "info" ? "#0066CC" : "#5F6C76",
                      }}
                    >
                      {getActionIcon(entry.action)}
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" fontWeight={600}>
                        {entry.action.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {entry.user.name} • {formatDate(entry.timestamp)}
                      </Typography>
                    </Box>
                  </Stack>
                  {entry.notes && (
                    <Box
                      sx={{
                        pl: 7,
                        width: "100%",
                      }}
                    >
                      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                        "{entry.notes}"
                      </Typography>
                    </Box>
                  )}
                </ListItem>
                {index < workflow.history.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        </>
      )}

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onClose={() => setReviewDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Review Episode</DialogTitle>
        <DialogContent>
          <TextField
            label="Review Notes (optional)"
            multiline
            rows={4}
            fullWidth
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => handleReview("changes-requested")}
            color="warning"
            disabled={loading}
          >
            Request Changes
          </Button>
          <Button
            onClick={() => handleReview("approved")}
            variant="contained"
            color="success"
            disabled={loading}
          >
            Approve
          </Button>
        </DialogActions>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog open={approveDialogOpen} onClose={() => setApproveDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Final Approval</DialogTitle>
        <DialogContent>
          <TextField
            label="Approval Notes (optional)"
            multiline
            rows={4}
            fullWidth
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApproveDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleApprove}
            variant="contained"
            color="success"
            disabled={loading}
          >
            Approve
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
