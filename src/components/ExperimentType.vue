<template>
  <link rel="stylesheet" type="text/css" href="/semantic.min.css">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&display=swap" rel="stylesheet">
  <div class="experiment-type" style="display: flex; flex-direction: column; flex: 1">
    <it-tabs style="flex: 1">
      <it-tab title="Create">
        <div class="param-form">
          <it-input v-for="(paramName, index) in description.params" :key="index" v-model="description.values[paramName]" :message="paramName" class="param-input-field"/>
          <it-button type="primary" pulse outlined class="start-experiment-button" v-on:click="startExperiment()">Start</it-button>
          <it-progressbar id="sign-in-progress-bar" :style="'display: ' + (isProgressBarVisible ? 'block' : 'none')" infinite />
          <a :href="'/experiment/' + token">
            <it-alert id="experiment-succsess-alert" type="success" title="Experiment was created successfully" :body="'Experiment token is ' + token" :style="'visibility: ' + (isExperimentSuccessAlertVisible ? 'visible' : 'hidden')"/>
          </a>
          <it-alert id="experiment-danger-alert" type="danger" title="Error when creating an experiment" :body="experimentCreationError" :style="'visibility: ' + (isExperimentDangerAlertVisible ? 'visible' : 'hidden')"/>
        </div>
      </it-tab>
      <it-tab title="Track">
        <table class="ui celled table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Started</th>
              <th>Completed</th>
              <th>Status</th>
              <th>Progress</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in experiments" :key="i">
              <td data-label="Id"><a :href="'/experiment/' + item.id">{{ item.id }}</a></td>
              <td data-label="Started">{{ new Date(item.startTimestamp * 1000).toString() }}</td>
              <td data-label="Completed">{{ new Date(item.completionTimestamp * 1000).toString() }}</td>
              <td data-label="Status" :class="item.isCompleted ? 'positive' : 'warning'">{{ item.isCompleted ? 'Completed' : 'Running' }}</td>
              <td data-label="Progress">
                <div class="ui indicating progress" :id="'progress-' + item.id" :data-percent="item.progress * 100">
                  <div class="bar" :style="'transition-duration: 300ms; width: ' + item.progress * 100 + '%;'">
                    <div class="progress">{{ item.progress * 100 + '%'}}</div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </it-tab>
      <it-tab title="Analyse">
        <canvas id="experimentsChart"></canvas>
      </it-tab>
    </it-tabs>
  </div>
</template>

<script lang="ts">
import { ExperimentTypeDescription } from '@/model/ExperimentTypeDescription'
import { Options, Vue } from 'vue-class-component'
import queries from '@/utils/queries'
import logging from '@/utils/logging'
import { Experiment } from '@/model/Experiment'
import Chart from 'chart.js'
import { backgroundColors, borderColors } from '@/utils/colors'
import { kebabCaseToSnakeCase } from '@/utils/string'

@Options({
  props: {
    description: ExperimentTypeDescription
  }
})
export default class ExperimentType extends Vue {
  description!: ExperimentTypeDescription
  isProgressBarVisible = false
  isExperimentSuccessAlertVisible = false
  isExperimentDangerAlertVisible = false
  token = ""
  experimentCreationError = ""
  isExperimentsTableProgressBarVisible = false
  experiments: Array<Experiment> = []
  errorMessage = ""

  created() {
    this.queryExperiments()
  }

  mounted() {
    const jqueryScript = document.createElement('script')
    jqueryScript.setAttribute('src', 'https://code.jquery.com/jquery-3.1.1.min.js')
    jqueryScript.setAttribute('integrity', 'sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=')
    jqueryScript.setAttribute('crossorigin', 'anonymous')
    document.head.appendChild(jqueryScript)

    const semanticScript = document.createElement('script')
    semanticScript.setAttribute('src', '/semantic.min.js')
    document.head.appendChild(semanticScript)
  }

  startExperiment() {
    console.log("Starting a new experiment...")
    this.isProgressBarVisible = true
    queries.post('start-experiment', Object.assign(this.description.values, {'task': this.description.snakeCasedName}))
    .then(response => {
      logging.logObject('Got response:', response)
      this.token = response.data ? response.data['experiment-id'] : "none"
      this.isProgressBarVisible = false
      this.isExperimentSuccessAlertVisible = true
      this.isExperimentDangerAlertVisible = false
    }, error => {
      this.isProgressBarVisible = false
      this.isExperimentDangerAlertVisible = true
      this.isExperimentSuccessAlertVisible = false
      this.experimentCreationError = error.message
      logging.logObject("Error creating an experiment: ", error.message)
    })
  }

  queryExperiments() {
    console.log("Fetching experiment data...")
    this.isExperimentsTableProgressBarVisible = true
    console.log(this.description.snakeCasedName)
    queries.get('get-experiments', {'type': this.description.snakeCasedName})
    .then(response => {
      this.isExperimentsTableProgressBarVisible = false
      logging.logObject('Got response:', response)
      this.experiments = response.data['items'].map(item => new Experiment(item)).sort(function(lhs, rhs) {
        return rhs.startTimestamp - lhs.startTimestamp;
      })

      const metrics: Array<string> = []

      this.experiments.forEach(element => {
        for(const [metric, value] of Object.entries(element.metrics)) {
          if (!metrics.includes(metric)) {
            metrics.push(metric)
          }
        }
      })

      let colorIndex = -1

      const datasets = this.experiments.map(function(experiment: Experiment){
        colorIndex += 1
        return {
          label: experiment.id,
          data: metrics.map(metric =>
            experiment.metrics[metric]
          ),
          backgroundColor: backgroundColors[colorIndex],
          borderColor: borderColors[colorIndex],
          borderWidth: 1
        }
      })

      //@ts-ignore
      const ctx = document.getElementById('experimentsChart')!.getContext('2d');
      const experimentsChart = new Chart(ctx, {
          type: 'bar',
          data: 
          {
              labels: metrics,
              datasets: datasets.slice(0, 5)
          },
          options: {
              scales: {
                  yAxes: [{
                      ticks: {
                          beginAtZero: true
                      }
                  }]
              }
          }
      })
    }, error => {
      this.errorMessage = "Cannot fetch experiments"
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
