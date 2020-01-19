import React from 'react';
import { useStore } from '../../Stores';
import List from '../List';
import Form from '../Form';
import View from '../View';
import './style.sass';

export default () => {
    const { state } = useStore();
    return <div className={`main ${state.mode}`}>
        <div className="main-list"><List /></div>
        <div className="main-form">
            {state.mode === 'new' && <Form />}
            {state.mode === 'view' && <View />}
        </div>
    </div>
}
