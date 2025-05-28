<template>
  <div class="welcome-container">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="title animate__animated animate__fadeInDown">
          ¡Bienvenido a <span class="highlight">TaskMaster Pro</span>!
        </h1>
        <p class="subtitle animate__animated animate__fadeIn animate__delay-1s">
          La herramienta definitiva para organizar tu vida y aumentar tu
          productividad
        </p>

        <div
          class="cta-buttons animate__animated animate__fadeInUp animate__delay-2s"
        >
          <router-link to="/register" class="btn primary">
            <i class="fas fa-user-plus"></i> Regístrate Gratis
          </router-link>
          <router-link to="/login" class="btn secondary">
            <i class="fas fa-sign-in-alt"></i> Iniciar Sesión
          </router-link>
        </div>

        <div class="stats animate__animated animate__fadeIn animate__delay-3s">
          <div class="stat-item">
            <span class="stat-number">+10K</span>
            <span class="stat-label">Usuarios</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">+500K</span>
            <span class="stat-label">Tareas</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">99%</span>
            <span class="stat-label">Satisfacción</span>
          </div>
        </div>
      </div>

      <div
        class="hero-image animate__animated animate__fadeInRight animate__delay-1s"
      >
        <img
          src="https://flowhcm.com/ar/wp-content/uploads/2022/12/MicrosoftTeams-image-22-1.png"
          alt="Interfaz de TaskMaster Pro"
          loading="lazy"
        />
        <div
          class="image-badge animate__animated animate__pulse animate__infinite"
        >
          <i class="fas fa-trophy"></i> Premio a la Mejor App 2025
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="features-section">
      <h2 class="section-title">Potencia tu productividad</h2>
      <p class="section-subtitle">
        Descubre todo lo que TaskMaster Pro puede hacer por ti
      </p>

      <div class="features-grid">
        <div
          class="feature-card"
          v-for="(feature, index) in features"
          :key="index"
        >
          <div class="feature-icon" :class="`color-${index % 4}`">
            <i :class="feature.icon"></i>
          </div>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
        </div>
      </div>
    </div>

    <!-- Testimonials -->
    <div class="testimonials-section">
      <h2 class="section-title">Lo que dicen nuestros usuarios</h2>
      <div class="testimonials-slider">
        <div class="testimonial-card">
          <div class="testimonial-content">
            <p>
              "TaskMaster Pro ha cambiado completamente mi forma de trabajar.
              Ahora soy un 40% más productivo."
            </p>
          </div>
          <div class="testimonial-author">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="Carlos Rodríguez"
              class="author-avatar"
            />
            <div>
              <h4>Carlos Rodríguez</h4>
              <span>CEO en TechSolutions</span>
            </div>
          </div>
        </div>
        <div class="testimonial-card">
          <div class="testimonial-content">
            <p>
              "La mejor app de gestión de tareas que he usado. La interfaz es
              increíblemente intuitiva."
            </p>
          </div>
          <div class="testimonial-author">
            <img
              src="https://randomuser.me/api/portraits/women/44.jpg"
              alt="María González"
              class="author-avatar"
            />
            <div>
              <h4>María González</h4>
              <span>Diseñadora UX</span>
            </div>
          </div>
        </div>
        <div class="testimonial-card">
          <div class="testimonial-content">
            <p>
              "Desde que uso TaskMaster Pro, nunca más he olvidado una tarea
              importante. ¡Totalmente recomendada!"
            </p>
          </div>
          <div class="testimonial-author">
            <img
              src="https://randomuser.me/api/portraits/men/75.jpg"
              alt="Javier López"
              class="author-avatar"
            />
            <div>
              <h4>Javier López</h4>
              <span>Estudiante</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Final CTA -->
    <div class="final-cta animate__animated animate__fadeIn">
      <h2>¿Listo para transformar tu productividad?</h2>
      <p>Empieza hoy mismo y organiza tu vida como nunca antes</p>
      <router-link to="/register" class="btn primary large">
        Comenzar Ahora - ¡Es Gratis!
      </router-link>
    </div>
  </div>
</template>

<script setup>
const features = [
  {
    icon: "fas fa-tasks",
    title: "Gestión Intuitiva",
    description:
      "Interfaz limpia y fácil de usar para organizar tus tareas diarias",
  },
  {
    icon: "fas fa-bell",
    title: "Recordatorios",
    description: "Notificaciones para que nunca olvides una tarea importante",
  },
  {
    icon: "fas fa-sync-alt",
    title: "Sincronización",
    description: "Accede a tus tareas desde cualquier dispositivo",
  },
  {
    icon: "fas fa-chart-line",
    title: "Estadísticas",
    description: "Visualiza tu progreso con gráficos detallados",
  },
  {
    icon: "fas fa-users",
    title: "Colaboración",
    description: "Trabaja en equipo compartiendo proyectos y tareas",
  },
  {
    icon: "fas fa-lock",
    title: "Seguridad",
    description: "Tus datos protegidos con encriptación de última generación",
  },
];
</script>

