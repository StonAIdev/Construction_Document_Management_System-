import React from "react";
import PropTypes from "prop-types";
import "./ToggleSwitch.css";
import { Tooltip } from "@mui/material"
/*
Toggle Switch Component
Note: id, checked and onChange are required for ToggleSwitch component to function. The props name, small, disabled
and optionLabels are optional.
Usage: <ToggleSwitch id="id" checked={value} onChange={checked => setValue(checked)}} />
*/

const ToggleSwitch = ({
    id,
    name,
    checked,
    onChange,
    optionLabels,
    small,
    disabled,
    toogleValue,
    ID
}) => {

    function handleKeyPress(e) {
        if (e.keyCode !== 32) return;

        e.preventDefault();
        onChange(!checked);
    }

    return (
        <div className={"toggle-switch" + (small ? " small-switch" : "")}>

            <input
                type="checkbox"
                name={name}
                className="toggle-switch-checkbox"
                id={ID}
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                disabled={disabled}
            />
            {id ? (
                <Tooltip title={toogleValue ? "Received(Inward)" : "Issued(Outward)"}>

                    <label
                        className="toggle-switch-label"
                        tabIndex={disabled ? -1 : 1}
                        onKeyDown={(e) => handleKeyPress(e)}
                        htmlFor={ID}
                    >
                        <span
                            className={
                                disabled
                                    ? "toggle-switch-inner toggle-switch-disabled"
                                    : "toggle-switch-inner"
                            }
                            data-yes={optionLabels[0]}
                            data-no={optionLabels[1]}
                            tabIndex={-1}
                        />
                        <span
                            className={
                                disabled
                                    ? "toggle-switch-switch toggle-switch-disabled"
                                    : "toggle-switch-switch"
                            }
                            tabIndex={-1}
                        />
                    </label>
                </Tooltip>

            ) : null}
        </div>
    );
};

// Set optionLabels for rendering.
ToggleSwitch.defaultProps = {
    optionLabels: ["Out", "In"]
};

ToggleSwitch.propTypes = {
    id: PropTypes.string.isRequired,
    checked: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string,
    optionLabels: PropTypes.array,
    small: PropTypes.bool,
    disabled: PropTypes.bool
};

export default ToggleSwitch;
