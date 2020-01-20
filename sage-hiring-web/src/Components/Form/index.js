import React, { useState, useEffect } from 'react';
import { set } from 'lodash';
import {
  Container,
  TextField,
  Box,
  Avatar,
  Button,
} from '@material-ui/core';
import { CheckBox, Close } from '@material-ui/icons';
import { useStore } from '../../Stores';
import CustomerSchema from '../../Schemas/CustomerSchema';
import { t } from '../../Shared/Trans';
import { createCustomer } from '../../Services/Customers';
import { createAddress } from '../../Services/Addresses';
import { ADDRESS_FIELDS } from '../../constants';
import './style.sass';


export default () => {
  const { state, dispatch } = useStore();
  const [step, setStep] = useState(0);
  const [error, setError] = useState();

  const validateCustomer = () => CustomerSchema
    .validate(state.customer || {}, { abortEarly: false });

  const inputField = (ev) => {
    const { target } = ev;
    const { id, value } = target;
    let { customer } = state;
    customer = customer || {};
    set(customer, id, value);
    dispatch({ type: 'CHANGE_CUSTOMER', value: customer });
    const validation = validateCustomer();
    setError(validation.error);
  };

  const close = () => {
    dispatch({ type: 'SWITCH_VIEW', value: 'list' });
    setStep(0);
    setError(null);
  };

  const submitForm = async (ev) => {
    ev.preventDefault();
    if (step === 0 && state.customer && state.customer.firstName && state.customer.lastName) {
      setStep(1);
    }
    if (step === 1 && !validateCustomer().error) {
      const { customer } = state;
      const { addresses, ...clean } = customer;
      const saved = await createCustomer(clean);
      await addresses.map(async (address) => createAddress(saved.customerId, address));
      setStep(2);
      setTimeout(() => {
        close();
      }, 3000);
    }
  };

  const errorMessage = (path) => {
    if (error && error.details) {
      const found = error.details.find((d) => d.context.key === path);
      if (found) return found.message;
    }
    return '';
  };

  useEffect(() => {
    const validation = validateCustomer();
    setError(validation.error);
  }, [state]);


  return (
    <Container maxWidth="lg" className="form-component">
      <Box className="box-close">
        <Close onClick={close} />
      </Box>
      <form onSubmit={submitForm} className={`form-add step-${step}`}>
        <Box className="box-avatar">
          <Avatar />
        </Box>
        <div className="form-step-container">
          <div className="form-step-box form-step-0">
            <Box>
              <TextField onInput={inputField} error={!!errorMessage('firstName')} id="firstName" label={t('First name')} variant="outlined" fullWidth />
            </Box>
            <Box>
              <TextField onInput={inputField} error={!!errorMessage('lastName')} id="lastName" label={t('Last name')} variant="outlined" fullWidth />
            </Box>
            <Box>
              <TextField onInput={inputField} error={!!errorMessage('additional')} id="additional" label={t('Additional')} variant="outlined" fullWidth multiline rowsMax={4} />
            </Box>

            <Box>
              <Button type="submit" disabled={!!(errorMessage('firstName') || errorMessage('lastName'))} color="primary">{t('Next')}</Button>
            </Box>
          </div>
          <div className="form-step-box form-step-1">
            {ADDRESS_FIELDS.map((e) => (
              <Box key={e}>
                <TextField onInput={inputField} error={!!errorMessage(e.field)} id={`addresses[0].${e.field}`} label={e.label} variant="outlined" fullWidth placeholder={e.placeholder} />
              </Box>
            ))}
            <Box>
              <Button onClick={() => { setStep(0); }}>{t('Back')}</Button>
              <Button type="submit" color="primary" disabled={!!validateCustomer().error}>{t('Done')}</Button>
            </Box>
          </div>
          <div className="form-step-box form-step-2">
            <Box>
              <CheckBox fontSize="large" />
            </Box>
          </div>
        </div>
      </form>
    </Container>
  );
};
