<template>
  <nav>
    <router-link to="/">Inicio</router-link> |
    <router-link to="/login">Login</router-link> |
    <router-link to="/register">Registro</router-link> |
    <router-link to="/dashboard">Dashboard</router-link>
  </nav>
</template>

<style scoped>
nav {
  padding: 1em;
  background-color: #333;
  color: white;
}
a {
  color: white;
  text-decoration: none;
  margin: 0 10px;
}
a.router-link-exact-active {
  font-weight: bold;
  text-decoration: underline;
}
</style>
