<template>
  <div class="welcome-container">
    <div class="hero-content">
      <h1 class="title animate__animated animate__fadeInDown">
        ¡Bienvenido a TaskMaster Pro!
      </h1>
      <p class="subtitle animate__animated animate__fadeIn animate__delay-1s">
        Organiza tu vida, aumenta tu productividad
      </p>

      <div
        class="cta-buttons animate__animated animate__fadeInUp animate__delay-2s"
      >
        <router-link to="/register" class="btn primary"
          >Regístrate Gratis</router-link
        >
        <router-link to="/login" class="btn secondary"
          >Iniciar Sesión</router-link
        >
      </div>

      <div class="features animate__animated animate__fadeIn animate__delay-3s">
        <div class="feature-item">
          <i class="fas fa-tasks"></i>
          <span>Gestión intuitiva</span>
        </div>
        <div class="feature-item">
          <i class="fas fa-bell"></i>
          <span>Recordatorios</span>
        </div>
        <div class="feature-item">
          <i class="fas fa-sync-alt"></i>
          <span>Sincronización</span>
        </div>
      </div>
    </div>

    <div
      class="hero-image animate__animated animate__fadeInRight animate__delay-1s"
    >
      <img
        src="https://img.freepik.com/vector-premium/concepto-ilustracion-gestion-tareas-empresariales_701961-3283.jpg?w=1380"
        alt="Productividad"
      />
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.welcome-container {
  display: flex;
  min-height: 80vh;
  align-items: center;
  justify-content: space-between;
  padding: 2rem 5%;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.hero-content {
  flex: 1;
  max-width: 600px;
}

.title {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 1rem;
  font-weight: 700;
}

.subtitle {
  font-size: 1.2rem;
  color: #7f8c8d;
  margin-bottom: 2rem;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 3rem;
}

.btn {
  padding: 0.8rem 1.5rem;
  border-radius: 30px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.primary {
  background-color: #3498db;
  color: white;
}

.primary:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
}

.secondary {
  background-color: transparent;
  color: #3498db;
  border: 2px solid #3498db;
}

.secondary:hover {
  background-color: #3498db20;
}

.features {
  display: flex;
  gap: 2rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #34495e;
  font-weight: 500;
}

.feature-item i {
  color: #3498db;
  font-size: 1.2rem;
}

.hero-image {
  flex: 1;
  display: flex;
  justify-content: center;
}

.hero-image img {
  max-width: 100%;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .welcome-container {
    flex-direction: column;
    text-align: center;
  }

  .features,
  .cta-buttons {
    justify-content: center;
  }

  .hero-image {
    margin-top: 2rem;
  }
}
</style>
