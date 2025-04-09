<template>
  <div id="patient-table-search">
    <div class="d-flex justify-content-between mb-4">
      <input
          class="input"
          v-model="search"
          placeholder="Search patients..."
      />
      <button class="button" @click="refreshPatients">
        <i class="bi bi-arrow-clockwise"></i> Refresh
      </button>
    </div>

    <div class="table-responsive">
      <table class="table table-hover table-bordered">
        <thead class="table-danger">
        <tr>
          <th>Name</th>
          <th>Age</th>
          <th>Gender</th>
          <th>Location</th>
          <th>Severity</th>
          <th>Body Part</th>
          <th>Diagnosis</th>
          <th>Action</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="patient in filteredPatients" :key="patient.id">
          <td>{{ patient.name }}</td>
          <td>{{ patient.age }}</td>
          <td>{{ patient.gender }}</td>
          <td>{{ patient.location }}</td>
          <td>
              <span :class="`badge bg-${getSeverityClass(patient.severity)}`">
                {{ patient.severity }}
              </span>
          </td>
          <td>{{ patient.bodyPart }}</td>
          <td>{{ patient.description }}</td>
          <td>{{ patient.requiredAction }}</td>
          <td>
            <button style="margin-right: 10px" class="buttonEdit" @click="$emit('edit_patient', patient)">
              <i class="bi bi-pencil"></i> Edit
            </button>
            <button class="buttonDelete" @click="deletePatient(patient.id)">
              <i class="bi bi-trash"></i> Delete
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <br>
    <br>
    <br>
    <br>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'

const props = defineProps(['patients'])
const emit = defineEmits(['edit_patient', 'refresh'])

const search = ref('')

const filteredPatients = computed(() => {
  if (!search.value) return props.patients
  return props.patients.filter(patient =>
      Object.values(patient).some(val =>
          String(val).toLowerCase().includes(search.value.toLowerCase())
      )
  )
})




function deletePatient(id) {
  axios.delete(`http://localhost:3000/api/patients/${id}`)
      .then(() => {
        window.location.reload()
        emit('refresh')

      })
      .catch((error) => {
        console.error('Delete error:', error)
      })
}

function refreshPatients() {
  emit('refresh')
}

function getSeverityClass(severity) {
  switch (severity.toLowerCase()) {
    case 'mild': return 'success'
    case 'moderate': return 'warning'
    case 'severe': return 'danger'
    default: return 'secondary'
  }
}
</script>

<style scoped>
.table-hover tbody tr:hover {
  background-color: rgba(220, 53, 69, 0.1);
}

.badge {
  font-size: 0.9em;
  padding: 0.35em 0.65em;
  background-color: #A41F13;
  color: #fff;
  border-radius: 0.25em;
  display: inline-block;
}

.input {
  width: 100%;
  padding: 12px;
  margin-top: 6px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 15px;
  box-sizing: border-box;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.input:focus {
  outline: none;
  border-color: #A41F13;
  box-shadow: 0 0 5px rgba(164, 31, 19, 0.4);
}

.button {
  padding: 12px 24px;
  background-color: #A41F13;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  font-size: 15px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.button:hover {
  background-color: #8c1711;
}

.buttonEdit {
  background-color: #ff6d05 !important;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
  border-radius: 10px;
  transition: background-color 0.3s ease;
}

.buttonEdit:hover {
  background-color: #ffbd8d !important;
  color: black;
}

.buttonDelete {
  background-color: #dc3545;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
  border-radius: 10px;
  transition: background-color 0.3s ease;
}

.buttonDelete:hover {
  background-color: #ff5f73;
  color: black;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.table th, .table td {
  padding: 12px;
  text-align: left;
  border: 1px solid #ddd;
  font-size: 14px;
}

.table th {
  background-color: #F2F2F2;
  font-weight: bold;
}

.list {
  list-style: none;
  padding-left: 0;
  margin-top: 10px;
}

.list li {
  background-color: #E0DBD8;
  padding: 12px;
  margin: 6px 0;
  border-radius: 6px;
  font-size: 14px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}
</style>
