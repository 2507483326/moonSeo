<script setup>
import http from "@/http";
import {onMounted, onServerPrefetch, ref} from "vue";
const book = ref(null)
async function fetchBook () {
  const res = await http.get('https://fakerapi.it/api/v1/books', {
    params: {
      _quantity: 1
    }
  })
  book.value = res.data[0]
  console.log(res)
}
onMounted(() => {
  fetchBook()
})
onServerPrefetch(async () => {
  await fetchBook()
})
</script>

<template>
  <div class="about">
    <h1>测试水合</h1>
    <div>
      <div>书籍名称: {{book?.title}}</div>
      <div>书籍作者: {{book?.author}}</div>
    </div>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
}
</style>
