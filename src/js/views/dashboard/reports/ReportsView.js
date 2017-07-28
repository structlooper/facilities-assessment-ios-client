import React, {Component} from 'react';
import {Text, StyleSheet, View, ScrollView, Dimensions} from 'react-native';
import _ from 'lodash';
import AbstractComponent from "../../common/AbstractComponent";
import Dashboard from '../Dashboard';
import Actions from '../../../action';
import AssessmentList from '../common/AssessmentList';
import Reports from '../../reports/Reports';
import TypedTransition from "../../../framework/routing/TypedTransition";

const deviceWidth = Dimensions.get('window').width;

class ReportsView extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
        const store = context.getStore();
        this.state = store.getState().openAssessments;
        this.unsubscribe = store.subscribeTo('openAssessments', this.handleChange.bind(this));
    }

    static styles = StyleSheet.create({});

    handleChange() {
        const newState = this.context.getStore().getState().openAssessments;
        this.setState(newState);
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    showReports(assessment) {
        return () => TypedTransition.from(this).with({
            assessmentTool: assessment.assessmentTool,
            facility: assessment.facility,
            assessmentType: assessment.assessmentType,
            facilityAssessment: assessment,
            ...this.props
        }).to(Reports)
    }

    certificationCriteria(assessment) {
        return () => TypedTransition.from(this).with({
            assessmentTool: assessment.assessmentTool,
            facility: assessment.facility,
            assessmentType: assessment.assessmentType,
            facilityAssessment: assessment,
            ...this.props
        }).to(Reports)
    }

    render() {
        const AssessmentLists = [
            {
                header: "COMPLETED ASSESSMENTS",
                assessments: this.state.completedAssessments,
                buttons: [
                    {
                        text: "CERT",
                        onPress: this.certificationCriteria.bind(this),
                        mode: "nqas"
                    },
                    {
                        text: "VIEW",
                        onPress: this.showReports.bind(this)
                    }
                ]
            },
            {
                header: "SUBMITTED ASSESSMENTS",
                assessments: this.state.submittedAssessments,
                buttons: [
                    {
                        text: "CERT",
                        onPress: this.certificationCriteria.bind(this),
                        mode: "nqas"
                    },
                    {
                        text: "VIEW",
                        onPress: this.showReports.bind(this)
                    },
                ]
            }
        ].filter(({assessments}) => !_.isEmpty(assessments))
            .map((assessmentList, key) =>
                <AssessmentList mode={this.props.mode} key={key} {...assessmentList}/>);
        return (
            <View style={Dashboard.styles.tab}>
                {AssessmentLists}
            </View>
        );
    }
}

export default ReportsView;