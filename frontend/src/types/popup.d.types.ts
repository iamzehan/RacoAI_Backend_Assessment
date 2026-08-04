import {type ReactNode} from "react";

export type PopupVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "success";

export type PopupSize =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl";

export interface PopupAction {
  label: string;

  variant?: PopupVariant;

  disabled?: boolean;

  loading?: boolean;

  autoClose?: boolean;

  onClick?: () => void | Promise<void>;
}

export interface PopupOptions {
  title: string;

  description?: string;

  content?: ReactNode;

  actions?: PopupAction[];

  size?: PopupSize;

  closeOnBackdrop?: boolean;

  closeOnEscape?: boolean;
}

export interface ConfirmOptions {
  title: string;

  description?: string;

  confirmText?: string;

  cancelText?: string;

  confirmVariant?: PopupVariant;

  onConfirm?: () => void | Promise<void>;

  onCancel?: () => void;
}

export interface AlertOptions {
  title: string;

  description?: string;
}