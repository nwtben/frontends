<script setup lang="ts">
  const props = defineProps<{
    modelValue?: boolean;
    content?: string;
    id?: string;
  }>()

  const emit = defineEmits(['update:modelValue'])

  const updateValue = (event: any) => {
    emit('update:modelValue', event.target.checked)
  }

  const defaultId = ref(Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10));
</script>
<template>
  <div class="flex items-center">
    <input
      :id="props.id || defaultId"
      type="checkbox"
      class="bg-white cursor-pointer appearance-none h-4 w-4 border border-gray-300 text-gray-900 shrink-0"
      :checked="props.modelValue"
      @change="updateValue"
    />
    <label :for="props.id || defaultId" v-if="props.content" class="pl-2 pr-4 cursor-pointer font-medium text-sm text-gray-700" v-html="props.content"></label>
  </div>
</template>