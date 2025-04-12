<template>
  <div class="doctor-management">
    <div class="header">
      <h1>Doctor Management</h1>
      <button @click="showAddForm = true" class="add-button">
        Add New Doctor
      </button>
    </div>

    <!-- Add/Edit Doctor Form -->
    <div v-if="showAddForm || currentDoctor" class="doctor-form">
      <h2>{{ currentDoctor ? 'Edit Doctor' : 'Add New Doctor' }}</h2>
      <form @submit.prevent="submitDoctor">
        <div class="form-group">
          <label>Name:</label>
          <input v-model="formData.name" required />
        </div>

        <div class="form-group">
          <label>Specialization:</label>
          <input v-model="formData.specialization" required />
        </div>

        <div class="form-group">
          <label>Email:</label>
          <input v-model="formData.email" type="email" required />
        </div>

        <div class="form-group">
          <label>Phone:</label>
          <input v-model="formData.phone" required />
        </div>

        <div class="form-group">
          <label>Role:</label>
          <select v-model="formData.role" required>
            <option value="doctor">Doctor</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div class="form-actions">
          <button type="submit" class="save-button">
            {{ currentDoctor ? 'Update' : 'Save' }}
          </button>
          <button type="button" @click="cancelForm" class="cancel-button">
            Cancel
          </button>
        </div>
      </form>
    </div>

    <!-- Doctors List -->
    <div class="doctors-list">
      <div class="search-bar">
        <input
            v-model="searchQuery"
            placeholder="Search doctors..."
            @input="filterDoctors"
        />
      </div>

      <table>
        <thead>
        <tr>
          <th>Name</th>
          <th>Specialization</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="doctor in filteredDoctors.slice().reverse()" :key="doctor.id">
          <td>{{ doctor.name }}</td>
          <td>{{ doctor.specialization }}</td>
          <td>{{ doctor.email }}</td>
          <td>{{ doctor.phone }}</td>
          <td>{{ doctor.role }}</td>
          <td class="actions">
            <button @click="editDoctor(doctor)" class="edit-button">
              Edit
            </button>
            <button @click="confirmDelete(doctor.id)" class="delete-button">
              Delete
            </button>
          </td>
        </tr>
        </tbody>
      </table>

      <div v-if="filteredDoctors.length === 0" class="no-results">
        No doctors found
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal">
        <h3>Confirm Delete</h3>
        <p>Are you sure you want to delete this doctor?</p>
        <div class="modal-actions">
          <button @click="deleteDoctor" class="confirm-button">Delete</button>
          <button @click="showDeleteModal = false" class="cancel-button">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

// Constants
const API_ENDPOINTS = {
  DOCTORS: 'http://localhost:3000/api/doctors'
}

// State
const doctors = ref([])
const filteredDoctors = ref([])
const searchQuery = ref('')
const showAddForm = ref(false)
const currentDoctor = ref(null)
const showDeleteModal = ref(false)
const doctorToDelete = ref(null)

// Form data
const formData = ref({
  name: '',
  specialization: '',
  email: '',
  phone: '',
  role: 'doctor'
})

// Fetch doctors
const fetchDoctors = async () => {
  try {
    const { data } = await axios.get(API_ENDPOINTS.DOCTORS)
    doctors.value = Array.isArray(data) ? data : []
    filteredDoctors.value = [...doctors.value]
  } catch (error) {
    console.error('Failed to fetch doctors:', error)
    doctors.value = []
    filteredDoctors.value = []
  }
}

// Filter doctors
const filterDoctors = () => {
  if (!searchQuery.value) {
    filteredDoctors.value = [...doctors.value]
    return
  }

  const query = searchQuery.value.toLowerCase()
  filteredDoctors.value = doctors.value.filter(doctor => {
    return (
        doctor.name.toLowerCase().includes(query) ||
        (doctor.specialization && doctor.specialization.toLowerCase().includes(query)) ||
        (doctor.email && doctor.email.toLowerCase().includes(query)) ||
        (doctor.role && doctor.role.toLowerCase().includes(query))
    )
  })
}

// Edit doctor
const editDoctor = (doctor) => {
  currentDoctor.value = doctor
  formData.value = { ...doctor }
  showAddForm.value = true
}

// Submit doctor
const submitDoctor = async () => {
  try {
    if (currentDoctor.value) {
      await axios.put(`${API_ENDPOINTS.DOCTORS}/${currentDoctor.value.id}`, formData.value)
    } else {
      await axios.post(API_ENDPOINTS.DOCTORS, formData.value)
    }
    await fetchDoctors()
    resetForm()
  } catch (error) {
    console.error('Error saving doctor:', error)
    alert('Failed to save doctor')
  }
}

// Delete doctor
const deleteDoctor = async () => {
  try {
    await axios.delete(`${API_ENDPOINTS.DOCTORS}/${doctorToDelete.value}`)
    await fetchDoctors()
    showDeleteModal.value = false
  } catch (error) {
    console.error('Error deleting doctor:', error)
    alert('Failed to delete doctor')
  }
}

// Reset form
const resetForm = () => {
  formData.value = {
    name: '',
    specialization: '',
    email: '',
    phone: '',
    role: 'doctor'
  }
  currentDoctor.value = null
  showAddForm.value = false
}

const cancelForm = () => {
  resetForm()
}


const confirmDelete = (id) => {
  doctorToDelete.value = id;
  showDeleteModal.value = true;
};


// Initialize
onMounted(fetchDoctors)

</script>


<style scoped>
.doctor-management {
  padding: 3rem;
  max-width: 2000px;
  width: 110%;
  margin: 0 auto;
  font-family: "Segoe UI", sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header h1 {
  font-size: 2rem;
  color: #333;
}

.add-button {
  padding: 0.75rem 1.5rem;
  background-color: #a41f13;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-button:hover {
  background-color: #8c1711;
}

.doctor-form {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
}

.doctor-form h2 {
  margin-bottom: 1rem;
  color: #a41f13;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.form-group input,
.form-group select {
  width: 80%;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #a41f13;
  outline: none;
  box-shadow: 0 0 0 3px rgba(164, 31, 19, 0.1);
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.save-button,
.cancel-button {
  padding: 0.75rem 1.0rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  font-size: 1rem;
}

.save-button {
  background-color: #28a745;
  color: white;
}

.save-button:hover {
  background-color: #43c15e;
}

.cancel-button {
  background-color: #848487;
  color: white;
}

.cancel-button:hover {
  background-color: rgba(132, 132, 135, 0.27);
}

.doctors-list {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.search-bar {
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
}

.search-bar input {
  width: 80%;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-bar input:focus {
  border-color: #a41f13;
  outline: none;
  box-shadow: 0 0 0 3px rgba(164, 31, 19, 0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background-color: #a41f13;
  color: white;
}

th,
td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

tr:hover {
  background-color: rgba(164, 31, 19, 0.05);
}

.actions {
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

.no-results {
  padding: 1.5rem;
  text-align: center;
  color: #999;
  font-style: italic;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  text-align: center;
}

.modal h3 {
  margin-bottom: 1rem;
  color: #a41f13;
}

.modal-actions {
  margin-top: 2rem;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.confirm-button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
}

.confirm-button:hover {
  background-color: #c82333;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .form-actions,
  .actions {
    flex-direction: column;
    gap: 0.5rem;
  }

  th,
  td {
    padding: 0.75rem;
  }
}


</style>