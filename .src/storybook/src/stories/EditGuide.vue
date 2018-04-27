<template>
  <div class="main">
    <p>
      Link example
      <a class="link" @click="goToButton">LINK</a>
    </p>
    <p>색션은 <code class="code">p</code>태그 글씨를 쓸때 태그를 쓰며 노트는 아래 처럼</p>
    <p class="note">
      <b>노트:</b>
      <br />
      이것도
      <code class="code">code</code>
      를 이용함
    </p>
    <p>
      <a @click="clickEventAction">클릭이벤트</a>
    </p>
  </div>
</template>

<script>
  export default {
    props: {
      goToButton: {
        default: () => () => null
      },
      clickLink: {
        default: () => () => null
      }
    },
    methods:{
      clickEventAction(e){
        this.$emit("clickLinkExample",e);
      }
    }
  }
</script>

<style>
  .main {
    margin: 15px;
    max-width: 600;
    line-height: 1.4;
    font-family: "Helvetica Neue", Helvetica, "Segoe UI", Arial, freesans, sans-serif;
  }

  .logo {
    width: 200;
  }

  .link {
    color: #1474f3;
    text-decoration: none;
    border-bottom: 1px solid #1474f3;
    padding-bottom: 2px;
  }

  .code {
    font-size: 15;
    font-weight: 600;
    padding: 2px 5px;
    border: 1px solid #eae9e9;
    border-radius: 4px;
    background-color: #f3f2f2;
    color: #3a3a3a;
  }

  .codeBlock {
    background-color: #f3f2f2;
    padding: 1px 10px;
    margin: 10px 0;
  }

  .note {
    opacity: 0.5;
  }
</style>
