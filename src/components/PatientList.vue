<template>
  <div id="patientList" class="patient-list-container">
    <h1>Patient List</h1>
    <div class="list-controls">
      <div class="search-container">
        <input
            class="search-input"
            v-model="search"
            placeholder="Search patients..."
        />
      </div>

      <div class="sort-container">
        <label for="sortField">Sort by:</label>
        <select id="sortField" v-model="sortField">
          <option value="">None</option>
          <option value="name">Name</option>
          <option value="age">Age</option>
          <option value="severity">Severity</option>
          <option value="gender">Gender</option>
          <option value="location">Location</option>
        </select>

        <label for="sortOrder">Order:</label>
        <select id="sortOrder" v-model="sortOrder">
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </div>


    <div class="table-container">
      <table class="patient-table">
        <thead>
        <tr class="table-header">
          <th>Name</th>
          <th>Age</th>
          <th>Gender</th>
          <th>Location</th>
          <th>Severity</th>
          <th>Body Part</th>
          <th>Diagnosis</th>

        </tr>
        </thead>
        <tbody>
        <tr
            v-for="patient in filteredPatients.slice()"
            :key="patient.id"
            class="table-row"
        >
          <td>{{ patient.name }}</td>
          <td>{{ patient.age }}</td>
          <td>{{ patient.gender }}</td>
          <td>{{ patient.location }}</td>
          <td>
              <span :class="`severity-badge severity-${getSeverityClass(patient.severity)}`">
                {{ patient.severity }}
              </span>
          </td>
          <td>{{ patient.bodyPart }}</td>
          <td>{{ patient.description }}</td>

        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'


const sortField = ref('')
const sortOrder = ref('asc')



console.log("anything")

const API_BASE = 'http://localhost:3000/api/patients'

const props = defineProps({
  patients: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['edit_patient', 'refresh'])

const search = ref('')

const filteredPatients = computed(() => {
  let result = [...props.patients]

  // Filter by search input
  if (search.value) {
    const searchTerm = search.value.toLowerCase()
    result = result.filter(patient => {
      return Object.entries(patient).some(([key, value]) => {
        if (['id', 'doctor'].includes(key)) return false
        return String(value).toLowerCase().includes(searchTerm)
      })
    })
  }

  // Sorting logic
  if (sortField.value) {
    result.sort((a, b) => {
      let valA = a[sortField.value]
      let valB = b[sortField.value]

      // Normalize strings
      if (typeof valA === 'string') valA = valA.toLowerCase()
      if (typeof valB === 'string') valB = valB.toLowerCase()

      if (valA < valB) return sortOrder.value === 'asc' ? -1 : 1
      if (valA > valB) return sortOrder.value === 'asc' ? 1 : -1
      return 0
    })
  }

  return result
})


function getSeverityClass(severity) {
  if (!severity) return 'default'
  switch (severity.toLowerCase()) {
    case 'mild': return 'mild'
    case 'moderate': return 'moderate'
    case 'severe': return 'severe'
    default: return 'default'
  }
}


function refreshPatients() {
  emit('refresh')
  window.location.reload();
}
</script>

<style scoped>
.patient-list-container {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.list-controls {
  margin-bottom: 1.5rem;
}

.search-container {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.search-input {
  flex-grow: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #a41f13;
  box-shadow: 0 0 0 3px rgba(164, 31, 19, 0.1);
}


.table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 1100px;
}

.patient-table {
  width: 100%;
  border-collapse: collapse;
}

.table-header {
  background-color: #a41f13;
  color: white;
}

.table-header th {
  padding: 1rem;
  text-align: left;
  font-weight: 500;
}

.table-row {
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s;
}

.table-row:hover {
  background-color: rgba(164, 31, 19, 0.05);
}

.table-row td {
  padding: 1rem;
  vertical-align: top;
}

.severity-badge {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 500;
}

.severity-mild {
  background-color: #d4edda;
  color: #155724;
}

.severity-moderate {
  background-color: #fff3cd;
  color: #856404;
}

.severity-severe {
  background-color: #f8d7da;
  color: #721c24;
}

.severity-default {
  background-color: #e2e3e5;
  color: #383d41;
}


.sort-container {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 20px;
}

.sort-container label {
  font-weight: 500;
}

.sort-container select {
  padding: 8px 10px;
  font-size: 0.95rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
  cursor: pointer;
}





@media (max-width: 1200px) {
  .patient-table {
    display: block;
    overflow-x: auto;
  }
}

@media (max-width: 768px) {
  .search-container {
    flex-direction: column;
  }


  .table-header th,
  .table-row td {
    padding: 0.75rem;
  }
}
</style>