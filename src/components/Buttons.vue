<template>
  <div id="Buttons">
    <p class="btn" v-if="data">
      <span
        v-for="(item, index) in data.button"
        :key="index"
        :class="{ active: data.active === item.value }"
        @click="change(item)"
      >
        {{ item.name }}
      </span>
    </p>
  </div>
</template>

<script>
export default {
  name: "Buttons",
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  components: {},
  data() {
    return {};
  },
  computed: {},
  watch: {},
  methods: {
    change(n) {
      this.data.active = n.value;
      this.$emit("change", {
        name: this.data.title,
        value: n.value,
      });
    },
  },
  created() {},
  mounted() {},
};
</script>

<style scoped lang="less">
  #Buttons{
    & > .btn {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      font-size: 14px;
      &::after,
      &::before {
        content: "";
        display: inline-block;
      }
      & > span {
        padding: 4px 20px;
        // height: 62px;
        // line-height: 62px;
        border-radius: 10px;
        background: #f0f0f0;
        margin: 6px 0;
        color: #666666;

        &.active {
          color: #fff;
          background: url(~@/assets/icon-btn.png) center no-repeat;
        }
        &:active {
          transform: scale(1.01);
        }
      }
    }
  }
</style>
