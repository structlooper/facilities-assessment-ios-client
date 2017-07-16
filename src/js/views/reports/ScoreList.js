import React, {Component} from 'react';
import {Text, StyleSheet, View, ScrollView, Dimensions} from 'react-native';
import AbstractComponent from "../common/AbstractComponent";
import FlatUITheme from '../themes/flatUI';
import {Badge, List, ListItem} from 'native-base';
import Path from "../../framework/routing/Path";
import Typography from '../styles/Typography';
import PrimaryColors from '../styles/PrimaryColors';
import TypedTransition from "../../framework/routing/TypedTransition";
import Actions from '../../action';
import TabBar from "./TabBar";
import _ from 'lodash';
import DrillDownView from '../drillDown/DrillDownView';
import Reports from "./Reports";


const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

class ScoreList extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }


    static styles = StyleSheet.create({
        container: {
            marginRight: deviceWidth * .02,
            marginTop: deviceHeight * .01
        },
        scoreItem: {
            paddingRight: 24,
            paddingLeft: 24,
            paddingTop: 16,
            paddingBottom: 16,
            backgroundColor: "white",
        },
        scoreItemContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            flex: 1,
        }
    });

    handlePress(selectionName) {
        this.dispatchAction(Actions.DRILL_DOWN, {
            facilityAssessment: this.props.facilityAssessment,
            selectionName: selectionName,
        });
        TypedTransition.from(this).with({...this.props.params, drilledDown: true}).to(Reports);
    }

    render() {
        const onPressHandler = _.isFunction(this.props.handlePress) ? this.props.handlePress : this.handlePress.bind(this);
        let Items = _.toPairs(this.props.scores).map(([item, score], idx) => (
            <ListItem key={idx} onPress={() => onPressHandler(item)} style={ScoreList.styles.scoreItem}>
                <View style={ScoreList.styles.scoreItemContainer}>
                    <Text style={[Typography.paperFontSubhead, {color: "black", flex: .80}]}>{item}</Text>
                    <Text style={{flex: .05}}/>
                    <View style={{
                        backgroundColor: PrimaryColors.yellow,
                        flex: .15,
                        justifyContent: 'flex-start',
                        alignItems: 'center'
                    }}>
                        <Text style={[Typography.paperFontTitle, {
                            color: 'white',
                            fontWeight: '900',
                            paddingTop: 5,
                            paddingBottom: 5
                        }]}>
                            {`${parseInt(score)}%`}
                        </Text>
                    </View>
                </View>
            </ListItem>
        ));
        return (
            <View style={ScoreList.styles.container}>
                <List>
                    {Items}
                </List>
            </View>
        );
    }
}

export default ScoreList;