<template>
  <div class="dashboard-page">

    <div class="dashboard-background" :style="{ 'background-image': `url(${todayPicture})` }">

    </div>

    <div class="pr"></div>

  </div>
</template>

<script>
import axios from 'axios';

const BING_URL = 'https://bing.com';
const BING_SERVICE = 'https://cors.io?https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=en-US';

export default {
  name: 'dashboard-page',
  data() {
    return {
      todayPicture: '',
    };
  },
  async mounted() {
    try {
      const bingData = await axios.get(BING_SERVICE);
      this.$set(this, 'todayPicture', `${BING_URL}${bingData.data.images[0].url}`);
    } catch (err) { }
  }
};
</script>

<style lang="scss" scoped>
.dashboard-page {
  position: relative;
  height: 100%;

  .dashboard-background {
    position: absolute;
    top: 120px;
    left: 30px;
    right: 300px;
    height: 400px;
    background: black;
    border-radius: 10px;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    box-shadow: 0 31px 81px rgba(0, 0, 0, 0.4);
  }

  .pr {
    position: absolute;
    top: 380px;
    left: 100px;
    width: 200px;
    height: 200px;
    background: linear-gradient(45deg, #4aafe3 0%, #78c6ed 100%);
    box-shadow: 0 31px 81px rgba(0, 0, 0, 0.4);
    border-radius: 10px;
  }
}
</style>
