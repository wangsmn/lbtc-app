<template>
  <div id="Picker">
    <section
      class="picker"
      v-if="data"
      :style="{
        'max-width': data.width || '',
      }"
    >
      <div>
        <van-field
          v-model="data.value"
          readonly
          name="picker"
          :placeholder="'请选择' + data.title || ''"
          @click="data.flag = true"
          :right-icon="require('@/assets/xiala.png')"
        />
        <van-popup v-model="data.flag" round position="bottom">
          <van-picker
            :title="data.title || ''"
            show-toolbar
            :columns="data.data"
            @confirm="changeValue($event, data.title)"
            @cancel="data.flag = false"
          />
        </van-popup>
      </div>
    </section>
  </div>
</template>

<script>
import { Picker, Popup, Field } from "vant";
export default {
  name: "Cards",
  components: {
    [Field.name]: Field,
    [Popup.name]: Popup,
    [Picker.name]: Picker,
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      value: "",
    };
  },
  methods: {
    changeValue(n, name) {
      this.data.flag = false;
      this.$emit("changeValue", {
        flag: false,
        name: name,
        value: n,
      });
    },
  },
};
</script>

<style scoped lang="less">
#Picker {
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: flex-end;
}
.picker {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px;
  max-width: 45%;
  & > div {
    width: 100%;

    .van-cell {
      background: transparent;
      height: 100%;
      &::after {
        border: none;
      }
      ::v-deep .van-field__body {
        height: 100%;
        font-size: 14px;
      }
      ::v-deep .van-icon__image {
        width: 14px;
      }
    }

    .van-picker {
      ::v-deep .van-picker__toolbar {
        font-size: 14px;
        height: 40px;
        color: #000;
      }
      ::v-deep .van-picker-column {
        font-size: 14px;
      }
      ::v-deep .van-picker__title {
        line-height: 1.5;
        font-size: 14px;
      }

      ::v-deep .van-picker__cancel,
      ::v-deep .van-picker__confirm {
        font-size: 14px;
      }
    }
  }
}
</style>
