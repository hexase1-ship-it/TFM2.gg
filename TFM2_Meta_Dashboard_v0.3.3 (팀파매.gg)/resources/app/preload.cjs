const { contextBridge, ipcRenderer } = require("electron");

const validPolicyModes = new Set(["followDashboard", "classic", "fearless", "hardFearless"]);
const validDashboardPresets = new Set(["classic", "fearless", "hardFearless"]);

function sanitizeSettings(input = {}) {
  const settings = typeof input === "object" && input ? input : {};
  const addonPolicyPreset = validPolicyModes.has(settings.addonPolicyPreset)
    ? settings.addonPolicyPreset
    : "followDashboard";
  const dashboardPreset = validDashboardPresets.has(settings.dashboardPreset)
    ? settings.dashboardPreset
    : "classic";
  return {
    ...settings,
    addonPolicyPreset,
    dashboardPreset
  };
}

contextBridge.exposeInMainWorld("tfm2ggPolicy", {
  getSettings: () => ipcRenderer.invoke("tfm2gg-policy:get-settings"),
  saveSettings: (settings) => ipcRenderer.invoke("tfm2gg-policy:save-settings", sanitizeSettings(settings)),
  regenerate: (settings) => ipcRenderer.invoke("tfm2gg-policy:regenerate", sanitizeSettings(settings))
});
