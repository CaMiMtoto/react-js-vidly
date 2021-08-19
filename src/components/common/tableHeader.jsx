import React, {Component} from 'react';

class TableHeader extends Component {

    raiseSort = path => {
        const sortColumn = {...this.props.sortColumn};
        if (sortColumn.path === path)
            sortColumn.order = (sortColumn.order === 'asc') ? 'desc' : 'asc';
        else {
            sortColumn.path = path;
            sortColumn.order = 'asc';
        }
        this.props.onSort(sortColumn);
    }

    renderSortIcon = column => {
        const {path, order} = this.props.sortColumn;
        if (column.path !== path) return null;

        if (order === 'asc')
            return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20"
                        fill="currentColor">
                <path fillRule="evenodd"
                      d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                      clipRule="evenodd"/>
            </svg>
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"/>
        </svg>
    };

    render() {
        return (
            <thead>
            <tr>
                {
                    this.props.columns.map(column => (
                        <th key={column.path || column.key} style={{cursor: 'pointer'}}
                            onClick={() => {
                                if (column.sortable)
                                    this.raiseSort(column.path);
                            }}>
                            <span className="me-3">{column.label}</span>
                            {column.sortable && this.renderSortIcon(column)}
                        </th>
                    ))
                }
            </tr>
            </thead>
        );
    }
}

export default TableHeader;