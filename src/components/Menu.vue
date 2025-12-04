<template>
  <nav class="header">
    <a
        v-for="item in sections"
        :key="item.id"
        :href="'#' + item.id"
        :class="{ active: active === item.id }"
    >
      {{ item.label }}
    </a>
    <button class="resume-btn" @click="downloadResume">Скачать резюме</button>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const sections = [
  { id: "about", label: "Обо мне" },
  { id: "skills", label: "Навыки" },
  { id: "projects", label: "Проекты" },
  { id: "contacts", label: "Контакты" },
];

const active = ref("about");


onMounted(() => {
  const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            active.value = entry.target.id;
          }
        });
      },
      { threshold: 0.6 } // 60% секции в экране → считается активной
  );

  sections.forEach((s) => {
    const el = document.getElementById(s.id);
    if (el) observer.observe(el);
  });
});
// Метод для скачивания резюме
function downloadResume() {
  // Простой вариант: скачивание файла из public
  const link = document.createElement('a')
  link.href = '/resume.pdf'  // положи resume.pdf в public/
  link.download = 'MuhammadAli_Resume.pdf'
  link.click()
}


</script>

<style scoped lang="scss">
.header {
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 20px;
  padding: 20px;
  top: 1rem;
  width: calc(100vw - 80px);
  left: 20px;
  max-width: 900px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
  border-radius: 15px;

  @include bg-blur;

  @media (min-width: 950px) {
    left: calc((100vw - 900px) / 2 );
  }
}
.header a {
  text-decoration: none;
  color: #555;
  font-weight: 500;
  font-size: $font-plus;

  @media (max-width: 400px) {
    font-size: $font-normal;
  }
}
.header a.active {
  color: $accent-color;
  border-bottom: 2px solid $accent-color;
}
.resume-btn {
  margin-left: 10%;
  color: white;
  background: $bg-color-primary;
  border: 1px solid $accent-color-secondary;
  border-radius: 7px;
  font-size: $font-plus;
  transition: background 0.2s ease-in-out;

  @media (max-width: 768px) {
    display: none;
  }
}

.resume-btn:hover {
  background: $accent-color;
  cursor: pointer;
}
</style>