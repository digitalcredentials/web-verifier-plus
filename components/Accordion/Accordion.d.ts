import React, { ReactElement } from "react"

export type AccordionProps = {
    icon?: ReactElement;
    onClick?: () => void;
    isOpen?: boolean;
    className?: string;
    id?: string;
    ariaLabel?: string;
    ariaControls?: string;
    ariaExpanded?: boolean;
    ariaHidden?: boolean;
    ariaLabelledBy?: string;
    ariaDescribedBy?: string;
    ariaRole?: string;
    ariaOwns?: string;
    ariaHasPopup?: string;
    ariaDisabled?: boolean;     
    title: string;
    children: React.ReactNode;
}