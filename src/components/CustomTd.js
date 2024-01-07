import React from "react";
import { faCheck, faX, faQuestion } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const YES = "yes"
const NO = "no"
const UNKNOWN = "unknown"

// If td element is yes, no, or unknown, 
// replace it with an appropriate FA icon

const CustomTd = ({ className, children }) => {
    const createElement = () => {
        let value = children

        // Allowing this component to accept anything as children,
        // and only applying this effect IF it's a string which 
        // contains yes, no, or unknown
        if (typeof value === "string") {
            
            let newText = value.toLowerCase()
            switch(newText) {
                case YES: {
                    value = <FontAwesomeIcon style={{ color: "green" }} icon={faCheck} /> 
                    break
                }
                case NO: {
                    value = <FontAwesomeIcon style={{ color: "red" }} icon={faX} /> 
                    break
                }
                case UNKNOWN: {
                    value = <FontAwesomeIcon style={{ color: "gray" }} icon={faQuestion} /> 
                    break
                }
                default: break;
            }
        }

        return value
    }

    return (
        <td className={className}>{createElement()}</td>  
    )
}

export default CustomTd