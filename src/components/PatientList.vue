<template>
  <div class="patient-list-container">
    <div class="list-controls">
      <div class="search-container">
        <input
            class="search-input"
            v-model="search"
            placeholder="Search patients..."
        />
        <button class="refresh-button" @click="refreshPatients">
          Refresh List
        </button>
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
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="patient in filteredPatients"
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
          <td class="action-buttons">
            <button class="edit-button" @click="$emit('edit_patient', patient)">
              Edit
            </button>
            <button class="delete-button" @click="deletePatient(patient.id)">
              Delete
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'

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
  if (!search.value) return props.patients
  const searchTerm = search.value.toLowerCase()
  return props.patients.filter(patient => {
    return Object.entries(patient).some(([key, value]) => {
      // Skip id and other non-searchable fields
      if (['id', 'doctor'].includes(key)) return false
      return String(value).toLowerCase().includes(searchTerm)
    })
  })
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

async function deletePatient(id) {
  if (!confirm('Are you sure you want to delete this patient?')) return

  try {
    const response = await axios.delete(`${API_BASE}/${id}`)
    if (response.status === 200) {
      emit('refresh')
      alert('Patient deleted successfully')
    }
  } catch (error) {
    console.error('Delete error:', error.response?.data || error.message)
    alert(`Delete failed: ${error.response?.data?.message || 'Server error'}`)
  }
}


function refreshPatients() {
  emit('refresh')
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

.refresh-button {
  padding: 0.75rem 1.5rem;
  background-color: #a41f13;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.refresh-button:hover {
  background-color: #8c1711;
}

.table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  overflow: hidden;
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

.action-buttons {
  display: flex;
  gap: 0.75rem;
}

.edit-button,
.delete-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.edit-button {
  background-color: #ff6d05;
  color: white;
}

.edit-button:hover {
  background-color: #ff8b33;
}

.delete-button {
  background-color: #dc3545;
  color: white;
}

.delete-button:hover {
  background-color: #e9606d;
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

  .refresh-button {
    width: 100%;
  }

  .action-buttons {
    flex-direction: column;
    gap: 0.5rem;
  }

  .table-header th,
  .table-row td {
    padding: 0.75rem;
  }
}
</style>