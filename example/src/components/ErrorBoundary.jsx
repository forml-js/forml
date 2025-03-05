import React, { Component } from 'react';

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidCatch(error, info) {
        this.setState({ hasError: true, error, info });
    }

    render() {
        if (this.state.hasError) {
            return (
                <>
                    <h6>Something went wrong!</h6>
                    <p>{this.state.error.stack}</p>
                    <p>{JSON.stringify(this.state.info)}</p>
                </>
            );
        }

        return this.props.children;
    }
}
