/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */

import React from "react";
import {SpecialCard} from "../../server/logic/enums";

export default class CardContainer extends React.Component {

    constructor(args) {
        super(...args);
        this.generateClassName = this.generateClassName.bind(this);
    }

    generateClassName() {
        let classNames = ["card"];
        if (this.props.card === null) {
            // do nothing
        } else if (this.props.isComputerPlayerCard) {
            classNames.push("backOfCard");
        } else {
            classNames.push((this.props.card._color !== null) ? this.props.card._color : "noColor");
            if (this.props.isClickable)
                classNames.push("clickable-card");
            else if (this.props.card._value === SpecialCard.CHANGE_COLOR)
                classNames.push("change-to-" + this.props.card._color);
            if (this.props.card._value.length > 1)
                classNames.push("textCard");
        }
        return classNames.join(' ');
    }

    render() {
        if (this.props.card !== null) {
            return (
                <div
                    className={this.generateClassName()}
                    cardvalue={this.props.card} id={this.props.card._id}
                    onClick={(this.props.cardClicked !== undefined) ? this.props.cardClicked.bind(this, this.props.card, null) : null}>
                    {this.props.card._value}
                </div>
            );
        } else {
            return null;
        }
    };

}


CardContainer.defaultProps = {
    card: null,
    isClickable: true,
    isComputerPlayerCard: false
};