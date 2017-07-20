import React, {Component} from 'react';
import {Dimensions, View, Text, TouchableWithoutFeedback, StyleSheet, ToastAndroid} from 'react-native';
import AbstractComponent from "../common/AbstractComponent";
import Actions from '../../action';
import _ from 'lodash';
import ComplianceItem from './ComplianceItem';

class Compliance extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
        this.remarkNotif = this.remarkNotif.bind(this);
    }

    static styles = StyleSheet.create({
        compliance: {
            flexDirection: 'row',
            flexWrap: 'nowrap',
            justifyContent: 'flex-start',
            alignItems: 'center',
            alignSelf: 'center',
            marginTop: 8,
        },
    });


    getCurrentIndex() {
        return _.findIndex(this.props.checkpoints,
            (checkpoint) => this.props.currentCheckpoint.uuid === checkpoint.uuid);
    }

    next() {
        const nextCheckpoint = this.props.checkpoints[this.getCurrentIndex() + 1];
        this.dispatchAction(Actions.CHANGE_PAGE, {currentCheckpoint: nextCheckpoint});
    }


    remarkNotif() {
        ToastAndroid.showWithGravity("Please enter a remark", ToastAndroid.SHORT, ToastAndroid.CENTER);
    }

    render() {
        const currentScore = this.props.checkpoint.score;
        let complianceItems = _.sortBy(
            [
                ["Non Compliant", 0, this.remarkNotif],
                ["Fully Compliant", 2, _.noop],
                ["Partially Compliant", 1, this.remarkNotif]
            ]
                .slice(0, this.props.checkpoint.checkpoint.scoreLevels), ([ig1, val, ig2]) => val);
        const ComplianceItemsComponents = complianceItems
            .map(([text, score, fn], idx) => (
                <ComplianceItem key={idx} score={score} text={text}
                                handleOnPress={this.props.updateCheckpoint(this.props.checkpoint, {score: score}, fn)}
                                active={currentScore === score}/>
            ));
        return (
            <View style={Compliance.styles.compliance}>
                {ComplianceItemsComponents}
            </View>
        );
    }
}

export default Compliance;