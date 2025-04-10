<template>
  <div class="patient-form-container">
    <div class="form-card">
      <div class="form-header">
        <h1>{{ patient.id ? 'Update Patient' : 'Register New Patient' }}</h1>
      </div>

      <form @submit.prevent="handleSubmit" class="patient-form">
        <div class="form-grid">
          <!-- Personal Info -->
          <div class="form-group">
            <label for="name">Full Name *</label>
            <input
                id="name"
                v-model="patient.name"
                type="text"
                required
                placeholder="Full Name"
            >
          </div>

          <div class="form-group">
            <label for="age">Age *</label>
            <input
                id="age"
                v-model="patient.age"
                type="number"
                min="0"
                max="120"
                required
                placeholder="Age"
            >
          </div>

          <div class="form-group">
            <label for="gender">Gender *</label>
            <select id="gender" v-model="patient.gender" required>
              <option value="Male">Male</option>
              <option value="Female">Female</option>

            </select>
          </div>


          <div class="form-group">
            <label for="time">Appointment Time *</label>
            <input
                id="time"
                v-model="patient.time"
                type="datetime-local"
                required
            >
          </div>

          <div class="form-group">
            <label for="location">Location *</label>
            <input
                id="location"
                v-model="patient.location"
                type="text"
                required
                placeholder="City or Facility"
            >
          </div>

          <div class="form-group">
            <label for="doctor">Attending Doctor *</label>
            <select
                id="doctor"
                v-model="patient.doctor"
                required
            >
              <option value="">Select a doctor</option>
              <option
                  v-for="doctor in doctors"
                  :key="doctor.id"
                  :value="doctor.email"
              >
                {{ doctor.email }}
              </option>
            </select>
          </div>


          <div class="form-group">
            <label for="severity">Condition Severity</label>
            <select id="severity" v-model="patient.severity">
              <option value="Mild">Mild</option>
              <option value="Moderate">Moderate</option>
              <option value="Severe">Severe</option>
            </select>
          </div>

          <div class="form-group">
            <label for="bodyPart">Affected Area</label>
            <select id="bodyPart" v-model="patient.bodyPart">
              <option value="Head">Head</option>
              <option value="Chest">Chest</option>
              <option value="Arm">Arm</option>
              <option value="Leg">Leg</option>
              <option value="Abdomen">Abdomen</option>
            </select>
          </div>


          <div class="form-group full-width">
            <label for="description">Symptoms Description</label>
            <textarea
                id="description"
                v-model="patient.description"
                rows="4"
                placeholder="Describe the patient's symptoms..."
            ></textarea>
          </div>

          <div class="form-group full-width">
            <label for="requiredAction">Treatment Plan</label>
            <textarea
                id="requiredAction"
                v-model="patient.requiredAction"
                rows="4"
                placeholder="Prescribed treatment and follow-up..."
            ></textarea>
          </div>


          <div class="form-actions full-width">
            <button type="submit" class="submit-button">
              {{ patient.id ? 'Update Patient' : 'Register Patient' }}
            </button>
            <button
                v-if="patient.id"
                type="button"
                class="cancel-button"
                @click="resetForm"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, watch } from 'vue'
  import axios from 'axios'

  // API endpoints
  const API_BASE = 'http://localhost:3000/api/patients'
  const DOCTORS_API = 'http://localhost:3000/api/doctors'

  // Reactive state
  const doctors = ref([])
  const isLoading = ref(false)
  const patient = ref({
  id: '',
  name: '',
  age: '',
  gender: 'Male',
  time: new Date().toISOString().slice(0, 16),
  location: '',
  severity: 'Mild',
  bodyPart: 'Head',
  description: '',
  requiredAction: '',
  doctor: null
})

  // Emit event
  const emit = defineEmits(['patient-saved'])

  // Props
  const props = defineProps({
  patient: {
  type: Object,
  required: true
}
})

  // Watch for changes to the prop and update local patient data
  watch(() => props.patient, (newPatient) => {
  if (newPatient) {
  patient.value = {
  ...newPatient,
  time: newPatient.time
  ? new Date(newPatient.time).toISOString().slice(0, 16)
  : new Date().toISOString().slice(0, 16),
  doctor: newPatient.doctor || null
}
} else {
  resetForm()
}
}, { immediate: true })

  // Load doctors from API
  const loadDoctors = async () => {
  try {
  isLoading.value = true
  const response = await axios.get(DOCTORS_API)
  if (Array.isArray(response.data)) {
  doctors.value = response.data
} else {
  console.error('Unexpected doctors data format:', response.data)
  alert('Failed to load doctors list')
}
} catch (error) {
  console.error('Doctors API error:', error)
  alert(`Could not load doctors: ${error.message}`)
} finally {
  isLoading.value = false
}
}

  onMounted(loadDoctors)

  // Format time for database
  const formatTimeForDB = (timeString) => {
  const date = new Date(timeString)
  return [
  date.getFullYear(),
  String(date.getMonth() + 1).padStart(2, '0'),
  String(date.getDate()).padStart(2, '0')
  ].join('-') + ' ' + [
  String(date.getHours()).padStart(2, '0'),
  String(date.getMinutes()).padStart(2, '0'),
  '00'
  ].join(':')
}

  // Reset form to default values
  const resetForm = () => {
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
    requiredAction: '',
    doctor: null
  }
}

  // Form submission handler
  const handleSubmit = async (event) => {
  event.preventDefault()
  console.log("Submitting patient form")

  try {
  const patientData = {
  name: String(patient.value.name),
  age: Number(patient.value.age),
  gender: String(patient.value.gender),
  time: formatTimeForDB(patient.value.time),
  location: patient.value.location || null,
  severity: patient.value.severity || null,
  bodyPart: patient.value.bodyPart || null,
  description: patient.value.description || null,
  requiredAction: patient.value.requiredAction || null,
  doctor: patient.value.doctor || null
}

  const response = patient.value.id
  ? await axios.put(`${API_BASE}/${patient.value.id}`, patientData)
  : await axios.post(API_BASE, patientData)

  resetForm()
    window.location.reload()
  emit('patient-saved')
  alert('Patient record saved successfully!')
} catch (error) {
  console.error('Submission error:', error)
  alert(`Save failed: ${error.response?.data?.message || error.message}`)
}
}
</script>



<style scoped>
.patient-form-container {
  padding: 2rem;


}

.form-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.form-header {
  background: #a41f13;
  color: white;
  padding: 1.5rem 2rem;
}

.form-header h1 {
  margin: 0;
  font-size: 1.5rem;
}

.patient-form {
  padding: 2rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.form-group {
  margin-bottom: 1.5rem;
}

.full-width {
  grid-column: 1 / -1;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

input,
select,
textarea {
  width: 80%;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
  background-color: #f8f8f8;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #a41f13;
  box-shadow: 0 0 0 3px rgba(164, 31, 19, 0.1);
  background-color: white;
}

select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;
}

textarea {
  min-height: 120px;
  resize: vertical;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.submit-button {
  padding: 1rem;
  background-color: #a41f13;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;
}

.submit-button:hover {
  background-color: #8c1711;
}

.cancel-button {
  padding: 1rem;
  background-color: #f0f0f0;
  color: #333;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;
}

.cancel-button:hover {
  background-color: #ddd;
}

@media (max-width: 768px) {
  .patient-form {
    padding: 1.5rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>