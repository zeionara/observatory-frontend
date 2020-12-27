export class ExperimentTypeDescription {
    name: string
    params: Array<string>
    values: object

    constructor(name: string, params: Array<string>) {
        this.name = name
        this.params = params
        this.values = {}
        params.forEach(param => {
            this.values[param] = undefined
        })
    }

    get capitalizedName() {
        const normalizedName = this.name.replaceAll('-', ' ').toLowerCase()
        return normalizedName.charAt(0).toUpperCase() + normalizedName.slice(1)
    }
}
