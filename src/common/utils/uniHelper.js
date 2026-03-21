export const showToast = (title, icon = 'none') => {
  uni.showToast({
    title,
    icon
  });
};