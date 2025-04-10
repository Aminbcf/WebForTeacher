<script setup>

import AddPatient from "@/components/AddPatient.vue";
import PatientList from "@/components/PatientList.vue";
import { ref } from 'vue'

const patient = ref({});
const showeditpatient = ref(0);

const props = defineProps({
  patients: {
    type: Array,
    required: true
  }
});

function edit(patientToEdit) {
  console.log("I am working");
  patient.value = { ...patientToEdit };
  console.log(patient.value);
  showeditpatient.value ++
  location.href="#"



}


</script>

<template>

<div style="display: flex; flex-direction: column">
<AddPatient v-bind:patient="patient" :key="showeditpatient" />
  <hr>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <h1>Patient List</h1>
  <patient-list v-bind:patients="patients" @edit_patient="edit" />
  </div>

</template>

<style scoped>

</style>