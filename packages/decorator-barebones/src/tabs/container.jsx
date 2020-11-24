import React from 'react';

/**
 * @component
 */
export default function Container(props) {
    return (
        <div className="tabs-container">
            <div className="tabs" key="tabs">
                {props.tabs}
            </div>
            <div className="panels" key="panels">
                {props.panels}
            </div>
        </div>
    );
}
