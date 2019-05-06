import React from 'react';
import ReactDOM from 'react-dom';

import Home from './containers/Home/index.tsx';

const App = () => {
    return (
        <div><Home /></div>
    );
}

ReactDOM.render(
<App />,
document.getElementById('app')
);
