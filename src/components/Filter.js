import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import TableButton from './TableButton';
import FilterGroup from './FilterGroup'
import "./Filter.css"

/*
    filters is an object:
    filters: {
        and: true/false,
        rules: [
            ... contains single rules or groups, which have same schema as this top level filters obj
        ]
    }
*/

// text, number, date, select, checkbox
const Filter = ({ size, filters, setFilters, columns }) => {

    const [localFilters, setLocalFilters] = useState(filters)

    useEffect(() => {
        setLocalFilters(filters)
    }, [filters])

    const createFilterModalBody = () => (
        <FilterGroup 
        groupArray={localFilters}
        setFilters={setLocalFilters} 
        columns={columns}
        topLevel />
    )


    // Allowing empty groups. They will be dealt with in back
    // Why is filters.length > 1 going from true to false? 
    return (
        <TableButton 
        size={size} 
        variant="outline-secondary"
        active={localFilters.length > 1}
        title={<><FontAwesomeIcon icon={faFilter}/> Filters</>}
        modalDialogClassName="filter-modal"
        modalBody={createFilterModalBody()}
        apply={() => setFilters([...localFilters])}
        cancel={() => setLocalFilters([...filters])} /> 
    )
}

export default Filter;