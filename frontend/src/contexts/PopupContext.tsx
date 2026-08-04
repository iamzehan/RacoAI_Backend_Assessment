import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type {
  AlertOptions,
  ConfirmOptions,
  PopupOptions,
} from "../types/popup.types";

import { PopupRenderer } from "../components/PopupRenderer";

interface PopupContextType {
  popup: PopupOptions | null;

  openPopup: (options: PopupOptions) => void;

  closePopup: () => void;

  confirm: (
    options: ConfirmOptions
  ) => Promise<boolean>;

  alert: (
    options: AlertOptions
  ) => Promise<void>;

  success: (
    options: AlertOptions
  ) => Promise<void>;

  error: (
    options: AlertOptions
  ) => Promise<void>;
}

const PopupContext =
  createContext<PopupContextType | null>(null);

type PopupProviderProps = {
  children: ReactNode;
};

export function PopupProvider({
  children,
}: PopupProviderProps) {
  const [popup, setPopup] =
    useState<PopupOptions | null>(null);

  //----------------------------------------------------
  // Basic Controls
  //----------------------------------------------------

  const openPopup = useCallback(
    (options: PopupOptions) => {
      setPopup(options);
    },
    []
  );

  const closePopup = useCallback(() => {
    setPopup(null);
  }, []);

  //----------------------------------------------------
  // Confirm Dialog
  //----------------------------------------------------

  const confirm = useCallback(
    (
      options: ConfirmOptions
    ): Promise<boolean> => {
      return new Promise((resolve) => {
        openPopup({
          title: options.title,

          description: options.description,

          actions: [
            {
              label:
                options.cancelText ??
                "Cancel",

              variant: "secondary",

              onClick: async () => {
                await options.onCancel?.();

                resolve(false);
              },
            },

            {
              label:
                options.confirmText ??
                "Confirm",

              variant:
                options.confirmVariant ??
                "danger",

              onClick: async () => {
                await options.onConfirm?.();

                resolve(true);
              },
            },
          ],
        });
      });
    },
    [openPopup]
  );

  //----------------------------------------------------
  // Alert Dialog
  //----------------------------------------------------

  const alert = useCallback(
    (
      options: AlertOptions
    ): Promise<void> => {
      return new Promise((resolve) => {
        openPopup({
          title: options.title,

          description:
            options.description,

          actions: [
            {
              label: "OK",

              onClick: () => {
                resolve();
              },
            },
          ],
        });
      });
    },
    [openPopup]
  );

  //----------------------------------------------------
  // Success Dialog
  //----------------------------------------------------

  const success = useCallback(
    (
      options: AlertOptions
    ): Promise<void> => {
      return new Promise((resolve) => {
        openPopup({
          title: options.title,

          description:
            options.description,

          actions: [
            {
              label: "Awesome",

              variant: "success",

              onClick: () => {
                resolve();
              },
            },
          ],
        });
      });
    },
    [openPopup]
  );

  //----------------------------------------------------
  // Error Dialog
  //----------------------------------------------------

  const error = useCallback(
    (
      options: AlertOptions
    ): Promise<void> => {
      return new Promise((resolve) => {
        openPopup({
          title: options.title,

          description:
            options.description,

          actions: [
            {
              label: "Try Again",

              variant: "danger",

              onClick: () => {
                resolve();
              },
            },
          ],
        });
      });
    },
    [openPopup]
  );

  //----------------------------------------------------
  // Memo
  //----------------------------------------------------

  const value = useMemo(
    () => ({
      popup,

      openPopup,

      closePopup,

      confirm,

      alert,

      success,

      error,
    }),
    [
      popup,
      openPopup,
      closePopup,
      confirm,
      alert,
      success,
      error,
    ]
  );

  return (
    <PopupContext.Provider value={value}>
      {children}

      <PopupRenderer />
    </PopupContext.Provider>
  );
}

export function usePopup() {
  const context =
    useContext(PopupContext);

  if (!context) {
    throw new Error(
      "usePopup must be used inside PopupProvider."
    );
  }

  return context;
}