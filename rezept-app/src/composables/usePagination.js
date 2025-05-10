import { ref, computed } from 'vue'

/**
 * usePagination: Paginierung eines Arrays
 * @param {Array} items - zu paginierende Liste
 * @param {number} pageSize - Anzahl Elemente pro Seite
 * @returns {Object} {
 *   currentPage,
 *   pageCount,
 *   paginatedItems,
 *   nextPage,
 *   prevPage,
 *   goToPage
 * }
 */
export function usePagination(items, pageSize = 10) {
  const currentPage = ref(1)

  const pageCount = computed(() => {
    return Math.ceil(items.value.length / pageSize)
  })

  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    return items.value.slice(start, start + pageSize)
  })

  function nextPage() {
    if (currentPage.value < pageCount.value) {
      currentPage.value += 1
    }
  }

  function prevPage() {
    if (currentPage.value > 1) {
      currentPage.value -= 1
    }
  }

  function goToPage(page) {
    if (page >= 1 && page <= pageCount.value) {
      currentPage.value = page
    }
  }

  return {
    currentPage,
    pageCount,
    paginatedItems,
    nextPage,
    prevPage,
    goToPage
  }
}
