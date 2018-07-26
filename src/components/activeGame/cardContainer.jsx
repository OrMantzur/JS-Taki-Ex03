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
        if (this.props.isComputerPlayerCard)
            classNames.push("backOfCard");
        else {
            classNames.push((this.props.card.getColor() !== null) ? this.props.card.getColor() : "noColor");
            if (this.props.isClickable)
                classNames.push("clickable-card");
            else if (this.props.card.getValue() === SpecialCard.CHANGE_COLOR)
                classNames.push("change-to-" + this.props.card.getColor());
            if (this.props.card.getValue().length > 1)
                classNames.push("textCard");
        }
        return classNames.join(' ');
    }

    render() {
        return (
            <div
                className={this.generateClassName()}
                cardvalue={this.props.card} id={this.props.card.getId()}
                onClick={(this.props.cardClicked !== undefined) ? this.props.cardClicked.bind(this, this.props.card) : null}>
                {this.props.card.getValue()}
            </div>
        );
    };
}


CardContainer.defaultProps = {
    card: null,
    isClickable: true,
    isComputerPlayerCard: false
};