// src/stores/carStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCarStore = defineStore('carStore', () => {
  // تخزين السجلات، يمكن ربطه بـ LocalStorage للحفظ الدائم
  const records = ref([]);

  function addRecord(record) {
    records.value.push({
      id: Date.now(), // Unique ID
      ...record
    });
  }
  // دالة الحذف (هذه هي التي كانت ناقصة وتسبب الخطأ)
  function removeRecord(id) {
    records.value = records.value.filter(r => r.id !== id);
  }

  function clearRecords() {
    records.value = [];
  }

  return { records, addRecord, clearRecords,removeRecord };
});