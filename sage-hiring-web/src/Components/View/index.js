import React, { useState } from 'react';
import { set, cloneDeep } from 'lodash';
import {
  Container,
  Typography,
  Box,
  Avatar,
  Divider,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@material-ui/core';
import {
  Close as CloseIcon,
  Save as SaveIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@material-ui/icons';
import { useStore } from '../../Stores';
import CustomerSchema from '../../Schemas/CustomerSchema';
import { updateCustomer, destroyCustomer } from '../../Services/Customers';
import Trans, { t } from '../../Shared/Trans';
import { ADDRESS_FIELDS } from '../../constants';
import './style.sass';

export default () => {
  const { state, dispatch } = useStore();
  const { customer, mode } = state;
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState(false);
  const [provisory, setProvisory] = useState(false);
  const [openDialogDelete, setOpenDialogDelete] = useState(false);

  const close = () => {
    dispatch({ type: 'SWITCH_VIEW', value: 'list' });
  };

  const validateProvisory = (prov) => CustomerSchema
    .validate(prov || provisory || {}, { abortEarly: false });

  const inputField = (ev) => {
    const { target } = ev;
    const { id, value } = target;
    const c = provisory;
    set(c, id, value);
    setProvisory(c);
    const validation = validateProvisory();
    setError(validation.error);
  };

  const errorMessage = (path) => {
    if (error && error.details) {
      const found = error.details.find((d) => d.context.key === path);
      if (found) return found.message;
    }
    return '';
  };

  const changeEdit = () => {
    if (!editing) {
      setProvisory(cloneDeep(customer));
      setError(validateProvisory(customer).error);
    } else {
      setProvisory(null);
    }
    setEditing(!editing);
  };

  const save = async () => {
    const updated = await updateCustomer(provisory);
    updated.addresses = provisory.addresses;
    dispatch({ type: 'FETCH_CUSTOMER', value: updated });
    setEditing(false);
  };

  const deleteIt = async (c) => {
    await destroyCustomer(c.customerId);
    dispatch({ type: 'SWITCH_VIEW', value: 'list' });
  };

  return (
    <Container maxWidth="lg" className={`view-customer ${mode}`}>
      <Box className="box-close">
        <CloseIcon onClick={close} />
      </Box>
      {customer && (
        <>
          <Box className="box-avatar">
            <Avatar />
          </Box>
          <Box>
            {editing ? (
              <>
                <div className="grid-2-columns">
                  <TextField onInput={inputField} defaultValue={provisory.firstName} error={!!errorMessage('firstName')} id="firstName" variant="outlined" label={t('First name')} fullWidth />
                  <TextField onInput={inputField} defaultValue={provisory.lastName} error={!!errorMessage('lastName')} id="lastName" variant="outlined" label={t('Last name')} fullWidth />
                </div>
              </>
            ) : (
              <>
                <Typography variant="h4">
                  {customer.firstName}
                  {' '}
                  {customer.lastName}
                </Typography>
              </>
            )}
          </Box>
          <Box>
            {editing ? (
              <>
                <TextField onInput={inputField} defaultValue={provisory.additional} error={!!errorMessage('additional')} id="additional" variant="outlined" label={t('Additional')} fullWidth />
              </>
            ) : (
              <>
                <Typography>{customer.additional}</Typography>
              </>
            )}
          </Box>
          {Array.isArray(customer.addresses) && customer.addresses.map((address, i) => (
            <Box key={address}>
              {editing ? (
                <>
                  {ADDRESS_FIELDS.map((e) => (
                    <Box key={e.field}>
                      <TextField defaultValue={provisory.addresses[i][e.field]} onInput={inputField} error={!!errorMessage(e.field)} id={`addresses[${i}].${e.field}`} label={e.label} variant="outlined" fullWidth placeholder={e.placeholder} />
                    </Box>
                  ))}
                </>
              ) : (
                <>
                  <Divider />
                  <Typography variant="h5">{address.title}</Typography>
                  <Typography>
                    {[address.street, address.streetNumber, address.additional].filter((e) => !!e).join(', ')}
                    {' '}
                  </Typography>
                  <Typography>
                    {[address.district, address.city, address.state, address.country].filter((e) => !!e).join(', ')}
                    {' '}
                  </Typography>
                </>
              )}
            </Box>
          ))}
          <Box>
            {editing ? (
              <>
                <Button startIcon={<EditIcon />} onClick={() => changeEdit()}>
                  <Trans i18nKey="Cancel" />
                </Button>
                <Button color="primary" startIcon={<SaveIcon />} disabled={!!error} onClick={() => save()}>
                  <Trans i18nKey="Save" />
                </Button>
              </>
            ) : (
              <>
                <Button startIcon={<EditIcon />} onClick={() => changeEdit()}>
                  <Trans i18nKey="Edit" />
                </Button>
                <Button color="secondary" startIcon={<DeleteIcon />} onClick={() => setOpenDialogDelete(true)}>
                  <Trans i18nKey="Delete" />
                </Button>
                <Dialog open={openDialogDelete} onClose={() => setOpenDialogDelete(false)} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                  <DialogTitle id="alert-dialog-title"><Trans i18nKey="Do you want delete it?" /></DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      <Trans i18nKey="This action is irreversible" />
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setOpenDialogDelete(false)} color="primary" autoFocus>
                      <Trans i18nKey="Cancel" />
                    </Button>
                    <Button onClick={() => deleteIt(customer)} color="secondary">
                      <Trans i18nKey="Delete" />
                    </Button>
                  </DialogActions>
                </Dialog>
              </>
            )}
          </Box>
        </>
      )}
    </Container>
  );
};
