<template>
  <link rel="stylesheet" type="text/css" href="/semantic.min.css">
  <h1>Experiment {{ experimentDescription.id }}</h1>
  <h1>task: {{ experimentDescription.task }}</h1>
  <!-- <h1>type: {{ "ok" + experimentDescription.experimentType }}</h1> -->
  <h2>
    <div class="ui grid centered">
      <div class="three wide column"></div>
      <div class="three wide column">
        <div v-if="experimentDescription.isCompleted" class="ui green message state-message centered">Completed</div>
        <div v-else class="ui blue message state-message">Running</div>
      </div>
      <div class="three wide column"></div>
    </div>
    <!-- <span v-if="experimentDescription.isCompleted">Completed</span> -->
    <!-- <span v-else>Running</span> -->
  </h2>
  <h2>
    Started {{ new Date(experimentDescription.startTimestamp * 1000).toString() }}
  </h2>
  <h2>
    Finished {{ new Date(experimentDescription.completionTimestamp * 1000).toString() }}
  </h2>

  <div class="ui grid centered">
    <div class="three wide column">
      <!-- <h2>Metrics</h2> -->
      <div class="metrics-table-container">
      <table class="ui red table">
        <thead>
          <tr>
            <th>Metric</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(value, key) in experimentDescription.metrics" :key="key">
            <td>{{ key }}</td>
            <td>{{ value }}</td>
          </tr>
        </tbody>
      </table>
      </div>    
    </div>
    <div class="three wide column">
      <!-- <h2>Params</h2> -->
      <div class="params-table-container" v-if="experimentDescription.experimentType">
      <table class="ui green table">
        <thead>
          <tr>
            <th>Param</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
            <tr v-for="(key, i) in experimentDescription.experimentType.params" :key="i">
              <td>{{ key }}</td>
              <td>{{ experimentDescription[key] }}</td>
            </tr>
        </tbody>
      </table>
      </div>
    </div>
  </div>
  <!-- <div v-if="experimentDescription.experimentType">
    <li v-for="(key, i) in experimentDescription.experimentType.params" :key="i">{{ key }}: {{ experimentDescription[key] }}</li>
  </div> -->
  <it-progressbar id="sign-in-progress-bar" :style="'display: ' + (isProgressBarVisible ? 'block' : 'none')" infinite />
<!-- <script src="https://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script> -->
<!-- <script src="/semantic.min.js"></script> -->
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

.metrics-table-container {
  width: 300px
}

.params-table-container {
  width: 300px
}

.state-message {
  width: 500px
}
</style>