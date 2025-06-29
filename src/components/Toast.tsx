import Snackbar, { type SnackbarCloseReason } from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

interface ToastProps {
  open: boolean;
  message?: string;
  severity?: "success" | "error" | "warning" | "info";
  onClose: (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => void;
  autoHideDuration?: number;
}

export default function Toast({ 
  open, 
  onClose, 
  message, 
  severity = "success",
  autoHideDuration = 6000
}: ToastProps) {
  
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    // Don't close on clickaway to ensure user sees the error
    if (reason === 'clickaway' && severity === 'error') {
      return;
    }
    onClose(event, reason);
  };

  return (
    <Snackbar 
      open={open} 
      autoHideDuration={autoHideDuration} 
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {message || "Operation successful!"}
      </Alert>
    </Snackbar>
  );
}