import {StyleSheet, Text, View} from 'react-native';
import React, {Component} from 'react';
import AbstractComponent from './AbstractComponent';
import Typography from "../styles/Typography";

class FieldLabel extends AbstractComponent {
    static propTypes = {
        text: React.PropTypes.string.isRequired
    };

    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <Text style={[Typography.paperFontTitle, {color: 'white'}]}>
                {this.props.text}
            </Text>
        );
    }
}

export default FieldLabel;