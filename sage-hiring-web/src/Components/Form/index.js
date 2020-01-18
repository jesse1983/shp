/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from  'react';
import { set } from 'lodash';
import {
    TextField,
    Box,
    Avatar,
    Button
} from '@material-ui/core';
import { useStore } from '../../Stores';
import CustomerSchema from '../../Schemas/CustomerSchema';
import { t } from '../../Shared/Trans';
import './style.sass';


export default () => {
    const { state, dispatch } = useStore();
    const [step, setStep] = useState(0);
    const [error, setError] = useState();

    const inputField = (ev) => {
        const { target } = ev;
        const { id, value } = target;
        let { customer } = state;
        customer = customer || {};
        set(customer, id, value);
        dispatch({ type: 'CHANGE_CUSTOMER', value: customer });
    }

    const submitForm = (ev) => {
        ev.preventDefault();
        if (step === 0 && state.customer && state.customer.firstName && state.customer.lastName) {
            setStep(1);
        }
        if (step === 1 && !validateCustomer().error) {

        }
    }

    const errorMessage = (path) => {
        if (error && error.details) {
            const found = error.details.find(d => d.context.key === path);
            if (found) return found.message;
        }
        return '';
    }

    useEffect(() => {
        const validation = validateCustomer();
        setError(validation.error);
    }, [state]);
    
    const validateCustomer = () => CustomerSchema.validate(state.customer || {}, { abortEarly: false });

    const addressFields = [
        { field: 'title', label: t('Address title'), placeholder: t('For example, Home') },
        { field: 'street', label: t('Street') },
        { field: 'streetNumber', label: t('Street number') },
        { field: 'additional', label: t('Additional address') },
        { field: 'district', label: t('District') },
        { field: 'city', label: t('City') },
        { field: 'state', label: t('State') },
        { field: 'country', label: t('Country') },
    ];
    return <div className="form-component">
        <button onClick={() => dispatch({ type: 'SWITCH_VIEW' })}>Add</button>
        <div>{JSON.stringify({ c: state.customer, s: step }, null, 4)}</div>
        {state.mode === 'edit' &&
            <form onSubmit={submitForm} className={`form-add step-${step}`}>
                <Box>
                    <Avatar />
                </Box>
                <div className="form-step-container">
                    <div className="form-step-box form-step-0">
                        <Box>
                            <TextField onInput={inputField} helperText={errorMessage('firstName')} error={!!errorMessage('firstName')} id="firstName" label={t('First name')} variant="filled" fullWidth />
                        </Box>
                        <Box>
                            <TextField onInput={inputField} helperText={errorMessage('lastName')} error={!!errorMessage('lastName')} id="lastName" label={t('Last name')} variant="filled" fullWidth />
                        </Box>
                        <Box>
                            <TextField onInput={inputField} helperText={errorMessage('additional')} error={!!errorMessage('additional')} id="additional" label={t('Additional')} variant="filled" fullWidth multiline rowsMax={4} />
                        </Box>

                        <Box>
                            <Button type="submit" disabled={!!(errorMessage('firstName') && errorMessage('lastName'))} color="primary">{t('Next')}</Button>
                        </Box>
                    </div>
                    <div className="form-step-box form-step-1">
                        {addressFields.map((e, i) => <Box>
                            <TextField onInput={inputField} helperText={errorMessage(e.field)} error={!!errorMessage(e.field)} id={`addresses[0].${e.field}`} label={e.label} variant="filled" fullWidth placeholder={e.placeholder} />
                        </Box>)}
                        <Box>
                            <Button onClick={() => { setStep(0); console.log(step); }} >{t('Back')}</Button>
                            <Button type="submit" color="primary" disabled={!!validateCustomer().error}>{t('Done')}</Button>
                        </Box>
                    </div>
                </div>
            </form>
        }
    </div>;
}
