import {ActivityIndicator, Platform, StyleSheet, TextInput, View, Modal, Alert} from 'react-native';
import React from 'react';
import AbstractComponent from '../../common/AbstractComponent';
import {Button, Text} from "native-base";
import Typography from "../../styles/Typography";
import PrimaryColors from "../../styles/PrimaryColors";
import AssessmentSeries from "../start/AssessmentSeries";
import Actions from "../../../action";
import AssessmentTool from "../../../models/AssessmentTool";
import PropTypes from 'prop-types';
import GunakContainer from "../../common/GunakContainer";
import FacilityAssessment from '../../../models/FacilityAssessment';
import Logger from "../../../framework/Logger";
import Login from "./Login";
import _ from 'lodash';
import SubmitButton from "../../common/SubmitButton";
import {LoginStatus} from "../../../action/submitAssessment";

class SubmitAssessment extends AbstractComponent {
    static propTypes = {
        facilityAssessment: PropTypes.object.isRequired,
        syncing: PropTypes.bool
    };

    static styles = StyleSheet.create({
        container: {
            backgroundColor: 'white',
            alignSelf: 'stretch',
            marginHorizontal: 10,
            flexDirection: 'column'
        },
        input: {
            fontSize: 16,
            height: 40,
            paddingLeft: 8,
            borderColor: 'grey',
            borderWidth: Platform.OS === 'ios' ? 0.5 : 0
        }
    });

    constructor(props, context) {
        super(props, context, "submitAssessment");
    }

    componentWillMount() {
        this.dispatchAction(Actions["IS_SUBMISSION_PROTECTED"], {
            facilityAssessment: this.props.facilityAssessment,
            setSubmissionProtectionStatus: (status) => {
                this.dispatchAction(Actions["START_SUBMIT_ASSESSMENT"], {
                    isSubmissionProtected: status,
                    loggedIn: (assessmentNumbers) => this.dispatchAction(Actions["UPDATE_LOGIN_STATUS"], {loginStatus: LoginStatus.LOGGED_IN, assessmentNumbers: assessmentNumbers}),
                    notLoggedIn: () => this.dispatchAction(Actions["UPDATE_LOGIN_STATUS"], {loginStatus: LoginStatus.NOT_LOGGED_IN}),
                    facilityAssessment: this.props.facilityAssessment,
                    assessmentNumbers: []
                });
            },
            launchSubmissionError: () => this.launchSubmissionError
        });
    }

    handleCustomInfoChange(assessmentMetaData, text) {
        this.dispatchAction(Actions["ENTER_CUSTOM_INFO"], {assessmentMetaData: assessmentMetaData, valueString: text});
    }

    close() {
        this.dispatchAction(Actions["SUBMISSION_CANCELLED"]);
    }

    handleSubmit() {
        this.dispatchAction(Actions["SYNC_ASSESSMENT"], {
            cb: () => this.dispatchAction(Actions["ASSESSMENT_SYNCED"], {status: true}),
            errorHandler: (error) => {
                Logger.logError('SubmitAssessment', error);
                this.submissionError(error);
            }
        });
    }

    launchSubmissionError(error) {
        Alert.alert(
            'Submission Error',
            `An error occurred while starting submission (note internet is required). ${error.message}`,
            [
                {
                    text: 'OK',
                    onPress: () => {}
                }
            ]
        )
    }

    submissionError(error) {
        Alert.alert(
            'Submission Error',
            `An error occurred while submitting the assessment (note internet is required). ${error.message}`,
            [
                {
                    text: 'OK',
                    onPress: () => this.dispatchAction(Actions.ASSESSMENT_SYNCED, {status: false})
                }
            ]
        )
    }

    render() {
        Logger.logDebug('SubmitAssessment', this.state.loginStatus);
        if (this.state.loginStatus === LoginStatus.UNKNOWN)
            return <ActivityIndicator animating={true} size={"large"} color="white" style={{height: 80}}/>;

        let facilityAssessment = this.state.chosenAssessment ? this.state.chosenAssessment : this.props.facilityAssessment;
        return (
            <Modal transparent={true} visible={true} onRequestClose={() => this.dispatchAction(Actions.SUBMISSION_CANCELLED)}>
                <GunakContainer title="Submit Assessment" hideBack={true}>
                    {(this.state.loginStatus === LoginStatus.NOT_LOGGED_IN || this.state.loginStatus === LoginStatus.TRYING_LOGIN) &&
                    <Login errorMessage={this.state.errorMessage} busy={this.state.loginStatus === LoginStatus.TRYING_LOGIN}/>}
                    {(this.state.loginStatus === LoginStatus.LOGIN_NOT_REQUIRED || this.state.loginStatus === LoginStatus.LOGGED_IN) &&
                    <View style={SubmitAssessment.styles.container}>
                        {(this.state.assessmentToolType === AssessmentTool.INDICATOR) ? null : <AssessmentSeries series={facilityAssessment.seriesName} seriesOptions={this.state.assessmentNumbers} submissionProtected={this.state.protectedAssessment}/>}
                        <View style={{margin: 10, flexDirection: 'column'}}>
                            {!this.state.protectedAssessment && this.state.assessmentMetaDataList.map((x) => {
                                return <View key={x.uuid} style={{marginBottom: 20}}>
                                    <Text style={[Typography.paperFontSubhead]}>{x.name}</Text>
                                    <TextInput style={SubmitAssessment.styles.input}
                                               value={FacilityAssessment.getCustomInfoValue(x, facilityAssessment)}
                                               underlineColorAndroid={PrimaryColors["grey"]}
                                               words="words"
                                               onChangeText={(text) => this.handleCustomInfoChange(x, text)}/>
                                </View>
                            })}

                            <View style={{flexDirection: 'row', marginBottom: 10, marginTop: 30}}>
                                <Button block
                                        style={{backgroundColor: this.props.syncing ? PrimaryColors.medium_black : PrimaryColors.blue, marginHorizontal: 10, flex: 0.5}}
                                        onPress={() => this.close()}
                                        disabled={this.props.syncing}><Text>CLOSE</Text></Button>
                                <SubmitButton disabled={!this.state.submissionDetailAvailable}
                                              buttonStyle={{flex: 0.5}}
                                              busy={this.props.syncing}
                                              onPress={() => this.handleSubmit()}/>
                            </View>
                        </View>
                    </View>}
                </GunakContainer>
            </Modal>
        );
    }
}

export default SubmitAssessment;
