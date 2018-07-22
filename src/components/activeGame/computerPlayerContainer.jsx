/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */

import React from "react";

export default class ComputerPlayerContainer extends React.Component {
    constructor(args) {
        super(...args);
    }

    render() {
        return (
            <div id="computer-player-container">
                {this.props.cards.map((card) => (
                    <div className={"card backOfCard"} key={card.getId()}/>))}
            </div>
        );
    };
}
