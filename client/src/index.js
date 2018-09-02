import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Global from './Global.css'
import Landing from './Landing';
import AdminHome from './AdminHome';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Landing />, document.getElementById('root'));
registerServiceWorker();
