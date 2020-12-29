import { capitalize, kebabCaseToSnakeCase } from '@/utils/string'

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
        return capitalize(normalizedName)
    }

    get snakeCasedName() {
        return kebabCaseToSnakeCase(this.name)
    }
}
