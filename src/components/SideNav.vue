<template>
  <div id="wrapper" class="wrapper">
    <!-- Sidebar -->
    <nav id="sidebar" class="sidebar">
      <div class="sidebar-heading">Clinic Panel</div>
      <div class="sidebar-links">
        <a href="#patientPanel" class="sidebar-item" onclick="navigate('patients')">Add Patient</a>
        <a href="#patient-table-search" class="sidebar-item" onclick="navigate('hospitals')">Patient List</a>
       <!--
        <a href="#" class="sidebar-item" onclick="navigate('statistics')">Statistics</a>
        <a href="#" class="sidebar-item" onclick="navigate('logs')">Logs</a>
        <a href="#" class="sidebar-item" onclick="navigate('doctors')" id="doctorAdminOption">Doctors</a>
      -->
      </div>
    </nav>

    <!-- Main Content -->
    <main id="content" class="content">
      <!-- Add your content here -->
    </main>
  </div>
</template>

<script setup>
// Add any Vue-specific logic here
</script>

<style scoped>
/* General styling */
body {
  font-family: 'Segoe UI', sans-serif;
  background-color: #FAF5F1; /* White fog */
  color: #292F36; /* Carbon gray */
  margin: 0;
  padding: 0;
}

.wrapper {
  display: flex;
  height: 100vh;
}

/* Sidebar Styles */
.sidebar {
  width: 200px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #A41F13; /* Fresh red */
  color: white;
  display: flex;
  flex-direction: column;
  padding-top: 20px;
  padding-left: 20px;

}

.sidebar-heading {
  text-align: center;
  font-weight: bold;
  font-size: 24px;
  margin-bottom: 20px;
}

.sidebar-links {
  padding: 0;
}

.sidebar-item {
  padding: 10px 20px;
  color: white;
  text-decoration: none;
  cursor: pointer;
}

.sidebar-item:hover {
  background-color: #ff4d4d;
}

/* Main content area */
.content {
  margin-left: 200px; /* Offset by sidebar width */
  padding: 20px;
  width: 100%;
}
.sidebar-links {
  display :flex;
  flex-direction: column;
}
</style>
