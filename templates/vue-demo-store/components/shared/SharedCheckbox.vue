<script setup lang="ts">
  const props = defineProps({
    modelValue: Boolean
  })

  const emit = defineEmits(['update:modelValue'])

  const updateValue = (event: any) => {
    emit('update:modelValue', event.target.checked)
  }
</script>
<template>
  <input 
    type="checkbox"
    class="appearance-none h-4 w-4 border border-gray-300 text-gray-900"
    :checked="props.modelValue"
    @change="updateValue"
  />
</template>