import { useState } from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

import { usePopup } from "../contexts/PopupContext";

export function PopupRenderer() {
  const { popup, closePopup } = usePopup();

  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);

  if (!popup) return null;

  const handleAction = async (index: number) => {
    const action = popup.actions?.[index];

    if (!action) return;

    try {
      setLoadingIndex(index);

      await action.onClick?.();

      if (action.autoClose !== false) {
        closePopup();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingIndex(null);
    }
  };

  return (
    <Dialog
      open
      fullWidth
      maxWidth={popup.size ?? "sm"}
      onClose={(event: any, reason?: string) => {
        if (popup.loading) return;

        if (reason === "backdropClick" && popup.closeOnBackdrop === false)
          return;

        if (reason === "escapeKeyDown" && popup.closeOnEscape === false)
          return;

        closePopup();
      }}
    >
      {popup.loading ? (
        <DialogContent
          sx={{
            py: 5,
            px: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: 3,
          }}
        >
          <CircularProgress
            size={48}
            sx={{
              color: "var(--color-brand)",
            }}
          />

          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {popup.title}
          </Typography>

          {popup.description && (
            <Typography color="text.secondary">
              {popup.description}
            </Typography>
          )}
        </DialogContent>
      ) : (
        <>
          <DialogTitle sx={{ fontWeight: 700 }}>
            {popup.title}
          </DialogTitle>

          <DialogContent>
            {popup.description && (
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                {popup.description}
              </Typography>
            )}

            {popup.content}
          </DialogContent>

          <DialogActions>
            {popup.actions?.map((action, index) => (
              <Button
                key={action.label}
                disabled={
                  action.disabled || loadingIndex !== null
                }
                color={
                  action.variant === "danger"
                    ? "error"
                    : action.variant === "success"
                    ? "success"
                    : "inherit"
                }
                variant="contained"
                onClick={() => handleAction(index)}
              >
                {loadingIndex === index
                  ? "Loading..."
                  : action.label}
              </Button>
            ))}
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}