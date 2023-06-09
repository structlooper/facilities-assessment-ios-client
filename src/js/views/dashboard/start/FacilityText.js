import React from "react";
import {Platform, StyleSheet, TextInput} from "react-native";
import AbstractComponent from "../../common/AbstractComponent";
import Actions from "../../../action";
import PrimaryColors from "../../styles/PrimaryColors";
import PropTypes from 'prop-types';

class FacilityText extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }

    static styles = StyleSheet.create({
        input: {
            fontSize: 16,
            color: 'white',
            height: 40,
            paddingLeft: 8,
            borderColor: 'grey',
            borderWidth: Platform.OS === 'ios' ? 0.5 : 0,
            flex: 1
        }
    });

    static propTypes = {
        data: PropTypes.object.isRequired
    };

    handleFacilityNameChange(facilityName) {
        this.dispatchAction(`${Actions.ENTER_FACILITY_NAME}`, {facilityName: facilityName});
    }

    render() {
        return (
            <TextInput style={FacilityText.styles.input}
                       placeholder={"Enter Facility Name"}
                       placeholderTextColor="rgba(255, 255, 255, 0.7)"
                       value={this.props.data.facilityName}
                       underlineColorAndroid={PrimaryColors["dark_white"]}
                       words="words"
                       onChangeText={this.handleFacilityNameChange.bind(this)}/>
        );
    }
}

export default FacilityText;
