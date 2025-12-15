import PropTypes from "prop-types";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useTranslation } from "react-i18next";

export default function CancelModal({
  open,
  setOpen,
  handleAcceptCancelBooking,
}) {
  const { t } = useTranslation();

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          className={`text-center`}
          id="alert-dialog-title"
          fontWeight={900}
        >
          <br />
          {t("cancel_validate.title")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t("cancel_validate.description")}
          </DialogContentText>
        </DialogContent>
        <DialogActions className="mb-5 mx-auto gap-2">
          <button
            onClick={handleClose}
            className="text-white bg-gray-900 py-2 px-5 rounded-md"
          >
            {t("cancel_validate.cancel")}
          </button>
          <button
            onClick={handleAcceptCancelBooking}
            className="bg-red-700 text-white py-2 px-5 rounded-md"
          >
            {t("cancel_validate.accept")}
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
}

CancelModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  handleAcceptCancelBooking: PropTypes.func.isRequired,
};
