import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@material-ui/core";

const ConfirmDialog = ({ open, handleClose, handleConfirm }) => {
  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="confirm-dialog">
      <DialogTitle id="confirm-dialog">Confirm Logout</DialogTitle>
      <DialogContent>
        <DialogContentText>Are you sure you want to logout?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleConfirm} color="primary" autoFocus>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
