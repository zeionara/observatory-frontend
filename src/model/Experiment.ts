export class Experiment {
    id: string
    isCompleted: boolean
    startTimestamp: number
    completionTimestamp: number
    metrics: { [id: string]: number }
    params: { [id: string]: any }

    constructor(obj: any) {
        this.id = obj.id
        this.isCompleted = obj.isCompleted
        this.startTimestamp = obj.startTimestamp
        this.completionTimestamp = obj.completionTimestamp
        this.metrics = obj.metrics
        this.params = obj.params
    }
}
