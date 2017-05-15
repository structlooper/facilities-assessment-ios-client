import React, {Component} from 'react';
import {Text, StyleSheet, View, ScrollView, Dimensions} from 'react-native';
import AbstractComponent from "../common/AbstractComponent";
import FlatUITheme from '../themes/flatUI';
import {Container, Header, Title, Content, Icon, Button} from 'native-base';
import Path from "../../framework/routing/Path";
import Typography from '../styles/Typography';
import PrimaryColors from '../styles/PrimaryColors';
import TypedTransition from "../../framework/routing/TypedTransition";
import Actions from '../../action';
import {AnimatedGaugeProgress, GaugeProgress} from 'react-native-simple-gauge';


const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

class OverallScore extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }


    static styles = StyleSheet.create({
        container: {
            backgroundColor: PrimaryColors.blue,
            height: deviceHeight * .264,
            justifyContent: 'center',
            alignItems: 'center'
        },
        scorePercentage: {
            color: "#ffa000"
        },
        scoreText: {
            color: "#ffa000"
        }
    });

    render() {
        return (
            <View style={OverallScore.styles.container}>
                <AnimatedGaugeProgress
                    size={deviceHeight * .25}
                    width={4}
                    fill={this.props.score}
                    rotation={90}
                    cropDegree={120}
                    tintColor="#ffc107"
                    backgroundColor={PrimaryColors.medium_white}
                    strokeCap="circle">
                    {() =>
                        <View style={{marginTop: -(deviceHeight * .168), alignSelf: 'center', flexDirection: 'column'}}>
                            <Text style={[Typography.paperFontDisplay2, OverallScore.styles.scorePercentage]}>
                                {`${parseInt(this.props.score)}%`}
                            </Text>
                            <Text style={[Typography.paperFontBody1, OverallScore.styles.scoreText]}>
                                Overall Score
                            </Text>
                        </View>}
                </AnimatedGaugeProgress>
            </View>
        );
    }
}

export default OverallScore;