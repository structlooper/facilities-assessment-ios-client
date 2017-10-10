import React, {Component} from 'react';
import {Text, StyleSheet, View, ScrollView, Dimensions, Alert, TouchableWithoutFeedback} from 'react-native';
import AbstractComponent from "../../common/AbstractComponent";
import {List, ListItem, Button, Icon} from 'native-base';
import Typography from '../../styles/Typography';
import PrimaryColors from '../../styles/PrimaryColors';
import Dashboard from '../Dashboard';
import Actions from '../../../action';
import StateDistrict from './StateDistrict';
import FacilityType from './FacilityType';
import Facility from './Facility';
import AssessmentType from './AssessmentType';
import AssessmentTools from './AssessmentTools';
import StartNewAssessment from './StartNewAssessment';
import TypedTransition from "../../../framework/routing/TypedTransition";
import ChecklistSelection from "../../checklistSelection/ChecklistSelection";
import FacilityText from "./FacilityText";
import AssessmentSeries from "./AssessmentSeries";
import Config from 'react-native-config';
import EnvironmentConfig from "../../common/EnvironmentConfig";


const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;


class StartView extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
        const store = context.getStore();
        this.state = store.getState().facilitySelection;
        this.unsubscribe = store.subscribeTo('facilitySelection', this.handleChange.bind(this));
        this.changeView = this.changeView.bind(this);
        this.resetForm = this.resetForm.bind(this);
    }

    static styles = StyleSheet.create({
        formRow: {
            borderBottomWidth: 0,
            marginLeft: 0,
        },
    });


    handleChange() {
        const newState = this.context.getStore().getState().facilitySelection;
        (newState.facilitySelected ? this.changeView.bind(this) : this.setState.bind(this))(newState);
    }

    changeView(newState) {
        this.dispatchAction(Actions.RESET_FORM, {
            cb: () =>
                TypedTransition.from(this).with({
                    assessmentTool: this.state.selectedAssessmentTool,
                    facility: newState.selectedFacility,
                    assessmentType: this.state.selectedAssessmentType,
                    facilityAssessment: newState.facilityAssessment,
                    state: this.state.selectedState,
                    ...this.props
                }).to(ChecklistSelection)
        })
    }

    resetForm() {
        this.dispatchAction(Actions.RESET_FORM, {
            cb: () => {
            }
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    componentWillMount() {
        this.dispatchAction(Actions.ALL_STATES, {...this.props});
    }

    appropriateTextField() {
        return EnvironmentConfig.isAssessmentSeriesSupported ? AssessmentSeries : FacilityText;
    }

    render() {
        const FormComponents =
            [AssessmentTools, StateDistrict, FacilityType, Facility, this.appropriateTextField(), AssessmentType, StartNewAssessment]
                .map((FormComponent, idx) =>
                    <ListItem key={idx} style={StartView.styles.formRow}>
                        <FormComponent data={this.state} {...this.props}/>
                    </ListItem>);
        return (
            <View style={Dashboard.styles.tab}>
                <List>
                    {FormComponents}
                </List>
            </View>
        );
    }
}

export default StartView;