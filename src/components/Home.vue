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

    <div class="cards-container">
      <div class="info-card">
        <h2>📊 Clinic Statistics</h2>
        <p>Total Patients: <strong>{{ totalPatients }}</strong></p>
        <p>Active Appointments: <strong>24</strong></p>
        <p>Staff Members: <strong>8</strong></p>
      </div>


    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  totalPatients: {
    type: Number,
    required: true
  }
});
</script>

<style scoped>
.home-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.header-section {
  text-align: center;
  margin-bottom: 30px;
}

.clinic-logo {
  width: 650px;
  height: 150px;
  object-fit: contain;
  margin: 0 auto 1rem;

}

h1 {
  color: #A41F13;
  margin-bottom: 1rem;
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
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


.activity-item small {
  color: #777;
  display: block;
  font-size: 0.8rem;
}
</style>