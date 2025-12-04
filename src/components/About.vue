<template>
  <section id="about" class="about">
    <div class="pic">
      <img src="/pic.bmp" class="img">
      <div>
        <p class="title">Астанакулов Мухаммадали</p>
        <p class="desc">Инженер программист</p>
      </div>
    </div>
    <div class="content">

      <p class="text">Привет! Меня зовут <span class="highlight">Мухаммадали</span>. Я учусь на 3-м курсе Московского института электронной техники по направлению «Программная инженерия» и активно развиваюсь в веб-разработке. В последнее время мне особенно интересна <span class="highlight">full-stack</span> разработка — нравится видеть результат от идеи до полноценного рабочего продукта.
      </p>
      <p class="text">
        Родом из Таджикистана, и это часть меня: музыка, язык и культура вдохновляют на собственные проекты и новые идеи. В моём плейлисте можно встретить и русских, и таджикских исполнителей — Janaga, Jaman, SHAMI, C.One, Baron, Leo, AD — музыка помогает сосредоточиться и находить настроение для творчества.
      </p>
      <p class="text">
        Мне нравится обмениваться знаниями, обсуждать интересные инженерные задачи и знакомиться с людьми, которые разделяют стремление к развитию. Иногда могу уйти и в философские темы — люблю размышлять о том, как человек воспринимает мир, о балансе науки и духовности и о том, что формирует наше понимание реальности.
      </p>
      <p class="text">
        Создание чего-то полезного и красивого — именно то, что мотивирует развиваться каждый день.
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.about{
  display: flex;
  flex-direction: row;
  align-items: start;
  margin-top: 80px;
  width: 100%;
  border-bottom: #555555 1px solid;
  padding-bottom: 50px;

  @media (max-width: 900px) {
    flex-direction: column;
  }
}
.pic {
  display: flex;
  flex-direction: column;

  @media (max-width: 900px) {
    flex-direction: row;

    & div {
      display: flex;
      flex-direction: column;
      padding-left: 50px;
    }
  }

  @media (max-width: 500px) {
    & div {
      padding-left: 20px;
    }
  }
}
.img {
  width: 300px;
  border-radius: 15px;
  box-shadow: $box-shadow;

  @media (max-width: 600px) {
    width: 200px;
  }
  @media (max-width: 500px) {
    width: 150px;
  }
}
.content {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  width: 100%;
  margin-left: 100px;

  @media (max-width: 900px) {
    margin-left: 0;
  }
}
p {
  margin: 0;
}
.title {
  display: flex;
  text-align: start;
  font-size: $font-big;
  font-weight: bold;

}
.desc {
  text-align: start;
  font-size: $font-plus;
  color: $accent-color

}

.text{
  text-align: start;
  margin-top: 15px;
  font-family: $font-normal;
}
.highlight{
  color: $highlight-color;
  font-weight: bold;
}

</style>