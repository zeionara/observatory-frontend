<template>
  <h1>Experiment {{ experimentDescription.id }}</h1>
  <h2>
    <span v-if="experimentDescription.isCompleted">Completed</span>
    <span v-else>Running</span>
  </h2>
  <h2>
    Started {{ new Date(experimentDescription.startTimestamp * 1000).toString() }}
  </h2>
  <h2>
    Finished {{ new Date(experimentDescription.completionTimestamp * 1000).toString() }}
  </h2>
  <h2>Metrics</h2>
  <li v-for="(value, key) in experimentDescription.metrics" :key="key">{{ key }}: {{ value }}</li>
  <h2>Params</h2>
  <li v-for="(value, key) in experimentDescription.params" :key="key">{{ key }}: {{ value }}</li>
  <it-progressbar id="sign-in-progress-bar" :style="'display: ' + (isProgressBarVisible ? 'block' : 'none')" infinite />
</template>

<script lang="ts">
import { ExperimentTypeDescription } from '@/model/ExperimentTypeDescription'
import { Options, Vue } from 'vue-class-component'
import queries from '@/utils/queries'
import logging from '@/utils/logging'
import { Experiment } from '@/model/Experiment'

export default class ExperimentType extends Vue {
  // description!: ExperimentTypeDescription
  isProgressBarVisible = false
  // isExperimentSuccessAlertVisible = false
  // isExperimentDangerAlertVisible = false
  // token = ""
  // experimentCreationError = ""
  experimentDescription = {}

  created() {
    this.queryExperiment(`${this.$route.params.experimentId}`)
  }

  queryExperiment(id: string) {
    console.log("Fetching experiment data...")
    this.isProgressBarVisible = true
    queries.get('get-experiment', {'experiment-id': id})
    .then(response => {
      this.isProgressBarVisible = false
      logging.logObject('Got response:', response)
      this.experimentDescription = new Experiment(response.data)
    }, error => {
      this.experimentDescription = "No such experiment"
      logging.logObject("Error querying experiment: ", error.message)
    })
  }
}
</script>

<style scoped lang="scss">

.param-form {
  width: 500px;
  margin: 0 auto;
}

.param-input-field {
  margin-top: 20px;
  text-align: left;
}

.start-experiment-button {
  margin: 30px auto;
}

</style>