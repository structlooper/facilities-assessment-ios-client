/* @flow */
import {AppRegistry, StyleSheet, View, StatusBar} from 'react-native';
import React, {Component} from 'react';
import App from './src/js/App';
import PrimaryColors from './src/js/views/styles/PrimaryColors';

class FacilitiesAssessment extends Component {

    static styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'stretch',
            backgroundColor: '#FFFFFF'
        }
    });

    render() {
        return (
            <View style={FacilitiesAssessment.styles.container}>
                <StatusBar
                    backgroundColor={PrimaryColors.lightBlue}
                    barStyle="light-content"
                />
                <App />
            </View>
        );
    }
}
console.ignoredYellowBox = ['Warning: You are manually calling'];
AppRegistry.registerComponent('FacilitiesAssessment', () => FacilitiesAssessment);
