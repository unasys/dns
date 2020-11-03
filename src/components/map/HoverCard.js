import React from 'react';

const DataDrivenValue = ({ value }) => {
    let hoverValue = value.values ?? value.value;
    if (hoverValue === true) {
        hoverValue = "yes";
    } else if (hoverValue === false) {
        hoverValue = "no";
    }
    return (
        <div key={value.name} className="hover-text-value">
            <div className="hover-card-heading">{value.name}</div>
            <div className="hover-card-value">{hoverValue}</div>
        </div>
    );
}

const DataDrivenHoverCard = ({ name, type, hoverDetails, position, image }) => {
    const detailContainers = hoverDetails.map(c => <div key={c.name} className="text-block-container">{c.values.map(v => <DataDrivenValue key={v.name} value={v} />)}</div>);
    return (
        <div className="hover-card" style={{ top: position.y, left: position.x }}>
            <div className="hover-card-title">
                <div className="hover-text-value">
                    <div className="hover-card-heading">{name}</div>
                    <div className="hover-card-value">{type}</div>
                </div>
                {image && <img className="hover-image" src={`https://assets.digitalnorthsea.com/images/installations/${image}`} alt="overview-thumbnail" />}
            </div>

            <div className="hover-card-body">
                {detailContainers}
            </div>
        </div>
    )
}

const HoverCard = (props) => {
    if (props.entity?.Hover) {
        return <DataDrivenHoverCard position={props.position} type={props.type} hoverDetails={props.entity.Hover} name={props.entity.name} />
    }

    return <></>;
}

export default HoverCard;