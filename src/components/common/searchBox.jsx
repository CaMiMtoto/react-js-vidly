import React from 'react';

const SearchBox = ({value, onChange}) => (
    <div>
        <input type="search" value={value} onChange={event => onChange(event.target.value)}
               className="form-control form-control-sm card rounded"
               placeholder="Search..."/>
    </div>
);

export default SearchBox;