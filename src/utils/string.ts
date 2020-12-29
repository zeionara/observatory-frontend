export function snakeCaseToKebabCase(str: string) {
    let currentComponent = ''
    const components: Array<string> = []
    for (let i = 0; i < str.length; i++) {
        const charCode = str.charCodeAt(i);
        if (charCode > 65 && charCode < 91 && currentComponent.length > 1) {
            components.push(currentComponent)
            currentComponent = str.charAt(i)
        } else {
            currentComponent += str.charAt(i)
        }
    }

    if (currentComponent.length > 0) {
        components.push(currentComponent)
    }

    return components.join('-').toLowerCase()
}

export function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function kebabCaseToSnakeCase(str: string) {
    const components = str.split('-')
    return components[0].toLowerCase() + components.slice(1).map(capitalize).join()
}