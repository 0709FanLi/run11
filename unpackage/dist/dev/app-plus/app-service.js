if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global = uni.requireGlobal();
  ArrayBuffer = global.ArrayBuffer;
  Int8Array = global.Int8Array;
  Uint8Array = global.Uint8Array;
  Uint8ClampedArray = global.Uint8ClampedArray;
  Int16Array = global.Int16Array;
  Uint16Array = global.Uint16Array;
  Int32Array = global.Int32Array;
  Uint32Array = global.Uint32Array;
  Float32Array = global.Float32Array;
  Float64Array = global.Float64Array;
  BigInt64Array = global.BigInt64Array;
  BigUint64Array = global.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  const _imports_0$2 = "/static/login-bg.png";
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$6 = {
    data() {
      return {
        phone: "18768880709",
        // 默认手机号
        code: "",
        counting: false,
        countDown: 60
      };
    },
    onLoad() {
      this.preloadImage();
    },
    methods: {
      preloadImage() {
        uni.getImageInfo({
          src: "/static/login-bg.png",
          success: (res) => {
            formatAppLog("log", "at pages/login/login.vue:49", "背景图加载成功", res);
          },
          fail: (err) => {
            formatAppLog("error", "at pages/login/login.vue:52", "背景图加载失败", err);
            uni.getImageInfo({
              src: "static/login-bg.png",
              success: (res) => {
                formatAppLog("log", "at pages/login/login.vue:57", "使用alternate路径加载成功");
                document.querySelector(".page-bg").src = "static/login-bg.png";
              },
              fail: (errInner) => {
                formatAppLog("error", "at pages/login/login.vue:62", "所有路径都加载失败", errInner);
              }
            });
          }
        });
      },
      getVerifyCode() {
        if (!/^1\d{10}$/.test(this.phone)) {
          uni.showToast({
            title: "请输入正确的手机号",
            icon: "none"
          });
          return;
        }
        this.counting = true;
        this.countDown = 60;
        const isSuccess = Math.random() > 0.2;
        if (!isSuccess) {
          uni.showToast({
            title: "验证码发送失败，请重试",
            icon: "none"
          });
          this.counting = false;
          return;
        }
        formatAppLog("log", "at pages/login/login.vue:95", "验证码发送成功");
        const timer = setInterval(() => {
          this.countDown--;
          if (this.countDown <= 0) {
            this.counting = false;
            clearInterval(timer);
          }
        }, 1e3);
      },
      handleLogin() {
        if (!/^1\d{10}$/.test(this.phone)) {
          uni.showToast({
            title: "请输入正确的手机号",
            icon: "none"
          });
          return;
        }
        if (!this.code || this.code.length !== 6) {
          uni.showToast({
            title: "请输入6位验证码",
            icon: "none"
          });
          return;
        }
        uni.showLoading({
          title: "处理中..."
        });
        setTimeout(() => {
          const isRegistered = Math.random() > 0.5;
          if (isRegistered) {
            uni.showToast({
              title: "登录成功",
              icon: "success"
            });
          } else {
            uni.showToast({
              title: "注册成功",
              icon: "success"
            });
          }
          uni.setStorageSync("isLoggedIn", true);
          uni.setStorageSync("userInfo", {
            phone: this.phone,
            points: 100,
            // 初始积分
            avatarUrl: "/static/default-avatar.png",
            nickname: "跑步达人",
            gender: "男"
          });
          setTimeout(() => {
            uni.hideLoading();
            uni.reLaunch({
              url: "/pages/index/index"
            });
          }, 1e3);
        }, 1500);
      }
    }
  };
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "login-container" }, [
      vue.createCommentVNode(" 全屏背景图 "),
      vue.createElementVNode("image", {
        class: "page-bg",
        src: _imports_0$2,
        mode: "aspectFill"
      }),
      vue.createCommentVNode(" 登录表单区域 "),
      vue.createElementVNode("view", { class: "login-form" }, [
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createElementVNode("text", { class: "form-label" }, "登录"),
          vue.createElementVNode("view", { class: "form-input-line" })
        ]),
        vue.createElementVNode("view", { class: "form-item phone-input" }, [
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              type: "number",
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.phone = $event),
              maxlength: "11",
              placeholder: "输入手机号"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $data.phone]
          ])
        ]),
        vue.createElementVNode("view", { class: "form-item code-input" }, [
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              type: "number",
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.code = $event),
              maxlength: "6",
              placeholder: "验证码"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $data.code]
          ]),
          vue.createElementVNode(
            "text",
            {
              class: vue.normalizeClass(["code-btn", { "counting": $data.counting }]),
              onClick: _cache[2] || (_cache[2] = (...args) => $options.getVerifyCode && $options.getVerifyCode(...args))
            },
            vue.toDisplayString($data.counting ? `${$data.countDown}秒后重发` : "获取验证码"),
            3
            /* TEXT, CLASS */
          )
        ]),
        vue.createElementVNode("button", {
          class: "login-btn",
          onClick: _cache[3] || (_cache[3] = (...args) => $options.handleLogin && $options.handleLogin(...args))
        }, "登录/注册")
      ])
    ]);
  }
  const PagesLoginLogin = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$5], ["__file", "/Users/Macx/Desktop/ai项目/run11/pages/login/login.vue"]]);
  const _imports_0$1 = "/static/icons/location.png";
  const _sfc_main$5 = {
    data() {
      return {
        latitude: 39.909,
        // 默认纬度
        longitude: 116.39742,
        // 默认经度
        scale: 16,
        // 缩放级别
        markers: [{
          id: 1,
          latitude: 39.909,
          longitude: 116.39742,
          title: "当前位置",
          iconPath: "/static/location.png",
          width: 30,
          height: 30
        }],
        polyline: [],
        // 跑步轨迹
        isRunning: false,
        // 是否正在跑步
        startTime: null,
        // 开始时间
        duration: 0,
        // 持续时间（秒）
        distance: 0,
        // 距离（公里）
        calories: 0,
        // 卡路里
        timer: null,
        // 计时器
        locationChangeListener: null,
        // 位置监听器
        locationList: [],
        // 位置记录
        pace: `0'00"`,
        // 配速
        customMapStyle: "amap://styles/fresh"
        // 使用自定义地图样式
      };
    },
    computed: {
      formatDuration() {
        const hours = Math.floor(this.duration / 3600);
        const minutes = Math.floor(this.duration % 3600 / 60);
        const seconds = this.duration % 60;
        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
      }
    },
    onLoad() {
      const isLoggedIn = uni.getStorageSync("isLoggedIn");
      if (!isLoggedIn) {
        uni.redirectTo({
          url: "/pages/login/login"
        });
        return;
      }
      try {
        uni.hideNavigationBar();
      } catch (e) {
        formatAppLog("log", "at pages/index/index.vue:123", "隐藏导航栏失败", e);
      }
      this.adjustPageLayout();
      setTimeout(() => {
        this.getLocationAndCenter();
      }, 200);
    },
    onShow() {
      setTimeout(() => {
        uni.hideNavigationBar();
      }, 300);
    },
    onUnload() {
      this.clearListeners();
    },
    methods: {
      adjustPageLayout() {
        uni.getSystemInfo({
          success: (res) => {
            formatAppLog("log", "at pages/index/index.vue:149", "系统信息:", res);
            let safeBottom = 70;
            if (res.safeAreaInsets && res.safeAreaInsets.bottom > 0) {
              safeBottom = res.safeAreaInsets.bottom + 60;
            }
            if (typeof document !== "undefined") {
              document.documentElement.style.setProperty("--safe-bottom", `${safeBottom}px`);
            }
            this.statusBarHeight = res.statusBarHeight || 20;
          }
        });
      },
      getLocationAndCenter() {
        uni.showLoading({
          title: "定位中..."
        });
        const locationTimeout = setTimeout(() => {
          uni.hideLoading();
          uni.showToast({
            title: "定位超时，请手动点击定位按钮",
            icon: "none",
            duration: 2e3
          });
        }, 8e3);
        uni.getLocation({
          type: "gcj02",
          altitude: true,
          // 获取高度信息增加精度
          isHighAccuracy: true,
          // 开启高精度定位
          highAccuracyExpireTime: 4e3,
          // 高精度定位超时时间 (ms)
          success: (res) => {
            clearTimeout(locationTimeout);
            formatAppLog("log", "at pages/index/index.vue:190", "定位成功:", res);
            this.latitude = res.latitude;
            this.longitude = res.longitude;
            setTimeout(() => {
              this.markers = [{
                id: 1,
                latitude: res.latitude,
                longitude: res.longitude,
                title: "当前位置",
                iconPath: "/static/location.png",
                width: 30,
                height: 30
              }];
              const mapContext = uni.createMapContext("runMap");
              if (mapContext) {
                mapContext.moveToLocation({
                  latitude: res.latitude,
                  longitude: res.longitude,
                  success: () => {
                    formatAppLog("log", "at pages/index/index.vue:214", "地图成功移动到当前位置");
                  },
                  fail: (err) => {
                    formatAppLog("error", "at pages/index/index.vue:217", "地图移动失败", err);
                  }
                });
              }
              uni.hideLoading();
            }, 300);
          },
          fail: (err) => {
            clearTimeout(locationTimeout);
            formatAppLog("error", "at pages/index/index.vue:227", "获取位置失败", err);
            uni.hideLoading();
            uni.showToast({
              title: "获取位置失败，请检查定位权限",
              icon: "none",
              duration: 2e3
            });
          }
        });
      },
      getLocation() {
        uni.getLocation({
          type: "gcj02",
          success: (res) => {
            this.latitude = res.latitude;
            this.longitude = res.longitude;
            if (this.markers.length > 0) {
              this.markers[0].latitude = res.latitude;
              this.markers[0].longitude = res.longitude;
            }
          },
          fail: (err) => {
            formatAppLog("error", "at pages/index/index.vue:252", "获取位置失败", err);
            uni.showToast({
              title: "获取位置失败，请检查定位权限",
              icon: "none"
            });
          }
        });
      },
      moveToLocation() {
        uni.showLoading({
          title: "定位中..."
        });
        uni.getLocation({
          type: "gcj02",
          isHighAccuracy: true,
          success: (res) => {
            this.latitude = res.latitude;
            this.longitude = res.longitude;
            this.markers = [{
              id: 1,
              latitude: res.latitude,
              longitude: res.longitude,
              title: "当前位置",
              iconPath: "/static/location.png",
              width: 30,
              height: 30
            }];
            const mapContext = uni.createMapContext("runMap");
            if (mapContext) {
              mapContext.moveToLocation({
                latitude: res.latitude,
                longitude: res.longitude
              });
            }
            uni.hideLoading();
            uni.showToast({
              title: "已定位到当前位置",
              icon: "none",
              duration: 1e3
            });
          },
          fail: (err) => {
            formatAppLog("error", "at pages/index/index.vue:301", "获取位置失败", err);
            uni.hideLoading();
            uni.showToast({
              title: "获取位置失败，请检查定位权限",
              icon: "none"
            });
          }
        });
      },
      toggleRun() {
        if (this.isRunning) {
          this.stopRun();
        } else {
          this.startRun();
        }
      },
      startRun() {
        this.isRunning = true;
        this.startTime = /* @__PURE__ */ new Date();
        this.duration = 0;
        this.distance = 0;
        this.calories = 0;
        this.locationList = [];
        this.polyline = [];
        this.scale = 20;
        this.polyline = [{
          points: [],
          color: "#FF6B6B",
          width: 8,
          // 增加路径宽度
          arrowLine: true,
          borderWidth: 1,
          // 添加边框
          borderColor: "#FF8E53",
          // 边框颜色
          level: "abovelabels"
          // 确保路径显示在地图标签之上
        }];
        this.timer = setInterval(() => {
          this.duration++;
          this.calories = this.duration / 60 * 10;
          if (this.distance > 0) {
            const paceMinutes = Math.floor(this.duration / 60 / this.distance);
            const paceSeconds = Math.floor((this.duration / 60 / this.distance - paceMinutes) * 60);
            this.pace = `${paceMinutes}'${paceSeconds.toString().padStart(2, "0")}"`;
          }
        }, 1e3);
        this.startLocationTracking();
        uni.showToast({
          title: "开始跑步!",
          icon: "success"
        });
      },
      stopRun() {
        this.isRunning = false;
        clearInterval(this.timer);
        this.timer = null;
        this.clearListeners();
        const userInfo = uni.getStorageSync("userInfo");
        userInfo.points += 5;
        uni.setStorageSync("userInfo", userInfo);
        uni.showToast({
          title: "跑步结束，获得5积分",
          icon: "success",
          duration: 2e3
        });
        this.scale = 16;
      },
      startLocationTracking() {
        uni.startLocationUpdate({
          success: (res) => {
            formatAppLog("log", "at pages/index/index.vue:396", "开始监听位置变化");
            this.locationChangeListener = (res2) => {
              const { latitude, longitude } = res2;
              this.locationList.push({ latitude, longitude });
              if (this.locationList.length > 1) {
                const lastLoc = this.locationList[this.locationList.length - 2];
                const currentLoc = { latitude, longitude };
                const segmentDistance = this.calculateDistance(lastLoc, currentLoc);
                this.distance += segmentDistance;
              }
              this.polyline = [{
                points: this.locationList,
                color: "#FF6B6B",
                width: 8,
                arrowLine: true,
                borderWidth: 1,
                borderColor: "#FF8E53",
                level: "abovelabels"
              }];
              this.latitude = latitude;
              this.longitude = longitude;
              this.scale = 20;
            };
            uni.onLocationChange(this.locationChangeListener);
          },
          fail: (err) => {
            formatAppLog("error", "at pages/index/index.vue:430", "开始监听位置失败", err);
          }
        });
      },
      calculateDistance(loc1, loc2) {
        const R = 6371;
        const dLat = this.deg2rad(loc2.latitude - loc1.latitude);
        const dLon = this.deg2rad(loc2.longitude - loc1.longitude);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(this.deg2rad(loc1.latitude)) * Math.cos(this.deg2rad(loc2.latitude)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return distance;
      },
      deg2rad(deg) {
        return deg * (Math.PI / 180);
      },
      clearListeners() {
        if (this.timer) {
          clearInterval(this.timer);
          this.timer = null;
        }
        if (this.locationChangeListener) {
          uni.offLocationChange(this.locationChangeListener);
          this.locationChangeListener = null;
          uni.stopLocationUpdate();
        }
      },
      closeFinishPopup() {
        this.$refs.finishPopup.close();
      }
    }
  };
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "content" }, [
      vue.createCommentVNode(" 地图部分 "),
      vue.createElementVNode("view", { class: "map-section" }, [
        vue.createElementVNode("map", {
          id: "runMap",
          latitude: $data.latitude,
          longitude: $data.longitude,
          markers: $data.markers,
          polyline: $data.polyline,
          scale: $data.scale,
          style: { "width": "100%", "height": "65vh" },
          "show-location": true,
          "show-compass": true,
          "enable-poi": false,
          "enable-building": true,
          "show-scale": false,
          "enable-zoom": true,
          "enable-rotate": true,
          "min-scale": 3,
          "max-scale": 20,
          "custom-map-style": $data.customMapStyle,
          setting: {
            skew: 0,
            rotate: 0,
            showScale: false,
            showCompass: true,
            enableRotate: true,
            enableOverlooking: false,
            enableSatellite: false,
            enableTraffic: false
          }
        }, [
          vue.createCommentVNode(" 地图控件 "),
          vue.createElementVNode("cover-view", { class: "map-controls" }, [
            vue.createElementVNode("cover-view", {
              class: "map-btn location-btn",
              onClick: _cache[0] || (_cache[0] = (...args) => $options.moveToLocation && $options.moveToLocation(...args))
            }, [
              vue.createElementVNode("cover-image", {
                src: _imports_0$1,
                class: "btn-icon"
              })
            ])
          ])
        ], 8, ["latitude", "longitude", "markers", "polyline", "scale", "custom-map-style"])
      ]),
      vue.createCommentVNode(" 跑步信息和按钮 "),
      vue.createElementVNode(
        "view",
        {
          class: vue.normalizeClass(["run-section", { "running": $data.isRunning }])
        },
        [
          $data.isRunning ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "run-info"
          }, [
            vue.createElementVNode("view", { class: "info-item" }, [
              vue.createElementVNode(
                "text",
                { class: "info-value" },
                vue.toDisplayString($options.formatDuration),
                1
                /* TEXT */
              ),
              vue.createElementVNode("text", { class: "info-label" }, "时间")
            ]),
            vue.createElementVNode("view", { class: "info-item" }, [
              vue.createElementVNode(
                "text",
                { class: "info-value" },
                vue.toDisplayString($data.distance.toFixed(2)),
                1
                /* TEXT */
              ),
              vue.createElementVNode("text", { class: "info-label" }, "距离(公里)")
            ]),
            vue.createElementVNode("view", { class: "info-item" }, [
              vue.createElementVNode(
                "text",
                { class: "info-value" },
                vue.toDisplayString($data.calories.toFixed(0)),
                1
                /* TEXT */
              ),
              vue.createElementVNode("text", { class: "info-label" }, "卡路里")
            ])
          ])) : vue.createCommentVNode("v-if", true),
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["run-button-wrapper", { "pulse": !$data.isRunning }])
            },
            [
              vue.createElementVNode(
                "button",
                {
                  class: vue.normalizeClass(["run-button", { "small": $data.isRunning }]),
                  onClick: _cache[1] || (_cache[1] = (...args) => $options.toggleRun && $options.toggleRun(...args))
                },
                vue.toDisplayString($data.isRunning ? "结束跑步" : "开始跑步"),
                3
                /* TEXT, CLASS */
              )
            ],
            2
            /* CLASS */
          )
        ],
        2
        /* CLASS */
      )
    ]);
  }
  const PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$4], ["__file", "/Users/Macx/Desktop/ai项目/run11/pages/index/index.vue"]]);
  const _sfc_main$4 = {
    data() {
      return {
        latitude: 39.909,
        // 默认纬度
        longitude: 116.39742,
        // 默认经度
        scale: 14,
        // 缩放级别，取值范围为 5-18
        markers: [{
          id: 1,
          latitude: 39.909,
          longitude: 116.39742,
          title: "标记点1",
          iconPath: "/static/location.png",
          // 需要提前准备图标
          width: 30,
          height: 30,
          callout: {
            content: "这是一个标记点",
            color: "#000000",
            fontSize: 14,
            borderRadius: 4,
            bgColor: "#ffffff",
            padding: 8,
            display: "ALWAYS"
          }
        }]
      };
    },
    onLoad() {
      this.getLocation();
    },
    methods: {
      getLocation() {
        uni.getLocation({
          type: "gcj02",
          // 腾讯地图使用的是国测局坐标(GCJ-02)
          success: (res) => {
            this.latitude = res.latitude;
            this.longitude = res.longitude;
            if (this.markers.length > 0) {
              this.markers[0].latitude = res.latitude;
              this.markers[0].longitude = res.longitude;
              this.markers[0].callout.content = "当前位置";
            }
          },
          fail: (err) => {
            formatAppLog("error", "at pages/map/map.vue:69", "获取位置失败", err);
            uni.showToast({
              title: "获取位置失败，请检查定位权限",
              icon: "none"
            });
          }
        });
      },
      moveToLocation() {
        this.getLocation();
      },
      searchNearby() {
        uni.showLoading({
          title: "搜索中..."
        });
        setTimeout(() => {
          this.markers = [
            {
              id: 1,
              latitude: this.latitude,
              longitude: this.longitude,
              title: "当前位置",
              iconPath: "/static/location.png",
              width: 30,
              height: 30,
              callout: {
                content: "当前位置",
                color: "#000000",
                fontSize: 14,
                borderRadius: 4,
                bgColor: "#ffffff",
                padding: 8,
                display: "ALWAYS"
              }
            },
            {
              id: 2,
              latitude: this.latitude + 0.01,
              longitude: this.longitude + 0.01,
              title: "附近地点1",
              iconPath: "/static/poi.png",
              width: 25,
              height: 25,
              callout: {
                content: "附近地点1",
                color: "#000000",
                fontSize: 14,
                borderRadius: 4,
                bgColor: "#ffffff",
                padding: 8,
                display: "BYCLICK"
              }
            },
            {
              id: 3,
              latitude: this.latitude - 0.01,
              longitude: this.longitude - 0.01,
              title: "附近地点2",
              iconPath: "/static/poi.png",
              width: 25,
              height: 25,
              callout: {
                content: "附近地点2",
                color: "#000000",
                fontSize: 14,
                borderRadius: 4,
                bgColor: "#ffffff",
                padding: 8,
                display: "BYCLICK"
              }
            }
          ];
          uni.hideLoading();
        }, 1500);
      },
      onRegionChange(e) {
        formatAppLog("log", "at pages/map/map.vue:151", "地图区域变化", e);
      },
      onMarkerTap(e) {
        formatAppLog("log", "at pages/map/map.vue:154", "点击了标记点", e);
        const markerId = e.markerId;
        const marker = this.markers.find((item) => item.id === markerId);
        if (marker) {
          uni.showToast({
            title: `点击了: ${marker.title}`,
            icon: "none"
          });
        }
      },
      onCalloutTap(e) {
        formatAppLog("log", "at pages/map/map.vue:166", "点击了标记点气泡", e);
      }
    }
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "map-container" }, [
      vue.createElementVNode("map", {
        id: "myMap",
        latitude: $data.latitude,
        longitude: $data.longitude,
        markers: $data.markers,
        scale: $data.scale,
        onRegionchange: _cache[0] || (_cache[0] = (...args) => $options.onRegionChange && $options.onRegionChange(...args)),
        onMarkertap: _cache[1] || (_cache[1] = (...args) => $options.onMarkerTap && $options.onMarkerTap(...args)),
        onCallouttap: _cache[2] || (_cache[2] = (...args) => $options.onCalloutTap && $options.onCalloutTap(...args)),
        style: { "width": "100%", "height": "300px" },
        "show-location": true
      }, null, 40, ["latitude", "longitude", "markers", "scale"]),
      vue.createElementVNode("view", { class: "controls" }, [
        vue.createElementVNode("button", {
          onClick: _cache[3] || (_cache[3] = (...args) => $options.moveToLocation && $options.moveToLocation(...args)),
          class: "uni-btn"
        }, "定位到当前位置"),
        vue.createElementVNode("button", {
          onClick: _cache[4] || (_cache[4] = (...args) => $options.searchNearby && $options.searchNearby(...args)),
          class: "uni-btn"
        }, "搜索附近")
      ])
    ]);
  }
  const PagesMapMap = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__file", "/Users/Macx/Desktop/ai项目/run11/pages/map/map.vue"]]);
  const _imports_0 = "/static/success.png";
  const _sfc_main$3 = {
    data() {
      return {
        userInfo: {
          points: 0
        },
        products: [
          {
            id: 1,
            name: "运动水杯",
            points: 100,
            image: "/static/products/bottle.jpg"
          },
          {
            id: 2,
            name: "运动毛巾",
            points: 150,
            image: "/static/products/towel.jpg"
          },
          {
            id: 3,
            name: "跑步腰包",
            points: 200,
            image: "/static/products/bag.jpg"
          },
          {
            id: 4,
            name: "运动袜",
            points: 80,
            image: "/static/products/socks.jpg"
          },
          {
            id: 5,
            name: "运动护腕",
            points: 120,
            image: "/static/products/wristband.jpg"
          },
          {
            id: 6,
            name: "运动耳机",
            points: 300,
            image: "/static/products/headphone.jpg"
          }
        ],
        addresses: [
          {
            id: 1,
            name: "张三",
            phone: "13800138000",
            province: "北京市",
            city: "北京市",
            district: "海淀区",
            detail: "中关村科技园区123号"
          },
          {
            id: 2,
            name: "李四",
            phone: "13900139000",
            province: "上海市",
            city: "上海市",
            district: "浦东新区",
            detail: "张江高科技园区456号"
          }
        ],
        selectedProduct: null,
        selectedAddress: null
      };
    },
    onLoad() {
      const userInfoStorage = uni.getStorageSync("userInfo");
      if (userInfoStorage) {
        this.userInfo = userInfoStorage;
      }
    },
    methods: {
      selectProduct(product) {
        if (this.userInfo.points < product.points) {
          uni.showToast({
            title: "积分不足",
            icon: "none"
          });
          return;
        }
        this.selectedProduct = product;
        this.selectedAddress = null;
        this.$refs.addressPopup.open();
      },
      closeAddressPopup() {
        this.$refs.addressPopup.close();
      },
      selectAddress(address) {
        this.selectedAddress = address;
      },
      addNewAddress() {
        uni.showToast({
          title: "添加地址功能开发中",
          icon: "none"
        });
      },
      confirmExchange() {
        if (!this.selectedProduct || !this.selectedAddress) {
          uni.showToast({
            title: "请选择收货地址",
            icon: "none"
          });
          return;
        }
        this.$refs.addressPopup.close();
        uni.showLoading({
          title: "处理中..."
        });
        setTimeout(() => {
          const userInfo = uni.getStorageSync("userInfo");
          userInfo.points -= this.selectedProduct.points;
          uni.setStorageSync("userInfo", userInfo);
          this.userInfo = userInfo;
          uni.hideLoading();
          this.$refs.successPopup.open();
        }, 1500);
      },
      closeSuccessPopup() {
        this.$refs.successPopup.close();
      }
    }
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_popup = vue.resolveComponent("uni-popup");
    return vue.openBlock(), vue.createElementBlock("view", { class: "points-container" }, [
      vue.createCommentVNode(" 积分展示区域 "),
      vue.createElementVNode("view", { class: "points-header" }, [
        vue.createElementVNode("view", { class: "points-card" }, [
          vue.createElementVNode("view", { class: "points-title" }, "我的积分"),
          vue.createElementVNode(
            "view",
            { class: "points-value" },
            vue.toDisplayString($data.userInfo.points),
            1
            /* TEXT */
          ),
          vue.createElementVNode("view", { class: "points-desc" }, "每次完成跑步可获得5积分")
        ])
      ]),
      vue.createCommentVNode(" 积分兑换商品区域 "),
      vue.createElementVNode("view", { class: "points-exchange" }, [
        vue.createElementVNode("view", { class: "section-title" }, "积分兑换"),
        vue.createElementVNode("view", { class: "product-list" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.products, (item, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                class: "product-item",
                key: index,
                onClick: ($event) => $options.selectProduct(item)
              }, [
                vue.createElementVNode("image", {
                  src: item.image,
                  mode: "aspectFill",
                  class: "product-image"
                }, null, 8, ["src"]),
                vue.createElementVNode("view", { class: "product-info" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "product-name" },
                    vue.toDisplayString(item.name),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("view", { class: "product-points" }, [
                    vue.createElementVNode("text", { class: "points-icon" }, "积分"),
                    vue.createElementVNode(
                      "text",
                      { class: "points-num" },
                      vue.toDisplayString(item.points),
                      1
                      /* TEXT */
                    )
                  ])
                ])
              ], 8, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ]),
      vue.createCommentVNode(" 地址选择弹窗 "),
      vue.createVNode(
        _component_uni_popup,
        {
          ref: "addressPopup",
          type: "bottom"
        },
        {
          default: vue.withCtx(() => [
            vue.createElementVNode("view", { class: "address-popup" }, [
              vue.createElementVNode("view", { class: "popup-header" }, [
                vue.createElementVNode("text", { class: "popup-title" }, "选择收货地址"),
                vue.createElementVNode("text", {
                  class: "popup-close",
                  onClick: _cache[0] || (_cache[0] = (...args) => $options.closeAddressPopup && $options.closeAddressPopup(...args))
                }, "×")
              ]),
              vue.createElementVNode("scroll-view", {
                "scroll-y": "true",
                class: "address-list"
              }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($data.addresses, (address, index) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      class: vue.normalizeClass(["address-item", { "selected": $data.selectedAddress && $data.selectedAddress.id === address.id }]),
                      key: index,
                      onClick: ($event) => $options.selectAddress(address)
                    }, [
                      vue.createElementVNode("view", { class: "address-info" }, [
                        vue.createElementVNode("view", { class: "address-line" }, [
                          vue.createElementVNode(
                            "text",
                            { class: "address-name" },
                            vue.toDisplayString(address.name),
                            1
                            /* TEXT */
                          ),
                          vue.createElementVNode(
                            "text",
                            { class: "address-phone" },
                            vue.toDisplayString(address.phone),
                            1
                            /* TEXT */
                          )
                        ]),
                        vue.createElementVNode(
                          "view",
                          { class: "address-detail" },
                          vue.toDisplayString(address.province) + " " + vue.toDisplayString(address.city) + " " + vue.toDisplayString(address.district) + " " + vue.toDisplayString(address.detail),
                          1
                          /* TEXT */
                        )
                      ]),
                      $data.selectedAddress && $data.selectedAddress.id === address.id ? (vue.openBlock(), vue.createElementBlock("view", {
                        key: 0,
                        class: "address-check"
                      }, [
                        vue.createElementVNode("text", { class: "check-icon" }, "✓")
                      ])) : vue.createCommentVNode("v-if", true)
                    ], 10, ["onClick"]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ]),
              vue.createElementVNode("view", { class: "popup-footer" }, [
                vue.createElementVNode("button", {
                  class: "add-address-btn",
                  onClick: _cache[1] || (_cache[1] = (...args) => $options.addNewAddress && $options.addNewAddress(...args))
                }, "添加新地址"),
                vue.createElementVNode("button", {
                  class: "confirm-btn",
                  onClick: _cache[2] || (_cache[2] = (...args) => $options.confirmExchange && $options.confirmExchange(...args)),
                  disabled: !$data.selectedAddress
                }, "确认兑换", 8, ["disabled"])
              ])
            ])
          ]),
          _: 1
          /* STABLE */
        },
        512
        /* NEED_PATCH */
      ),
      vue.createCommentVNode(" 兑换成功弹窗 "),
      vue.createVNode(
        _component_uni_popup,
        {
          ref: "successPopup",
          type: "center"
        },
        {
          default: vue.withCtx(() => [
            vue.createElementVNode("view", { class: "success-popup" }, [
              vue.createElementVNode("image", {
                src: _imports_0,
                class: "success-icon"
              }),
              vue.createElementVNode("text", { class: "success-title" }, "兑换成功"),
              vue.createElementVNode("text", { class: "success-desc" }, "商品将在3-5个工作日内发出"),
              vue.createElementVNode("button", {
                class: "success-btn",
                onClick: _cache[3] || (_cache[3] = (...args) => $options.closeSuccessPopup && $options.closeSuccessPopup(...args))
              }, "确定")
            ])
          ]),
          _: 1
          /* STABLE */
        },
        512
        /* NEED_PATCH */
      )
    ]);
  }
  const PagesPointsPoints = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__file", "/Users/Macx/Desktop/ai项目/run11/pages/points/points.vue"]]);
  const _sfc_main$2 = {
    data() {
      return {
        userInfo: {
          nickname: "跑步达人",
          phone: "13800138000",
          avatarUrl: "/static/default-avatar.png",
          gender: "男"
        },
        runStats: {
          totalDistance: "0.0",
          totalDuration: "0.0",
          totalCalories: "0"
        }
      };
    },
    onShow() {
      const userInfoStorage = uni.getStorageSync("userInfo");
      if (userInfoStorage) {
        this.userInfo = userInfoStorage;
      }
      this.getRunStats();
    },
    methods: {
      formatPhone(phone) {
        if (!phone)
          return "";
        return phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
      },
      navigateToEdit() {
        uni.navigateTo({
          url: "/pages/profile/edit"
        });
      },
      getRunStats() {
        this.runStats = {
          totalDistance: (Math.random() * 10).toFixed(1),
          totalDuration: (Math.random() * 5).toFixed(1),
          totalCalories: Math.floor(Math.random() * 1e3)
        };
      },
      showHealthInfo() {
        uni.showModal({
          title: "健康信息收集清单",
          content: "我们收集您的运动数据，包括跑步距离、时间和卡路里消耗等信息，以提供更好的健康分析服务。",
          confirmText: "了解更多",
          cancelText: "关闭",
          success: (res) => {
            if (res.confirm) {
              uni.navigateTo({
                url: "/pages/health/detail"
              });
            }
          }
        });
      },
      openSettings() {
        uni.showToast({
          title: "设置功能开发中",
          icon: "none"
        });
      },
      showAbout() {
        uni.showModal({
          title: "关于应用",
          content: "跑步达人 v1.0.0\n一款专注于记录跑步数据、激励健康生活的应用。",
          showCancel: false,
          confirmText: "我知道了"
        });
      },
      showPrivacy() {
        uni.showModal({
          title: "隐私政策",
          content: "我们重视您的隐私保护，所有数据仅用于改善用户体验，不会向第三方泄露您的个人信息。",
          confirmText: "查看详情",
          cancelText: "关闭",
          success: (res) => {
            if (res.confirm) {
              uni.navigateTo({
                url: "/pages/privacy/policy"
              });
            }
          }
        });
      },
      logout() {
        uni.showModal({
          title: "退出登录",
          content: "确定要退出登录吗？",
          success: (res) => {
            if (res.confirm) {
              uni.removeStorageSync("isLoggedIn");
              uni.removeStorageSync("userInfo");
              uni.reLaunch({
                url: "/pages/login/login"
              });
            }
          }
        });
      }
    }
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "profile-container" }, [
      vue.createCommentVNode(" 头部用户信息 "),
      vue.createElementVNode("view", { class: "user-header" }, [
        vue.createElementVNode("view", {
          class: "user-info",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.navigateToEdit && $options.navigateToEdit(...args))
        }, [
          vue.createElementVNode("image", {
            src: $data.userInfo.avatarUrl,
            class: "user-avatar"
          }, null, 8, ["src"]),
          vue.createElementVNode("view", { class: "user-detail" }, [
            vue.createElementVNode(
              "text",
              { class: "user-nickname" },
              vue.toDisplayString($data.userInfo.nickname),
              1
              /* TEXT */
            ),
            vue.createElementVNode(
              "text",
              { class: "user-phone" },
              vue.toDisplayString($options.formatPhone($data.userInfo.phone)),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "edit-icon" }, [
            vue.createElementVNode("text", { class: "iconfont" }, "")
          ])
        ])
      ]),
      vue.createCommentVNode(" 跑步统计 "),
      vue.createElementVNode("view", { class: "stats-section" }, [
        vue.createElementVNode("view", { class: "stats-item" }, [
          vue.createElementVNode(
            "text",
            { class: "stats-value" },
            vue.toDisplayString($data.runStats.totalDistance),
            1
            /* TEXT */
          ),
          vue.createElementVNode("text", { class: "stats-label" }, "总里程(km)")
        ]),
        vue.createElementVNode("view", { class: "stats-item" }, [
          vue.createElementVNode(
            "text",
            { class: "stats-value" },
            vue.toDisplayString($data.runStats.totalDuration),
            1
            /* TEXT */
          ),
          vue.createElementVNode("text", { class: "stats-label" }, "总时长(h)")
        ]),
        vue.createElementVNode("view", { class: "stats-item" }, [
          vue.createElementVNode(
            "text",
            { class: "stats-value" },
            vue.toDisplayString($data.runStats.totalCalories),
            1
            /* TEXT */
          ),
          vue.createElementVNode("text", { class: "stats-label" }, "消耗(kcal)")
        ])
      ]),
      vue.createCommentVNode(" 功能列表 "),
      vue.createElementVNode("view", { class: "menu-section" }, [
        vue.createElementVNode("view", { class: "menu-group" }, [
          vue.createElementVNode("view", { class: "menu-title" }, "个人设置"),
          vue.createElementVNode("view", { class: "menu-list" }, [
            vue.createElementVNode("view", {
              class: "menu-item",
              onClick: _cache[1] || (_cache[1] = (...args) => $options.navigateToEdit && $options.navigateToEdit(...args))
            }, [
              vue.createElementVNode("view", { class: "menu-icon personal-icon" }, [
                vue.createElementVNode("text", { class: "iconfont" }, "")
              ]),
              vue.createElementVNode("view", { class: "menu-content" }, [
                vue.createElementVNode("text", { class: "menu-label" }, "个人信息")
              ]),
              vue.createElementVNode("text", { class: "menu-arrow" }, "")
            ]),
            vue.createElementVNode("view", {
              class: "menu-item",
              onClick: _cache[2] || (_cache[2] = (...args) => $options.showHealthInfo && $options.showHealthInfo(...args))
            }, [
              vue.createElementVNode("view", { class: "menu-icon health-icon" }, [
                vue.createElementVNode("text", { class: "iconfont" }, "")
              ]),
              vue.createElementVNode("view", { class: "menu-content" }, [
                vue.createElementVNode("text", { class: "menu-label" }, "健康信息收集清单")
              ]),
              vue.createElementVNode("text", { class: "menu-arrow" }, "")
            ]),
            vue.createElementVNode("view", {
              class: "menu-item",
              onClick: _cache[3] || (_cache[3] = (...args) => $options.openSettings && $options.openSettings(...args))
            }, [
              vue.createElementVNode("view", { class: "menu-icon settings-icon" }, [
                vue.createElementVNode("text", { class: "iconfont" }, "")
              ]),
              vue.createElementVNode("view", { class: "menu-content" }, [
                vue.createElementVNode("text", { class: "menu-label" }, "设置")
              ]),
              vue.createElementVNode("text", { class: "menu-arrow" }, "")
            ])
          ])
        ]),
        vue.createElementVNode("view", { class: "menu-group" }, [
          vue.createElementVNode("view", { class: "menu-title" }, "关于我们"),
          vue.createElementVNode("view", { class: "menu-list" }, [
            vue.createElementVNode("view", {
              class: "menu-item",
              onClick: _cache[4] || (_cache[4] = (...args) => $options.showAbout && $options.showAbout(...args))
            }, [
              vue.createElementVNode("view", { class: "menu-icon about-icon" }, [
                vue.createElementVNode("text", { class: "iconfont" }, "")
              ]),
              vue.createElementVNode("view", { class: "menu-content" }, [
                vue.createElementVNode("text", { class: "menu-label" }, "关于应用")
              ]),
              vue.createElementVNode("text", { class: "menu-arrow" }, "")
            ]),
            vue.createElementVNode("view", {
              class: "menu-item",
              onClick: _cache[5] || (_cache[5] = (...args) => $options.showPrivacy && $options.showPrivacy(...args))
            }, [
              vue.createElementVNode("view", { class: "menu-icon privacy-icon" }, [
                vue.createElementVNode("text", { class: "iconfont" }, "")
              ]),
              vue.createElementVNode("view", { class: "menu-content" }, [
                vue.createElementVNode("text", { class: "menu-label" }, "隐私政策")
              ]),
              vue.createElementVNode("text", { class: "menu-arrow" }, "")
            ])
          ])
        ])
      ]),
      vue.createElementVNode("view", { class: "logout-section" }, [
        vue.createElementVNode("button", {
          class: "logout-btn",
          onClick: _cache[6] || (_cache[6] = (...args) => $options.logout && $options.logout(...args))
        }, "退出登录")
      ])
    ]);
  }
  const PagesProfileProfile = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__file", "/Users/Macx/Desktop/ai项目/run11/pages/profile/profile.vue"]]);
  const _sfc_main$1 = {
    data() {
      return {
        userInfo: {
          nickname: "",
          phone: "",
          avatarUrl: "/static/default-avatar.png",
          gender: "男",
          height: "",
          weight: "",
          birthday: ""
        }
      };
    },
    onLoad() {
      const userInfoStorage = uni.getStorageSync("userInfo");
      if (userInfoStorage) {
        this.userInfo = JSON.parse(JSON.stringify(userInfoStorage));
        this.userInfo.height = this.userInfo.height || "";
        this.userInfo.weight = this.userInfo.weight || "";
        this.userInfo.birthday = this.userInfo.birthday || "";
      }
    },
    methods: {
      formatPhone(phone) {
        if (!phone)
          return "";
        return phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
      },
      chooseAvatar() {
        uni.chooseImage({
          count: 1,
          sizeType: ["compressed"],
          sourceType: ["album", "camera"],
          success: (res) => {
            const tempFilePath = res.tempFilePaths[0];
            this.userInfo.avatarUrl = tempFilePath;
            uni.showToast({
              title: "头像已更新",
              icon: "success"
            });
          }
        });
      },
      onBirthdayChange(e) {
        this.userInfo.birthday = e.detail.value;
      },
      validateForm() {
        if (!this.userInfo.nickname) {
          uni.showToast({
            title: "请输入昵称",
            icon: "none"
          });
          return false;
        }
        if (this.userInfo.height && (isNaN(this.userInfo.height) || Number(this.userInfo.height) < 50 || Number(this.userInfo.height) > 250)) {
          uni.showToast({
            title: "请输入有效的身高",
            icon: "none"
          });
          return false;
        }
        if (this.userInfo.weight && (isNaN(this.userInfo.weight) || Number(this.userInfo.weight) < 20 || Number(this.userInfo.weight) > 200)) {
          uni.showToast({
            title: "请输入有效的体重",
            icon: "none"
          });
          return false;
        }
        return true;
      },
      saveUserInfo() {
        if (!this.validateForm()) {
          return;
        }
        const originalUserInfo = uni.getStorageSync("userInfo") || {};
        const updatedUserInfo = {
          ...originalUserInfo,
          nickname: this.userInfo.nickname,
          gender: this.userInfo.gender,
          avatarUrl: this.userInfo.avatarUrl,
          height: this.userInfo.height,
          weight: this.userInfo.weight,
          birthday: this.userInfo.birthday
        };
        uni.setStorageSync("userInfo", updatedUserInfo);
        uni.showToast({
          title: "保存成功",
          icon: "success",
          duration: 1500,
          success: () => {
            setTimeout(() => {
              uni.navigateBack();
            }, 1500);
          }
        });
      }
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "edit-container" }, [
      vue.createElementVNode("view", { class: "edit-form" }, [
        vue.createElementVNode("view", { class: "form-item avatar-item" }, [
          vue.createElementVNode("text", { class: "form-label" }, "头像"),
          vue.createElementVNode("view", {
            class: "avatar-wrapper",
            onClick: _cache[0] || (_cache[0] = (...args) => $options.chooseAvatar && $options.chooseAvatar(...args))
          }, [
            vue.createElementVNode("image", {
              src: $data.userInfo.avatarUrl,
              class: "avatar-image"
            }, null, 8, ["src"]),
            vue.createElementVNode("view", { class: "avatar-edit" }, [
              vue.createElementVNode("text", { class: "edit-icon" }, "")
            ])
          ])
        ]),
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createElementVNode("text", { class: "form-label" }, "昵称"),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              type: "text",
              class: "form-input",
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.userInfo.nickname = $event),
              placeholder: "请输入昵称"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $data.userInfo.nickname]
          ])
        ]),
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createElementVNode("text", { class: "form-label" }, "性别"),
          vue.createElementVNode("view", { class: "gender-selector" }, [
            vue.createElementVNode(
              "view",
              {
                class: vue.normalizeClass(["gender-option", { "active": $data.userInfo.gender === "男" }]),
                onClick: _cache[2] || (_cache[2] = ($event) => $data.userInfo.gender = "男")
              },
              [
                vue.createElementVNode("text", { class: "gender-icon" }, ""),
                vue.createElementVNode("text", { class: "gender-text" }, "男")
              ],
              2
              /* CLASS */
            ),
            vue.createElementVNode(
              "view",
              {
                class: vue.normalizeClass(["gender-option", { "active": $data.userInfo.gender === "女" }]),
                onClick: _cache[3] || (_cache[3] = ($event) => $data.userInfo.gender = "女")
              },
              [
                vue.createElementVNode("text", { class: "gender-icon" }, ""),
                vue.createElementVNode("text", { class: "gender-text" }, "女")
              ],
              2
              /* CLASS */
            )
          ])
        ]),
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createElementVNode("text", { class: "form-label" }, "手机号"),
          vue.createElementVNode(
            "text",
            { class: "form-text" },
            vue.toDisplayString($options.formatPhone($data.userInfo.phone)),
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createElementVNode("text", { class: "form-label" }, "身高 (cm)"),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              type: "number",
              class: "form-input",
              "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $data.userInfo.height = $event),
              placeholder: "请输入身高"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $data.userInfo.height]
          ])
        ]),
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createElementVNode("text", { class: "form-label" }, "体重 (kg)"),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              type: "digit",
              class: "form-input",
              "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $data.userInfo.weight = $event),
              placeholder: "请输入体重"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $data.userInfo.weight]
          ])
        ]),
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createElementVNode("text", { class: "form-label" }, "生日"),
          vue.createElementVNode("picker", {
            mode: "date",
            value: $data.userInfo.birthday,
            start: "1950-01-01",
            end: "2023-12-31",
            onChange: _cache[6] || (_cache[6] = (...args) => $options.onBirthdayChange && $options.onBirthdayChange(...args)),
            class: "form-picker"
          }, [
            vue.createElementVNode(
              "view",
              { class: "picker-value" },
              vue.toDisplayString($data.userInfo.birthday || "请选择出生日期"),
              1
              /* TEXT */
            )
          ], 40, ["value"])
        ])
      ]),
      vue.createElementVNode("view", { class: "button-area" }, [
        vue.createElementVNode("button", {
          class: "save-btn",
          onClick: _cache[7] || (_cache[7] = (...args) => $options.saveUserInfo && $options.saveUserInfo(...args))
        }, "保存")
      ])
    ]);
  }
  const PagesProfileEdit = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__file", "/Users/Macx/Desktop/ai项目/run11/pages/profile/edit.vue"]]);
  __definePage("pages/login/login", PagesLoginLogin);
  __definePage("pages/index/index", PagesIndexIndex);
  __definePage("pages/map/map", PagesMapMap);
  __definePage("pages/points/points", PagesPointsPoints);
  __definePage("pages/profile/profile", PagesProfileProfile);
  __definePage("pages/profile/edit", PagesProfileEdit);
  const _sfc_main = {
    onLaunch: function() {
      formatAppLog("log", "at App.vue:4", "App Launch");
    },
    onShow: function() {
      formatAppLog("log", "at App.vue:7", "App Show");
    },
    onHide: function() {
      formatAppLog("log", "at App.vue:10", "App Hide");
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "/Users/Macx/Desktop/ai项目/run11/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);
