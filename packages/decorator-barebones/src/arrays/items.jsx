import React, { forwardRef } from "react";
import { useLocalizer } from "@forml/hooks";

/**
 * @component
 */
function Items(props, ref) {
  const { disabled } = props;

  const { getLocalizedString } = useLocalizer();

  return (
    <div className="array" ref={ref}>
      <button key="add" className="add" disabled={disabled} onClick={props.add}>
        {getLocalizedString("Add")}
      </button>
      <ul key="items">{props.children}</ul>
    </div>
  );
}

export default forwardRef(Items);
