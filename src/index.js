import React from 'react';
import ReactDOM from 'react-dom';
import ReactMap from './react-amap/ReactMap';
import registerServiceWorker from './registerServiceWorker';
import AMapPage from "./AMapPage";


ReactDOM.render(<AMapPage />, document.getElementById('root'));
registerServiceWorker();
