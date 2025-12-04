<template>
  <button
      @click="onClick"
      class="card"
      :class="[
      active
        ?  'active'
        : '',
      size === 'sm' ? 'px-3 py-2 text-sm' : 'px-4 py-3'
    ]"
  >
    <div
        :class="[
        size === 'sm' ? 'text-lg' : 'text-2xl',
        active ? `ico-active` : 'ico'
      ]"
    >
      <slot name="icon" />
      <span class="title">{{title}}</span>
    </div>
  </button>
</template>

<style scoped lang="scss">
  .card {
    display: flex;
    align-items: center;
    width: 100%;
    height: 50px;
    background: $bg-color-secondary;
    border-radius: 10px;
    border: none;
    box-shadow: $box-shadow;

    transition: box-shadow 0.3s ease, transform 0.3s ease, color 0.3s ease;

    & div{
      display: flex;
      align-items: center;
      margin-left: 10px;

      & span{
        margin-left: 10px;
      }
    }
    &.active{
      color: $accent-color;
      cursor: pointer;
      box-shadow: $box-shadow-accent;
      border: 1px $accent-color solid;
    }
  }
  .card:hover {
    color: $accent-color;
    cursor: pointer;
    transform: scale(1.03);
    box-shadow: $box-shadow-accent;
    border: 1px $accent-color solid;
  }
</style>

<script setup lang="ts">
interface Props {
  title: string
  active?: boolean
  size?: "sm" | "md"
}

const { title, active = false, size = 'md' } = defineProps<Props>()

const emit = defineEmits(["click"])

function onClick() {
  emit("click")
}
</script>
