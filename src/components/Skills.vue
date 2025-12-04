
<template>
  <section id="skills" class="skills">
    <div class="header">
      <p class="title">
        Навыки
      </p>
      <div class="filter">
        <button
            v-for="(value, key) in activeFilters"
            :key="key"
            :class="['el',{ active: value }]"
            @click="toggleFilter(key)"
        >
          {{ key }}
        </button>
      </div>
    </div>
    <div class="cards">
      <SkillCard
          v-for="skill in skills"
          :key="skill.title"
          :title="skill.title"
          :active="skill.categories.some(cat => activeFilters[cat])"
      >
        <template #icon>
          <Icon :icon="skill.icon" width="24" height="24" />
        </template>
      </SkillCard>
    </div>

  </section>
</template>

<script setup lang="ts">
import {reactive} from "vue";
  import SkillCard from "./SkillCard.vue";
  import { Icon } from '@iconify/vue'

  const activeFilters = reactive({
    Frontend: false,
    Backend: false,
    Langs: false,
    Tools: false
  })

  function toggleFilter(filter: keyof typeof activeFilters) {
    activeFilters[filter] = !activeFilters[filter]
  }

  interface Skill {
    title: string
    icon: string
    categories: Array<keyof typeof activeFilters>
  }

  const skills: Skill[] = [
    { title: 'HTML', icon: 'flowbite:html-solid', categories: ['Frontend', 'Langs'] },
    { title: 'CSS/SCSS', icon: 'flowbite:css-solid', categories: ['Frontend'] },
    { title: 'JavaScript', icon: 'ri:javascript-fill', categories: ['Frontend', 'Langs'] },
    { title: 'TypeScript', icon: 'bi:typescript', categories: ['Frontend', 'Langs'] },
    { title: 'Python', icon: 'akar-icons:python-fill', categories: ['Backend', 'Langs'] },
    { title: 'Java', icon: 'grommet-icons:java', categories: ['Backend', 'Langs'] },
    { title: 'C/C++', icon: 'tabler:brand-cpp', categories: ['Langs'] },
    { title: 'C#', icon: 'devicon-plain:csharp', categories: ['Langs'] },
    { title: 'React', icon: 'mdi:react', categories: ['Frontend', 'Tools'] },
    { title: 'Vue', icon: 'uim:vuejs', categories: ['Frontend', 'Tools'] },
    { title: 'Django', icon: 'akar-icons:django-fill', categories: ['Backend', 'Tools'] },
    { title: 'REST API', icon: 'dashicons:rest-api', categories: ['Backend', 'Tools'] },
    { title: 'Git/GitHub', icon: 'line-md:github-loop', categories: ['Tools'] },
    { title: 'Postman', icon: 'simple-icons:postman', categories: ['Backend', 'Tools'] },
    { title: 'SQL', icon: 'akar-icons:postgresql-fill', categories: ['Backend', 'Langs'] },
  ]
/*
  const filteredSkills = computed(() => {
    return skills.filter(skill => {
      return skill.categories.some(cat => activeFilters[cat])
    })
  })
*/


</script>

<style scoped lang="scss">
  .skills {
    width: 100%;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    width: 100%;

    & .title {
      font-size: $font-plus;
      color: $accent-color;
      font-weight: bold;
      text-shadow: 0 0 10px  rgba(0, 0, 0, 0.8);
    }

    & .filter {
      display: flex;
      flex-direction: row;

      & .el {
        background: $bg-color-secondary;
        margin-left: 10px;
        cursor: pointer;
        transition: transform 0.2s ease, color 0.2s ease;
        border: none;
        padding: 2px 5px;
        border-radius: 3px;
      }
      & .el:hover {
        color: $accent-color;
        transform: scale(1.02);
      }

      & .el.active {
        background: $accent-color;
        color: white;
      }
      & .el.active:hover {
        background: $accent-color-secondary;
        color: white;
      }


    }
  }
  .cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 4fr));
    gap: 1rem;
    width: 100%;
  }
</style>