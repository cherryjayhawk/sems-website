import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Icon } from '@iconify/react';
import { signOut } from 'next-auth/react';

export default function LogoutConfirm({ sideOpen }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  async function handleSignout() {
    const result = await signOut({
      redirect: true,
      callbackUrl: '/auth/signIn'
    })
  }

  return (
    <React.Fragment>
        <div className={`h-1/4 w-full py-2 flex items-center hover:bg-[--button-primary] font-medium cursor-pointer`} onClick={() => handleClickOpen()}>
            <Icon icon="ic:outline-logout" className="mx-2 fill-[--contrast-color]" width="28" />   
            <p>{sideOpen ? "Logout" : ''}</p>
        </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Konfirmasi Keluar"}
        </DialogTitle>
        <DialogContent>
            <DialogContentText>
                Apakah Anda yakin ingin keluar dari akun Anda?
            </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Batal</Button>
          <Button onClick={() => handleSignout()} autoFocus color='error'>
            Keluar
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
