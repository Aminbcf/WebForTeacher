<template>
  <div id="wrapper" class="wrapper">
    <!-- Sidebar -->
    <nav id="sidebar" class="sidebar">
      <div class="sidebar-header">
        <img
            src="../assets/img.png"
            alt="Clinic Logo"
            class="clinic-logo"
        />
        <h1 class="sidebar-title">Control Panel</h1>
      </div>
      <div class="sidebar-links">
        <a href="#patient-form" class="sidebar-item" @click.prevent="scrollTo('patient-form')">
          <span class="item-icon">➕</span>
          <span class="item-text">Add Patient</span>
        </a>
        <a href="#patient-list" class="sidebar-item" @click.prevent="scrollTo('patient-list')">
          <span class="item-icon">📋</span>
          <span class="item-text">Patient List</span>
        </a>
      </div>
    </nav>

    <!-- Main Content -->
    <main id="content" class="content">
      <slot></slot>
    </main>
  </div>
</template>

<script setup>
const scrollTo = (sectionId) => {
  // Remove the # from the ID if present
  const cleanId = sectionId.replace('#', '');
  const element = document.getElementById(cleanId);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
};
</script>

<style scoped>

.wrapper {
  display: flex;
  min-height: 100vh;
  font-family: 'Segoe UI', system-ui, sans-serif;
}

/* Sidebar Styles */
.sidebar {
  width: 250px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #A41F13; /* Your brand red */
  color: white;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.sidebar-header {
  padding: 1.5rem;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.clinic-logo {
  width: 100%;
  height: 150px;
  border-radius: 10%;
  object-fit: cover;
  margin: 0 auto 1rem;
  border: 3px solid white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.sidebar-title {
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0;
  color: white;
}

.sidebar-links {
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
}

.sidebar-item {
  display: flex;
  align-items: center;
  padding: 0.8rem 1.5rem;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
  margin: 0.2rem 0;
}

.sidebar-item:hover {
  background-color: rgba(255, 255, 255, 0.15);
  transform: translateX(5px);
}

.item-icon {
  font-size: 1.1rem;
  margin-right: 0.8rem;
  width: 20px;
  text-align: center;
}

.item-text {
  font-size: 0.95rem;
}

/* Main Content Area */
.content {
  margin-left: 250px;
  width: calc(100% - 250px);
  padding: 2rem;
  background-color: #FAF5F1; /* Your background color */
}

/* Responsive Design */
@media (max-width: 768px) {
  .sidebar {
    width: 70px;
    overflow: hidden;
  }

  .sidebar-header {
    padding: 1rem 0.5rem;
  }

  .clinic-logo {
    width: 40px;
    height: 40px;
    margin-bottom: 0.5rem;
  }

  .sidebar-title {
    display: none;
  }

  .item-text {
    display: none;
  }

  .sidebar-item {
    justify-content: center;
    padding: 0.8rem 0.5rem;
  }

  .item-icon {
    margin-right: 0;
    font-size: 1.3rem;
  }

  .content {
    margin-left: 70px;
    width: calc(100% - 70px);
    padding: 1rem;
  }
}
</style>