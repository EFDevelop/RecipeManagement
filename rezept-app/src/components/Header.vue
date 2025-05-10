<template>
    <header>
      <nav>
        <ul>
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/recipes">Rezepte</router-link></li>
        <li><router-link to="/profile">Profil</router-link></li>
      </ul>
      </nav>
    </header>
  </template>
  
  <style scoped lang="scss">
  nav {
    display: flex;
    gap: 1rem;
  }
  </style>