import React from 'react';

export default class Home extends React.Component {

    public demo(str: string): string {
        return 'Hello ts: ' + str;
    }

    public render() {
        return (
        <div>
        {this.demo('emmm')}
        </div>
        )
    }
}
