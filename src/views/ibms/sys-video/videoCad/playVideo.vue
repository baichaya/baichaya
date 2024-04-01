<template>
  <el-space wrap class="p-2">
    <div id="playWnd" class="hkRealCamera"></div>

    <div class="operate">
      <el-form :model="formInline" class="mb20">
        <el-form-item label="设备列表">
          <el-select v-model="formInline.region" placeholder="Activity zone" clearable>
            <el-option label="Zone one" value="shanghai" />
            <el-option label="Zone two" value="beijing" />
          </el-select>
        </el-form-item>
      </el-form>

      <!-- 云台控制 -->
      <div class="outer-ring">
        <!-- 上 -->
        <el-icon class="caret-up"> <CaretTop /></el-icon>
        <!-- 下 -->
        <el-icon class="caret-down"><CaretBottom /></el-icon>
        <!-- 左 -->
        <el-icon class="caret-left"><CaretLeft /></el-icon>
        <!-- 右 -->
        <el-icon class="caret-right"><CaretRight /></el-icon>
        <div class="inner-ring btn">
          <el-icon class="plus"><Plus /></el-icon>
          <div class="line"></div>
          <el-icon class="minus"><Minus /></el-icon>
        </div>
      </div>
    </div>
  </el-space>
</template>

<script name="PlayVideo" setup lang="ts">
const formInline = reactive({
  region: "",
});
</script>

<style lang="scss" scoped>
.hkRealCamera {
  width: 800px;
  height: 600px;
  object-fit: fill;
}

.operate {
  display: flex;
  flex-direction: column;
  align-items: center;

  .outer-ring {
    position: relative;
    width: 150px;
    height: 150px;
    background-color: #fff;
    border-radius: 50%;
    box-shadow:
      inset 0 0 25px #e8e8e8,
      0 1px 0 #c3c3c3,
      0 2px 0 #c9c9c9,
      0 2px 3px #333;

    i {
      font-size: 20px;
      cursor: pointer;

      &:hover {
        color: #00b176;
      }
    }

    .caret-up {
      position: absolute;
      top: 6px;
      left: 75px;
      margin-left: -10px;
    }

    .caret-down {
      position: absolute;
      bottom: 6px;
      left: 75px;
      margin-left: -10px;
    }

    .caret-left {
      position: absolute;
      top: 75px;
      left: 6px;
      margin-top: -10px;
    }

    .caret-right {
      position: absolute;
      top: 75px;
      right: 6px;
      margin-top: -10px;
    }

    .ob-caret-left {
      position: absolute;
      top: 24px;
      left: 24px;
      transform: rotate(45deg);
    }

    .ob-caret-up {
      position: absolute;
      top: 24px;
      right: 24px;
      transform: rotate(45deg);
    }

    .ob-caret-right {
      position: absolute;
      right: 24px;
      bottom: 24px;
      transform: rotate(45deg);
    }

    .ob-caret-down {
      position: absolute;
      bottom: 24px;
      left: 24px;
      transform: rotate(45deg);
    }

    .inner-ring {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 80px;
      height: 80px;
      background-color: #fff;
      border: 1px solid #ddd;
      border-radius: 50%;
      transform: translate(-50%, -50%);

      .plus {
        position: absolute;
        top: 10px;
        left: 40px;
        margin-left: -10px;
      }

      .line {
        position: absolute;
        top: 39px;
        left: 0;
        width: 100%;
        height: 1px;
        background-color: #ddd;
      }

      .minus {
        position: absolute;
        bottom: 10px;
        left: 40px;
        margin-left: -10px;
      }
    }
  }
}
</style>
