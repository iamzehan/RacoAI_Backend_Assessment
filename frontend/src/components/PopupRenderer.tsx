import { useState } from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

import { usePopup } from "../contexts/PopupContext";

export function PopupRenderer() {
  const { popup, closePopup } = usePopup();

  const [loadingIndex, setLoadingIndex] =
    useState<number | null>(null);

  if (!popup) return null;

  const handleAction = async (
    index: number
  ) => {
    const action = popup.actions?.[index];

    if (!action) return;

    try {
      setLoadingIndex(index);

      await action.onClick?.();

      if (action.autoClose !== false) {
        closePopup();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingIndex(null);
    }
  };

  return (
    <Dialog
      open
      fullWidth
      maxWidth={popup.size ?? "sm"}
      onClose={
        popup.closeOnBackdrop === false
          ? undefined
          : closePopup
      }
    >
      <DialogTitle sx={{fontWeight: "bold"}}>{popup.title}</DialogTitle>

      <DialogContent color="text.secondary">

        {popup.description && (
          <p>{popup.description}</p>
        )}

        {popup.content}

      </DialogContent>

      <DialogActions>
        {popup.loading && <CircularProgress/>}
        {!popup.loading && popup.actions?.map(
          (action, index) => (
            <Button
              key={action.label}
              disabled={
                action.disabled ||
                loadingIndex !== null
              }
              color={
                action.variant === "danger"
                  ? "error"
                  : action.variant ===
                    "success"
                  ? "success"
                  : "inherit"
              }
              variant="contained"
              onClick={() =>
                handleAction(index)
              }
            >
              {loadingIndex === index
                ? "Loading..."
                : action.label}
            </Button>
          )
        )}

      </DialogActions>
    </Dialog>
  );
}