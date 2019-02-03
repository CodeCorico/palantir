<template>
  <div class="app-google-calendar" :class="[`orientation-${config.orientation || 'left'}`]">
    <div v-if="!signed" class="unsigned">
      <button class="link" @click="signin">Signin to Google Calendar</button>
    </div>

    <div v-if="signed" class="status-bar"></div>

    <div v-if="signed" class="signed">
      <div
        v-for="event in events"
        :key="event.id"
        class="event"
        :class="{
          past: event.pTime.fullMinutes + event.pTime.durationMinutes <= actualMinutes,
          remind: isRemind(event),
          active: isActive(event),
        }"
      >
        <div class="attendees">
          <div v-for="attendee in filterAttendees(event)" :key="attendee.email" class="attendee">
            <img :src="config.users[attendee.email]" />
          </div>
        </div>

        <div class="status" :class="statusCls(event)"></div>

        <div class="hours">
          {{ event.pStart.hours }}h {{ event.pStart.minutes === '00' ? '' : event.pStart.minutes }}
        </div>

        <div class="summary">
          {{ event.summary }}

          <div class="location">{{ event.location }}</div>
        </div>

        <div class="time-left" v-if="isRemind(event) || isActive(event)">
          <span>{{ timeLeft(event) }}</span>
        </div>
      </div>

      <!--div class="signout">
        <button class="link" @click="signout">Signout</button>
      </div-->
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import store from '@/services/store';