<style scoped>
/* Estilos permanecen igual que en la versión anterior */
.welcome-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.hero-section {
  display: flex;
  min-height: 80vh;
  align-items: center;
  justify-content: space-between;
  gap: 3rem;
  padding: 4rem 0;
}

.hero-content {
  flex: 1;
  max-width: 600px;
}

.title {
  font-size: 3rem;
  color: var(--dark);
  margin-bottom: 1.5rem;
  font-weight: 800;
  line-height: 1.2;
}

.title .highlight {
  color: var(--primary);
  position: relative;
}

.title .highlight::after {
  content: "";
  position: absolute;
  bottom: 5px;
  left: 0;
  width: 100%;
  height: 10px;
  background-color: rgba(67, 97, 238, 0.2);
  z-index: -1;
  border-radius: 20px;
}

.subtitle {
  font-size: 1.4rem;
  color: #4a5568;
  margin-bottom: 2.5rem;
  line-height: 1.6;
}

.cta-buttons {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.btn {
  padding: 0.9rem 2rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn i {
  font-size: 0.9rem;
}

.primary {
  background-color: var(--primary);
  color: rgb(7, 7, 7);
  box-shadow: 0 4px 14px rgba(64, 67, 78, 0.4);
}

.primary:hover {
  background-color: var(--secondary);
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(67, 97, 238, 0.5);
}

.secondary {
  background-color: transparent;
  color: var(--primary);
  border: 2px solid var(--primary);
}

.secondary:hover {
  background-color: rgba(67, 97, 238, 0.1);
}

.stats {
  display: flex;
  gap: 2.5rem;
  margin-top: 3rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary);
  line-height: 1;
}

.stat-label {
  font-size: 0.9rem;
  color: #718096;
  font-weight: 500;
}

.hero-image {
  flex: 1;
  position: relative;
  max-width: 600px;
}

.hero-image img {
  width: 100%;
  border-radius: 15px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.image-badge {
  position: absolute;
  top: -15px;
  right: -15px;
  background: white;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-weight: 600;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--dark);
}

.image-badge i {
  color: gold;
}

/* Features Section */
.features-section {
  padding: 6rem 0;
  text-align: center;
}

.section-title {
  font-size: 2.5rem;
  color: var(--dark);
  margin-bottom: 1rem;
  font-weight: 700;
}

.section-subtitle {
  font-size: 1.2rem;
  color: #718096;
  max-width: 700px;
  margin: 0 auto 3rem;
  line-height: 1.6;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-align: left;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.feature-icon.color-0 {
  background-color: rgba(67, 97, 238, 0.1);
  color: var(--primary);
}

.feature-icon.color-1 {
  background-color: rgba(76, 201, 240, 0.1);
  color: var(--success);
}

.feature-icon.color-2 {
  background-color: rgba(247, 37, 133, 0.1);
  color: var(--warning);
}

.feature-icon.color-3 {
  background-color: rgba(114, 9, 183, 0.1);
  color: var(--danger);
}

.feature-card h3 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: var(--dark);
}

.feature-card p {
  color: #718096;
  line-height: 1.6;
}

/* Testimonials */
.testimonials-section {
  padding: 6rem 0;
  background-color: #f8fafc;
}

.testimonials-slider {
  display: flex;
  gap: 2rem;
  overflow-x: auto;
  padding: 2rem 0;
  scroll-snap-type: x mandatory;
}

.testimonial-card {
  min-width: 350px;
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  scroll-snap-align: start;
}

.testimonial-content {
  margin-bottom: 1.5rem;
  font-style: italic;
  color: #4a5568;
  line-height: 1.6;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.author-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.testimonial-author h4 {
  margin: 0;
  color: var(--dark);
}

.testimonial-author span {
  font-size: 0.9rem;
  color: #718096;
}

/* Final CTA */
.final-cta {
  text-align: center;
  padding: 6rem 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #e2e8f0 100%);
  border-radius: 15px;
  margin: 4rem 0;
}

.final-cta h2 {
  font-size: 2.2rem;
  color: var(--dark);
  margin-bottom: 1rem;
}

.final-cta p {
  font-size: 1.2rem;
  color: #4a5568;
  max-width: 600px;
  margin: 0 auto 2rem;
}

.btn.large {
  padding: 1.2rem 3rem;
  font-size: 1.2rem;
}

/* Responsive */
@media (max-width: 1024px) {
  .hero-section {
    flex-direction: column;
    text-align: center;
    padding: 3rem 0;
  }

  .hero-content {
    max-width: 100%;
  }

  .cta-buttons {
    justify-content: center;
  }

  .stats {
    justify-content: center;
  }

  .hero-image {
    margin-top: 3rem;
  }

  .title {
    font-size: 2.5rem;
  }
}

@media (max-width: 768px) {
  .title {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1.2rem;
  }

  .cta-buttons {
    flex-direction: column;
    gap: 1rem;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }

  .stats {
    flex-wrap: wrap;
    gap: 1.5rem;
  }

  .section-title {
    font-size: 2rem;
  }
}

/* Animations */
@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.hero-image img {
  animation: float 6s ease-in-out infinite;
}
</style>
