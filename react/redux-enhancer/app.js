import React from 'react';
import { render } from 'react-dom';

import App from 'components/App.js';
import A from 'components/A.js';
import B from 'components/B.js';

render(
    <Router>
        <Route path="/" component={App}>
            <Route path="a" component={A} />
            <Route path="b" component={B} />
        </Route>
    </Router>,
    document.getElementById('app')
);