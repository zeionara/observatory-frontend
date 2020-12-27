<template>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&display=swap" rel="stylesheet">
  <div class="experiment-type" style="display: flex; flex-direction: column; flex: 1">
    <it-tabs style="flex: 1">
      <it-tab title="Create">
        <div class="param-form">
          <it-input v-for="(paramName, index) in description.params" :key="index" v-model="description.values[paramName]" :message="paramName" class="param-input-field"/>
          <it-button type="primary" pulse outlined class="start-experiment-button" v-on:click="startExperiment()">Start</it-button>
          <it-progressbar id="sign-in-progress-bar" :style="'display: ' + (isProgressBarVisible ? 'block' : 'none')" infinite />
          <it-alert type="success" title="Experiment was created successfully" :body="'Experiment token is ' + token" :style="'display: ' + (isExperimentAlertVisible ? 'block' : 'none')"/>
        </div>
      </it-tab>
      <it-tab title="Track">Second tab</it-tab>
      <it-tab title="Analyse">Third tab</it-tab>
    </it-tabs>
  </div>
</template>

<script lang="ts">
import { ExperimentTypeDescription } from '@/model/ExperimentTypeDescription'
import { Options, Vue } from 'vue-class-component'
import queries from '@/utils/queries'
import logging from '@/utils/logging'

@Options({
  props: {
    description: ExperimentTypeDescription
  }
})
export default class ExperimentType extends Vue {
  description!: ExperimentTypeDescription
  isProgressBarVisible = false
  isExperimentAlertVisible = false
  token = ""
  
  startExperiment() {
    console.log("Starting a new experiment...")
    this.isProgressBarVisible = true
    queries.post('start-experiment', Object.assign(this.description.values, {'type': this.description.name}))
    .then(response => {
      logging.logObject('Got response:', response)
      this.token = response.data ? response.data['experiment-id'] : "none"
      this.isProgressBarVisible = false
      this.isExperimentAlertVisible = true
    }, error => {
      this.isProgressBarVisible = false
      logging.logObject('Cannot start an experiment:', error)
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