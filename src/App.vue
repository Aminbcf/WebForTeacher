<template>
  <div class="app-container">
    <SideNav />
    <Body :patients="patients" @refresh-patients="fetchPatients" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import SideNav from '@/components/SideNav.vue';
import Body from '@/components/Body.vue';
import axios from 'axios';

const patients = ref([]);

const fetchPatients = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/patients");
    patients.value = response.data;
  } catch (error) {
    console.error("Error fetching patients:", error);
  }
};

onMounted(fetchPatients);
</script>

<style scoped>
.app-container {
  display: flex;
  min-height: 100vh;
}
</style>