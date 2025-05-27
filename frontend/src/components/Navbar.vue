<template>
  <header class="navbar">
    <div class="container">
      <router-link to="/" class="brand">
        <span class="logo-icon">✓</span>
        <span class="logo-text">TaskMaster</span>
      </router-link>

      <div class="menu" :class="{ open: menuOpen }">
        <nav class="nav-main">
          <router-link to="/dashboard" @click="menuOpen = false">
            <i class="icon">📊</i> Dashboard
          </router-link>
          <router-link to="/tasks" @click="menuOpen = false">
            <i class="icon">✅</i> Tareas
          </router-link>
          <router-link to="/calendar" @click="menuOpen = false">
            <i class="icon">📅</i> Calendario
          </router-link>
        </nav>

        <div class="user-actions">
          <template v-if="userLoggedIn">
            <div class="user-dropdown">
              <button class="user-btn" @click="toggleUserMenu">
                <span class="user-avatar">👤</span>
                <span class="user-name">{{ userName }}</span>
              </button>
              <div class="dropdown-content" v-if="userMenuOpen">
                <router-link to="/profile" @click="closeMenus"
                  >Mi Perfil</router-link
                >
                <router-link to="/settings" @click="closeMenus"
                  >Configuración</router-link
                >
                <button @click="logout">Cerrar Sesión</button>
              </div>
            </div>
          </template>
          <template v-else>
            <router-link to="/login" class="auth-btn login"
              >Ingresar</router-link
            >
            <router-link to="/register" class="auth-btn register"
              >Registrarse</router-link
            >
          </template>
        </div>
      </div>

      <button class="menu-toggle" @click="toggleMenu">
        <span v-if="!menuOpen">☰</span>
        <span v-else>✕</span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const menuOpen = ref(false);
const userMenuOpen = ref(false);

// Estado simple de usuario
const userLoggedIn = computed(() => !!localStorage.getItem("token"));
const userName = computed(() => localStorage.getItem("userName") || "Usuario");

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
  if (menuOpen.value) userMenuOpen.value = false;
};

const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value;
};

const closeMenus = () => {
  menuOpen.value = false;
  userMenuOpen.value = false;
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userName");
  closeMenus();
  router.push("/login");
};

// Cerrar menús al hacer clic fuera
const handleClickOutside = (event) => {
  if (!event.target.closest(".menu") && !event.target.closest(".menu-toggle")) {
    menuOpen.value = false;
  }
  if (!event.target.closest(".user-dropdown")) {
    userMenuOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.navbar {
  background-color: #2c3e50;
  color: white;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.brand {
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
}

.logo-icon {
  margin-right: 0.5rem;
  font-size: 1.8rem;
}

.menu {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-main {
  display: flex;
  gap: 1rem;
}

.nav-main a {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.2s;
}

.nav-main a:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-main a.router-link-exact-active {
  background-color: #3498db;
  color: white;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.auth-btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
}

.login {
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.login:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.register {
  background-color: #3498db;
  color: white;
}

.register:hover {
  background-color: #2980b9;
}

.user-dropdown {
  position: relative;
}

.user-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 4px;
}

.user-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.user-avatar {
  font-size: 1.2rem;
}

.dropdown-content {
  position: absolute;
  right: 0;
  top: 100%;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  min-width: 160px;
  z-index: 1;
  margin-top: 0.5rem;
  overflow: hidden;
}

.dropdown-content a,
.dropdown-content button {
  display: block;
  width: 100%;
  padding: 0.8rem 1rem;
  text-align: left;
  color: #333;
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
}

.dropdown-content a:hover,
.dropdown-content button:hover {
  background-color: #f5f5f5;
}

.menu-toggle {
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
}

@media (max-width: 768px) {
  .menu {
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    background-color: #2c3e50;
    flex-direction: column;
    align-items: stretch;
    padding: 1rem;
    gap: 0;
    transform: translateY(-100%);
    opacity: 0;
    pointer-events: none;
    transition: all 0.3s ease;
  }

  .menu.open {
    transform: translateY(0);
    opacity: 1;
    pointer-events: all;
  }

  .nav-main {
    flex-direction: column;
    gap: 0;
    margin-bottom: 1rem;
  }

  .nav-main a {
    padding: 1rem;
    border-radius: 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .user-actions {
    flex-direction: column;
    gap: 0;
  }

  .auth-btn {
    display: block;
    width: 100%;
    text-align: center;
    padding: 1rem;
    border-radius: 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .user-dropdown {
    width: 100%;
  }

  .user-btn {
    width: 100%;
    justify-content: center;
    padding: 1rem;
    border-radius: 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .dropdown-content {
    position: static;
    width: 100%;
    border-radius: 0;
    box-shadow: none;
  }

  .menu-toggle {
    display: block;
  }
}
</style>
