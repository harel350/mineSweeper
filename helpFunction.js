function isNullOrUndefined(value) {
    return value === undefined || value === null;
}
function isNotNullAndNotUndefined(value) {
    return !isNullOrUndefined(value)
}
function addStyleToDiv(div, styleDiv) {
    for (const [key, value] of Object.entries(styleDiv)) {
        div.style[key] = value;
    }
}

export function createElements(type, parentE, text, id, style, class_, childrenEs = []) {
    const element = document.createElement(type)
    if (isNotNullAndNotUndefined(id)) {
        element.setAttribute('id', id)
    }

    if (isNotNullAndNotUndefined(style)) {
        addStyleToDiv(element, style);
    }

    if (isNotNullAndNotUndefined(class_)) {
        element.className = class_
    }

    if (isNotNullAndNotUndefined(text)) {
        if (type == 'input') {
            element.value = text;
        }
        element.innerText = text;
    }

    for (let i = 0; i < childrenEs.length; i++) {
        const childE = childrenEs[i];
        element.appendChild(childE)
    }

    if (isNotNullAndNotUndefined(parentE)) {
        parentE.appendChild(element)
    }
    return element
}

export function removeAllChildren(parent, specificChildeToRemove) {
    if (specificChildeToRemove) {
        parent.removeChild(specificChildeToRemove)
    }
    else {
        while (parent.hasChildNodes()) {
            parent.removeChild(parent.firstChild)
        }
    }
}
