import React, { useEffect } from  'react';
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    Fab,
} from '@material-ui/core';
import { Edit as EditIcon, Add as AddIcon, Close as CloseIcon } from '@material-ui/icons'
import { useStore } from '../../Stores';
import Trans from '../../Shared/Trans';
import { getCustomers } from '../../Services/Customers';
import './style.sass';


export default () => {
    const { state, dispatch } = useStore();


    useEffect(() => {
        getCustomers().then((result) => {
            dispatch({ type: 'FETCH_CUSTOMERS', data: result.data, count: result.count });
        });
    }, [dispatch]);
    return <div className={`list-component count-${state.countCustomers}`}>
        {state.customers && <>
            <div className="list-grid-cards">
                {state.customers.map((e, i) =>
                    <Card key={i}>
                        <CardContent>
                            <Typography variant="h4" component="h2">{e.firstName} {e.lastName}</Typography>
                            <Typography>{e.additional}</Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" aria-label="edit">
                                <EditIcon />
                            </Button>
                            <Button size="small" aria-label="edit">
                                <CloseIcon />
                            </Button>
                        </CardActions>
                    </Card>
                )}
            </div>
        </>}
        <div className="add-new-customer">
            <Fab variant="extended" color="primary" aria-label="add" onClick={() => dispatch({ type: 'SWITCH_VIEW' })}>
                <AddIcon />
                <Trans i18nKey="Add new customer" />
            </Fab>
        </div>
    </div>;
}
