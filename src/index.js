import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import AMapPage from "./AMapPage";


ReactDOM.render(<AMapPage />, document.getElementById('root'));
registerServiceWorker();
