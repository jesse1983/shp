import React, { useEffect } from 'react';
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Fab,
  Container,
  Box,
} from '@material-ui/core';
import {
  Add as AddIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
} from '@material-ui/icons';
import { useStore } from '../../Stores';
import Trans from '../../Shared/Trans';
import { getCustomers, getCustomer } from '../../Services/Customers';
import { getAddresses } from '../../Services/Addresses';
import './style.sass';


export default () => {
  const { state, dispatch } = useStore();
  const viewCustomer = async (c) => {
    const [customer, addresses] = await Promise
      .all([getCustomer(c.customerId), getAddresses(c.customerId)]);
    customer.addresses = addresses.data;
    dispatch({ type: 'FETCH_CUSTOMER', value: customer });
  };
  useEffect(() => {
    if (state.requestCustomers) {
      getCustomers(state.offset).then((result) => {
        dispatch({ type: 'FETCH_CUSTOMERS', data: result.data, count: result.count });
      });
    }
  }, [dispatch, state]);

  const currentPage = (state.offset / state.rowPerPage) + 1;
  const totalPages = Math.ceil(state.countCustomers / state.rowPerPage);
  return (
    <Container maxWidth={1} className={`list-component count-${state.countCustomers}`}>
      {state.customers && state.customers.length ? (
        <>
          <div className="list-grid-cards">
            {state.customers.map((e) => (
              <Card key={e}>
                <CardActionArea onClick={() => viewCustomer(e)}>
                  <CardContent>
                    <Typography variant="h4" component="h2">
                      {e.firstName}
                      {' '}
                      {e.lastName}
                    </Typography>
                    <Typography>{e.additional || '...'}</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </div>
        </>
      ) : null}
      <div className="list-options-bar">
        {state.countCustomers > 0 && (
        <Box className="list-options-bar-count" display={{ xs: 'none', sm: 'block' }}>
          <Trans i18nKey="total customers" count={state.countCustomers} />
        </Box>
        )}
        {state.countCustomers > 12 && (
        <Box className="list-options-bar-pagination">
          <Fab aria-label="next" onClick={() => dispatch({ type: 'PREV_PAGE' })}>
            <NavigateBeforeIcon />
          </Fab>
          <Typography display={{ xs: 'none', sm: 'block' }}><Trans i18nKey="current to total" values={{ currentPage, totalPages }} /></Typography>
          <Fab aria-label="next" onClick={() => dispatch({ type: 'NEXT_PAGE' })}>
            <NavigateNextIcon />
          </Fab>
        </Box>
        )}
        <Box>
          <Fab variant="extended" color="primary" aria-label="add" onClick={() => dispatch({ type: 'SWITCH_VIEW', value: 'new' })}>
            <AddIcon />
            <Trans i18nKey="Add new customer" />
          </Fab>
        </Box>
      </div>
    </Container>
  );
};
