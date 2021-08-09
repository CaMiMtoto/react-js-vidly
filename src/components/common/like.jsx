import React from 'react';

const Like = ({liked, onClick}) => {
    let classes = 'far fa-heart';
    if (liked) {
        classes = 'fas fa-heart';
    }
    return (
        <i className={classes} onClick={onClick} style={{cursor: 'pointer'}}/>
    );
};
export default Like;