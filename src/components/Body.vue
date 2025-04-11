<script setup>
import { ref, onMounted, computed } from 'vue'
import AddPatient from "@/components/AddPatient.vue";
import PatientList from "@/components/PatientList.vue";
import Home from "@/components/Home.vue";



const patient = ref([]);
const showeditpatient = ref(0);
const currentView = ref('home');
const showWelcome = ref(true);
const sidebarCollapsed = ref(false);
const isMobile = ref(false);

const props = defineProps({
  patients: {
    type: Array,
    required: true
  },

});




function edit(patientToEdit) {
  patient.value = { ...patientToEdit };
  showeditpatient.value++;
  currentView.value = 'add';
}

function navigateTo(view) {
  currentView.value = view;
  if (isMobile.value) {
    sidebarCollapsed.value = true;
  }
}

function toggleSidebar() {
  sidebarCollapsed.value = !sidebarCollapsed.value;
}

function checkMobile() {
  isMobile.value = window.innerWidth <= 768;
  if (isMobile.value) {
    sidebarCollapsed.value = true;
  }
}

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);

  setTimeout(() => {
    showWelcome.value = false;
    if (currentView.value === 'welcome') {
      currentView.value = 'home';
    }
  }, 3000);
});
</script>

<template>
  <div id="wrapper" class="wrapper">

    <button
        class="hamburger"
        @click="toggleSidebar"
        :class="{ 'active': !sidebarCollapsed }"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>


    <nav
        id="sidebar"
        class="sidebar"
        :class="{ 'collapsed': sidebarCollapsed, 'mobile': isMobile }"
    >
      <div class="sidebar-header">
        <h1 class="sidebar-title" v-if="!sidebarCollapsed">Control Panel</h1>
      </div>
      <div class="sidebar-links">
        <a href="#" class="sidebar-item" @click.prevent="navigateTo('home')" :title="sidebarCollapsed ? 'Home' : ''">
          <span class="item-icon">🏠</span>
          <span class="item-text" v-if="!sidebarCollapsed">Home</span>
        </a>
        <a href="#" class="sidebar-item" @click.prevent="navigateTo('add')" :title="sidebarCollapsed ? 'Add Patient' : ''">
          <span class="item-icon">➕</span>
          <span class="item-text" v-if="!sidebarCollapsed">Add Patient</span>
        </a>
        <a href="#" class="sidebar-item" @click.prevent="navigateTo('list')" :title="sidebarCollapsed ? 'Patient List' : ''">
          <span class="item-icon">📋</span>
          <span class="item-text" v-if="!sidebarCollapsed">Patient List</span>
        </a>
      </div>
    </nav>

    <main
        id="content"
        class="content"
        :class="{ 'sidebar-collapsed': sidebarCollapsed }"
    >


      <div v-show="currentView !== 'welcome' || !showWelcome">
        <transition name="fade" mode="out-in">
          <component
              :is="currentView === 'home' ? Home :
                 currentView === 'add' ? AddPatient :
                 PatientList"
              v-bind="currentView === 'home' ? {  patientList: patients  } :
                    currentView === 'add' ? { patient, key: showeditpatient } :
                    { patients }"
              v-on="currentView === 'list' ? { edit_patient: edit } : {}"
              :key="currentView"
          />
        </transition>
      </div>
    </main>
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  min-height: 100vh;
  font-family: 'Segoe UI', system-ui, sans-serif;
  position: relative;
}


.hamburger {
  display: none;
  position: fixed;
  top: 15px;
  left: 15px;
  z-index: 1100;
  background: #A41F13;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  flex-direction: column;
  justify-content: space-between;
  height: 40px;
  width: 40px;
}

.hamburger span {
  display: block;
  height: 3px;
  width: 100%;
  background: white;
  border-radius: 3px;
  transition: all 0.3s ease;
}

.hamburger.active span:nth-child(1) {
  transform: translateY(11px) rotate(45deg);
}

.hamburger.active span:nth-child(2) {
  opacity: 0;
}

.hamburger.active span:nth-child(3) {
  transform: translateY(-11px) rotate(-45deg);
}


.sidebar {
  width: 250px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #A41F13;
  color: white;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transition: all 0.3s ease;
}

.sidebar.collapsed {
  width: 70px;
  overflow: hidden;
}

.sidebar.mobile {
  transform: translateX(-100%);
}

.sidebar.mobile:not(.collapsed) {
  transform: translateX(0);
}

.sidebar-header {
  padding: 1.5rem;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.sidebar.collapsed .sidebar-header {
  padding: 1rem 0.5rem;
}

.sidebar-title {
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0;
  color: white;
  transition: all 0.3s ease;
}

.sidebar.collapsed .sidebar-title {
  display: none;
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
  white-space: nowrap;
}

.sidebar.collapsed .sidebar-item {
  padding: 0.8rem 0.5rem;
  justify-content: center;
}

.sidebar-item:hover {
  background-color: rgba(255, 255, 255, 0.15);
  transform: translateX(5px);
}

.sidebar.collapsed .sidebar-item:hover {
  transform: none;
}

.item-icon {
  font-size: 1.1rem;
  margin-right: 0.8rem;
  width: 20px;
  text-align: center;
}

.sidebar.collapsed .item-icon {
  margin-right: 0;
  font-size: 1.3rem;
}

.item-text {
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.sidebar.collapsed .item-text {
  display: none;
}


.content {
  margin-left: 250px;
  width: calc(100% - 250px);
  padding: 2rem;
  background-color: #FAF5F1;
  transition: all 0.3s ease;
}

.content.sidebar-collapsed {
  margin-left: 70px;
  width: calc(100% - 70px);
}


.welcome-message {
  text-align: center;
  padding: 2rem;
  margin-top: 2rem;
}

.welcome-message h1 {
  color: #A41F13;
  margin-bottom: 1rem;
}


.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hamburger {
    display: flex;
  }

  .sidebar {
    width: 250px;
    transform: translateX(-100%);
  }

  .sidebar:not(.collapsed) {
    transform: translateX(0);
  }

  .content {
    margin-left: 0;
    width: 100%;
  }

  .content.sidebar-collapsed {
    margin-left: 0;
    width: 100%;
  }
}
</style>