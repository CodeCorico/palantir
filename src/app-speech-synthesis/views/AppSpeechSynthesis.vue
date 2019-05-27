<template>
  <section class="app-speech-synthesis">
    <div class="speech" v-show="!paused">
      <div class="text">
        <span class="emitter">{{ emitter }} dit</span> 
        <span class="content">{{ text }}</span>
        <span class="error" v-if="error">{{ error }}</span>
      </div>
      <audio
        autoplay
        v-if="speech"
        :src="speech"
        ref="speech"
        @playing="updatePaused"
        @pause="updatePaused"
      >
        Your browser does not support the
        <code>audio</code> element.
      </audio>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import store from '@/services/store';

export default {
  name: 'app-speech-synthesis',
  store,
  data() {
    return {
      paused: true,
    };
  },
  computed: {
    ...mapState('SpeechSynthesis', ['id', 'text', 'emitter', 'error']),
    ...mapState('SpeechSynthesis', {
      speech: state => {
        return state.speech && `data:audio/mpeg;base64,${btoa(
          String.fromCharCode(...new Uint8Array(state.speech)))}`;
      },
    }),
  },
  methods: {
    updatePaused(event) {
      const paused = event.target.paused;
      paused ?
        setTimeout(() => this.paused = paused, 2000):
        this.paused = paused;
    }
  },
};
</script>

<style lang="scss" scoped>
@import '@/ui/assets/variables.scss';

.app-speech-synthesis {
  .speech {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10000;
    background: rgba($colorBg, 0.9);
    padding: 2rem;

    .text {
      font-size: 55px;
      font-weight: 700;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;

      .emitter {
        font-size: 50%;
        opacity: 0.8;
      }
    }
  }
}
</style>
