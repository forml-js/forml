import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
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
                    <Typography variant="h6">Something went wrong!</Typography>
                    <Typography variant="body1">{this.state.error.stack}</Typography>
                    <Typography variant="caption">{JSON.stringify(this.state.info)}</Typography>
                </>
            );
        }

        return this.props.children;
    }
}
