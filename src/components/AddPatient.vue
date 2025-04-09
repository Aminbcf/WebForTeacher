<script setup>
import { ref, watch } from 'vue';
import axios from "axios";

const patient = ref({
  id: '',
  name: '',
  age: '',
  gender: 'Male',
  time: '',
  location: '',
  severity: 'Mild',
  bodyPart: 'Head',
  description: '',
  requiredAction: ''
});

const props = defineProps(['patient']);

// Watch for changes in the prop and format the time
watch(() => props.patient, (newPatient) => {
  if (newPatient && newPatient.id) {
    patient.value = { ...newPatient };

    // Format the time for datetime-local input
    if (patient.value.time) {
      // Remove seconds and milliseconds if present
      patient.value.time = patient.value.time.split('.')[0].slice(0, 16);
    }
  } else {
    // Reset to empty form for new patient
    patient.value = {
      id: '',
      name: '',
      age: '',
      gender: 'Male',
      time: new Date().toISOString().slice(0, 16), // Default to current time
      location: '',
      severity: 'Mild',
      bodyPart: 'Head',
      description: '',
      requiredAction: ''
    };
  }
}, { immediate: true });

// Handle form submission
const handleSubmit = async (event) => {
  event.preventDefault();

  try {
    // Prepare the patient data with properly formatted time
    const patientData = {
      ...patient.value,
      time: patient.value.time || new Date().toISOString().slice(0, 16)
    };

    if (patientData.id) {
      // Update existing patient
      await axios.put(`http://localhost:3000/api/patients/${patientData.id}`, patientData);
      console.log('Patient updated:', patientData);
    } else {
      // Create new patient
      await axios.post(`http://localhost:3000/api/patients/`, patientData);
      console.log('Patient created:', patientData);
    }

    // Reset form
    patient.value = {
      id: '',
      name: '',
      age: '',
      gender: 'Male',
      time: new Date().toISOString().slice(0, 16),
      location: '',
      severity: 'Mild',
      bodyPart: 'Head',
      description: '',
      requiredAction: ''
    };

    window.location.reload();
  } catch (error) {
    console.error('Error saving patient:', error);
  }
};
</script>

<template>
  <div id="patientPanel">


    <form id="patientForm" @submit="handleSubmit" class="patient-form">
      <input type="hidden" v-model="patient.id">

      <div class="form-row">
        <div class="form-column">
          <label for="name">Name</label>
          <input class="input" v-model="patient.name" id="name" required>
        </div>

        <div class="form-column">
          <label for="age">Age</label>
          <input class="input" v-model="patient.age" id="age" type="number" required>
        </div>

        <div class="form-column">
          <label for="gender">Gender</label>
          <select class="input" v-model="patient.gender" id="gender">
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div class="form-column">
          <label for="time">Time</label>
          <input
              class="input"
              v-model="patient.time"
              type="datetime-local"
              id="time"
              required
              step="1"
          >
        </div>

        <div class="form-column">
          <label for="location">Location</label>
          <input class="input" v-model="patient.location" id="location" placeholder="Location" required>
        </div>

        <div class="form-column">
          <label for="severity">Severity</label>
          <select class="input" v-model="patient.severity" id="severity">
            <option value="Mild">Mild</option>
            <option value="Moderate">Moderate</option>
            <option value="Severe">Severe</option>
          </select>
        </div>

        <div class="form-column">
          <label for="bodyPart">Body Part</label>
          <select class="input" v-model="patient.bodyPart" id="bodyPart">
            <option value="Head">Head</option>
            <option value="Chest">Chest</option>
            <option value="Arm">Arm</option>
            <option value="Leg">Leg</option>
            <option value="Abdomen">Abdomen</option>
          </select>
        </div>

        <div class="form-column">
          <label for="description">Description</label>
          <textarea class="input" v-model="patient.description" id="description" rows="2" placeholder="Disease description"></textarea>
        </div>

        <div class="form-column">
          <label for="requiredAction">Required Action</label>
          <textarea class="input" v-model="patient.requiredAction" id="requiredAction" rows="2" placeholder="e.g. Rest, Medication, Follow-up"></textarea>
        </div>

        <div class="form-column full-width">
          <button type="submit" class="button button-red">
            {{ patient.id ? 'Update' : 'Save' }} Patient
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
.patient-form {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  width: 100%;
}

.form-column {
  flex: 1;
  min-width: 200px;
}

.full-width {
  width: 100%;
}

.input {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

textarea.input {
  resize: vertical;
}

button.button-red {
  padding: 10px 20px;
  background-color: #A41F13;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button.button-red:hover {
  background-color: #8C1711;
}

label {
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
}

.debug-info {
  color: #666;
  font-size: 0.9em;
  margin-bottom: 1em;
}
</style>