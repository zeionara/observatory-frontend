<template>
  <div class="home">
    <div v-if="isAuthenticated" style="display: flex; flex-direction: column; flex: 1">
      <it-tabs style="flex: 1">
        <it-tab title="Experiments">
          <div style="display: flex; flex-direction: column; flex: 1">
            <it-tabs style="flex: 1">
              <it-tab v-for="(experimentTypeDescription, index) in experimentTypes" :key=index :title="experimentTypeDescription.capitalizedName">
                <ExperimentType :description="experimentTypeDescription"/>
              </it-tab>
            </it-tabs>
          </div>
        </it-tab>
        <it-tab title="Settings">
          <Authentication v-if="isAuthenticated" @sign-in="checkIsAuthenticated" @sign-out="checkIsAuthenticated"/>
        </it-tab>
      </it-tabs>
    </div>
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/> -->
    <Authentication v-if="!isAuthenticated" @sign-in="checkIsAuthenticated" @sign-out="checkIsAuthenticated"/>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import ExperimentType from '@/components/ExperimentType.vue';
import Authentication from '@/components/Authentication.vue';
import Authenticable from '@/components/Authenticable';
import { ExperimentTypeDescription } from '@/model/ExperimentTypeDescription'

@Options({
  components: {
    ExperimentType,
    Authentication
  },
})
export default class Home extends Authenticable {
  experimentTypes = [
    new ExperimentTypeDescription(
      'link-prediction',
      ['model', 'dataset']
    )
  ]
}
</script>
