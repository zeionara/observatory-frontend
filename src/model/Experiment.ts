import { snakeCaseToKebabCase } from '@/utils/string'
import experimentTypes from '@/config/experiment'
import { ExperimentTypeDescription } from './ExperimentTypeDescription'

export class Experiment {
    id: string
    isCompleted: boolean
    startTimestamp: number
    completionTimestamp: number
    progress: number
    metrics: { [id: string]: number }
    params: { [id: string]: any }

    constructor(obj: any) {
        this.id = obj.id
        this.isCompleted = obj.isCompleted
        this.startTimestamp = obj.startTimestamp
        this.completionTimestamp = obj.completionTimestamp
        this.metrics = obj.metrics
        this.params = obj.params
        this.progress = obj.progress
    }

    get task() {
        return snakeCaseToKebabCase(this.params['task'])
    }

    get experimentType() {
        let result: ExperimentTypeDescription | undefined = undefined
        experimentTypes.forEach(element => {
            console.log(element.name, this.task)
            if (element.name == this.task) {
                result = element
            }
        })
        return result
    }

    // Param wrappers

    get model() {
        return this.params['model'] ?? 'none'
    }

    get dataset() {
        return this.params['datasetPath'] ?? 'none'
    }
}
