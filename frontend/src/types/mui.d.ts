export {};

import type { PaletteColorOptions } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    brand: PaletteColorOptions;
  }

  interface PaletteOptions {
    brand?: PaletteColorOptions;
  }
}

declare module "@mui/material/CircularProgress" {
  interface CircularProgressPropsColorOverrides {
    brand: true;
  }
}