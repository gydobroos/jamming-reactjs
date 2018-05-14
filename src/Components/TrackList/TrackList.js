import React, { Component } from 'react';
import './TrackList.css';

// Components
import Track from "../Track/Track";

class TrackList extends Component {
    render() {
        const self = this;
        return (
            <div className="TrackList">
                {this.props.tracks.map(function (track) {
                    return <Track key={track.id}
                                  track={track}
                                  isRemoval={self.props.isRemoval}
                                  onAdd={self.props.onAdd}
                                  onRemove={self.props.onRemove} />
                })}
            </div>
        );
    }
}

export default TrackList;