export default {
  name: 'app-google-calendar',
  store,
  props: {
    config: Object,
  },
  mounted() {
    this.dateTimeClock();
  },
  destroyed() {
    clearTimeout(this.dateTimeTimeout);

    this.$store.dispatch('GoogleCalendar/clear');
  },
  data() {
    return {
      actualMinutes: 0,
      dateTimeTimeout: null,
    };
  },
  computed: {
    ...mapState('GoogleCalendar', ['signed', 'events']),
    emails() {
      return Object.keys(this.config.users);
    },
  },
  methods: {
    signin() {
      this.$store.dispatch('GoogleCalendar/signin');
    },
    signout() {
      this.$store.dispatch('GoogleCalendar/signout');
    },
    statusCls(event) {
      let invited = 0;
      let accepted = 0;

      if (!event.attendees) {
        return 'accepted';
      }

      event.attendees.forEach(attendee => {
        if (this.emails.indexOf(attendee.email) < 0 || attendee.organizer) {
          return;
        }

        invited++;

        if (attendee.responseStatus === 'accepted') {
          accepted++;
        }
      });

      return invited === accepted ? 'accepted' : (accepted > 0 ? 'some' : 'unaccepted');
    },
    isRemind(event) {
      if (!this.config.reminder) {
        return false;
      }

      return this.actualMinutes >= event.pTime.fullMinutes - this.config.reminder
        && this.actualMinutes < event.pTime.fullMinutes;
    },
    isActive(event) {
      return this.actualMinutes >= event.pTime.fullMinutes
        && this.actualMinutes < event.pTime.fullMinutes + event.pTime.durationMinutes;
    },
    filterAttendees(event) {
      let filtered = [];

      if (event.attendees) {
        filtered = event.attendees.filter((attendee) => this.emails.indexOf(attendee.email) > -1);
      }

      if (!filtered.length) {
        return this.emails.indexOf(event.calendarId) > -1 ? [{ email: event.calendarId }] : [];
      }

      return filtered.slice(0, 4);
    },
    timeLeft(event) {
      const { pTime } = event;
      const minutesLeft = pTime.fullMinutes > this.actualMinutes
        ? -(pTime.fullMinutes - this.actualMinutes)
        : pTime.fullMinutes + pTime.durationMinutes - this.actualMinutes;
      let hours = minutesLeft < 60 ? '' : Math.floor(minutesLeft / 60);
      hours = hours ? `${hours}h` : '';
      let minutes = minutesLeft % 60;
      minutes = minutes ? `${minutes}m` : '';
      minutes = hours && minutes ? ` ${minutes}` : minutes;

      return `${hours}${minutes}`;
    },
    dateTimeClock() {
      clearTimeout(this.dateTimeTimeout);

      const date = new Date();
      this.$set(this, 'actualMinutes', (date.getHours() * 60) + date.getMinutes());

      if (this.config.sounds && this.config.sounds.reminder && this.config.reminder) {
        let notif = false;
        for (let i = 0; i < this.events.length; i++) {
          if (this.events[i].pTime.fullMinutes - this.config.reminder === this.actualMinutes) {
            notif = true;

            break;
          }
        }

        if (notif) {
          const audio = new Audio(this.config.sounds.reminder);
          audio.loop = false;
          // eslint-disable-next-line no-console
          audio.play().catch(() => console.warn(
            `Impossible to play "${this.config.sounds.reminder}"`,
            `(maybe the user didn't interact with the page)`
          ));
        }
      }

      this.dateTimeTimeout = setTimeout(() => this.dateTimeClock(), 60 * 1000); // 1min
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/ui/assets/variables.scss';

.app-google-calendar {
  position: relative;
  box-sizing: border-box;
  height: 100%;

  .unsigned {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
  }

  .signed {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
  }

  .status-bar {
    z-index: -1;
    position: absolute;
    top: 0;
    left: 124px;
    bottom: 0;
    width: 1px;
    border-radius: 5px;
    background: #fff;
    box-shadow: 0 0 7px 5px rgba(255, 255, 255, 0.2);
    opacity: 0.3;
  }

  .signout {
    margin-top: 10px;
    opacity: 0.5;
  }

  .event {
    position: relative;
    margin: 20px 10px 0;
    padding: 0 15px;
    transition: all 0.4s $easeOutQuart;
  }

  .summary {
    box-sizing: border-box;
    width: 100%;
    padding-left: 209px;
    font-size: 16px;
  }

  .location {
    display: none;
    margin-top: 5px;
    font-weight: 400;
    font-size: 14px;
    opacity: 0.7;
  }

  .status {
    position: absolute;
    top: -5px;
    bottom: -5px;
    left: 112px;
    width: 5px;
    border-radius: 5px;

    &.accepted {
      background: #61aaeb;
      box-shadow: 0 0 7px 5px rgba(97, 170, 235, 0.2);
    }

    &.some {
      background: #fbe03e;
      box-shadow: 0 0 7px 5px rgba(251, 224, 62, 0.2);
    }

    &.unaccepted {
      background: #e35856;
      box-shadow: 0 0 7px 5px rgba(227, 88, 86, 0.2);
    }
  }

  .hours {
    position: absolute;
    top: 0;
    left: 132px;
    width: 72px;
    text-align: left;
    font-size: 20px;
    font-weight: 600;
  }

  .attendees {
    position: absolute;
    top: 0;
    left: 0;
    width: 90px;
    text-align: right;

    .attendee {
      display: inline-block;
      position: relative;
      margin-left: -10px;
      width: 18px;
      height: 18px;
      transform: rotate(-45deg);
      border: 3px solid #000;
      overflow: hidden;

      img {
        position: absolute;
        transform: rotate(45deg);
        top: -5px;
        left: -6px;
        width: 29px;
        height: 29px;
      }
    }
  }

  .time-left {
    position: absolute;
    top: 6px;
    right: 0;
    width: 55px;
    height: 55px;
    border: 3px solid #000;
    background: #278282;
    overflow: hidden;
    transform: rotate(-45deg);

    span {
      display: block;
      position: absolute;
      top: 18px;
      left: -16px;
      width: 89px;
      transform: rotate(45deg);
      text-align: center;
      font-weight: 600;
    }
  }

  &.orientation-right {
    .signed {
      left: auto;
      right: 0;
    }

    .status-bar {
      left: auto;
      right: 124px;
    }

    .signout {
      text-align: right;
    }

    .summary {
      text-align: right;
      padding-left: 0;
      padding-right: 209px;
    }

    .hours {
      left: auto;
      right: 132px;
    }

    .status {
      left: auto;
      right: 112px;
    }

    .attendees {
      left: auto;
      right: 0;
      text-align: left;

      .attendee {
        margin: 0 -10px 0 0;
      }
    }

    .time-left {
      right: auto;
      left: 0;
    }

    .event.active, .event.remind {
      .summary {
        padding-right: 209px;
        padding-left: 60px;
      }
    }
  }

  .event.past {
    margin-top: 15px;

    .summary, .hours, .attendees, .status {
      font-size: 13px;
      opacity: 0.3;
      font-weight: 400;
    }
  }

  .event.active, .event.remind {
    margin-top: 30px;
    margin-bottom: 30px;
    padding: 15px;
    background: #1a292f;
    box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.2);

    .hours, .attendees {
      top: 10px;
    }

    .location {
      display: block;
    }

    .summary {
      padding-right: 60px;
    }
  }

  .event.remind {
    .time-left {
      background: #827127;
    }
  }
}
</style>
