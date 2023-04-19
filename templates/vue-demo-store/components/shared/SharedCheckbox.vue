<script setup lang="ts">
  const props = defineProps<{
    modelValue?: boolean;
    content?: string;
  }>()

  const emit = defineEmits(['update:modelValue'])

  const updateValue = (event: any) => {
    emit('update:modelValue', event.target.checked)
  }
</script>
<template>
  <div class="flex space-x-2 items-center">
    <input
      type="checkbox"
      class="appearance-none h-4 w-4 border border-gray-300 text-gray-900 shrink-0"
      :checked="props.modelValue"
      @change="updateValue"
    />
    <label v-if="props.content" class="font-medium text-sm text-gray-700">{{ props.content }}</label>
  </div>
</template>