<template>
  <div class="home-container">
    <img
        src="@/assets/img.png"
        alt="Clinic Logo"
        class="clinic-logo"
    />

    <div class="header-section">
      <h1>Welcome to Clinic Management System</h1>
    </div>

    <div v-if="isLoading" class="loading-indicator">
      Loading data...
    </div>

    <div v-else>
      <div class="cards-container">
        <div class="info-card">
          <h2>📊 Clinic Statistics</h2>
          <p>Total Patients: <strong>{{ patientList.length }}</strong></p>
          <p>Active Appointments: <strong>{{ activeAppointments }}</strong></p>
          <p>Staff Members: <strong>{{ doctors.length }}</strong></p>
        </div>

        <div class="info-card">
          <h2>🧍 Patient Overview</h2>
          <p>Mild Cases: <strong>{{ mildCases }}</strong></p>
          <p>Moderate Cases: <strong>{{ moderateCases }}</strong></p>
          <p>Severe Cases: <strong>{{ severeCases }}</strong></p>
        </div>

        <div class="info-card">
          <h2>🧑‍🤝‍🧑 Patient Demographics</h2>
          <p>Male: <strong>{{ malePatients }}</strong></p>
          <p>Female: <strong>{{ femalePatients }}</strong></p>

        </div>

        <div class="info-card">
          <h2>🩺 Staff Roles</h2>
          <p>Admins: <strong>{{ adminCount }}</strong></p>
          <p>Doctors: <strong>{{ doctorCount }}</strong></p>
        </div>
      </div>




    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, nextTick } from 'vue'
import axios from 'axios'
import Chart from 'chart.js/auto'


const API_BASE = 'http://localhost:3000/api/patients'
const DOCTORS_API = 'http://localhost:3000/api/doctors'

// Props
const props = defineProps({
  patientList: {
    type: Array,
    required: true,
    default: () => []
  }
})

// State
const doctors = ref([])
const isLoading = ref(true)
const activeAppointments = ref(24)


// Load doctors
const loadDoctors = async () => {
  try {
    isLoading.value = true
    const response = await axios.get(DOCTORS_API)
    if (Array.isArray(response.data)) {
      doctors.value = response.data
    } else {
      console.error('Unexpected doctors data format:', response.data)
      doctors.value = []
    }
  } catch (error) {
    console.error('Doctors API error:', error)
    doctors.value = []
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadDoctors()
})

// Computed Stats
const mildCases = computed(() =>
    props.patientList.filter(p => p.severity === 'Mild').length
)
const moderateCases = computed(() =>
    props.patientList.filter(p => p.severity === 'Moderate').length
)
const severeCases = computed(() =>
    props.patientList.filter(p => p.severity === 'Severe').length
)

const malePatients = computed(() =>
    props.patientList.filter(p => p.gender === 'Male').length
)
const femalePatients = computed(() =>
    props.patientList.filter(p => p.gender === 'Female').length
)


const adminCount = computed(() =>
    doctors.value.filter(d => d.role === 'admin').length
)
const doctorCount = computed(() =>
    doctors.value.filter(d => d.role === 'doctor').length
)
console.log("DDDDDDDDDDDDD"+moderateCases.value)
console.log(severeCases)


</script>

<style scoped>
.home-container {
  padding: 20px;
  max-width: 100%;
  margin: 0 auto;
  margin-left: 100px;
  min-height: 100vh;
}

.header-section {
  text-align: center;
  margin-bottom: 30px;
}

.clinic-logo {
  width: 650px;
  max-width: 100%;
  height: auto;
  max-height: 150px;
  object-fit: contain;
  margin: 0 auto 1rem;
  display: block;
}

h1 {
  color: #A41F13;
  margin-bottom: 1rem;
}

.loading-indicator {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: #A41F13;
}

.cards-container {
  display: grid;
  gap: 20px;
  margin-bottom: 30px;

}

.info-card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.info-card:hover {
  transform: translateY(-5px);
}

.info-card h2 {
  margin-top: 0;
  color: #A41F13;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

@media (max-width: 768px) {
  .cards-container {
    grid-template-columns: 1fr;
  }



  .clinic-logo {
    width: 100%;
  }
}

canvas {
  width: 100% !important;
  max-width: 400px;
  height: auto !important;
}

</style>