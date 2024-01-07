import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import TableButton from './TableButton';
import SearchFields from './SearchFields';
import "./HideFields.css"

// hiddenFields is an array with size columns.length, and each element
// corresponds to the column at its respective index. 
function HideFields({ size, hiddenFields, setHiddenFields, columns }) {

    // Future:
    // Reorder fields here (don't want to implement dragging rn)
    const [localHF, setLocalHF] = useState(hiddenFields)

    const isDisabled = (index) => {
        return columns[index].alwaysShow || columns[index].alwaysHide
    }

    // update local state
    useEffect(() => {
        setLocalHF(hiddenFields)
    }, [hiddenFields])

    const createColumnToggles = () => (
        <SearchFields
        menuClassName="w-100"
        size={size}
        onFieldClick={(index) => {
            setLocalHF(prevHF => {
                prevHF[index] = !prevHF[index]
                return [...prevHF]
            })
        }}
        toggleAll={(bool) => {
            setLocalHF(prevHF => (
                prevHF.map((item, index) => {
                    if(isDisabled(index))
                        return item
                    
                    return bool
                })
            ))
        }}
        allActive={() => {
            localHF.forEach((item, index) => {
                if(!isDisabled(index)) {
                    // Because checkboxes are reversed,
                    // If true, then item is hidden, which means toggle is OFF
                    if(item)
                        return false
                }
            })
            return true
        }}
        isDisabled={(index) => isDisabled(index)}
        columns={columns}
        checkboxes={localHF}
        reverseChecks={true} />
    )

    return (
        <TableButton 
        size={size} 
        variant="outline-secondary"
        title={<><FontAwesomeIcon icon={faEye} /> Fields</>}
        modalBody={createColumnToggles()}
        apply={() => setHiddenFields([...localHF])}
        cancel={() => setLocalHF([...hiddenFields])} />
    )
}

export default HideFields;