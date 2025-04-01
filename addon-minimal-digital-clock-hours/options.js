async function saveOptions(e) {
  e.preventDefault();

  await browser.storage.sync.set({
    format: e.target.querySelector('input[name="timeFormat"]:checked').value
  });
}

async function restoreOptions() {
  let res = await browser.storage.sync.get();
  
  if(res.format) {
    const formatOptions = document.querySelectorAll('input[name="timeFormat"]');

    for (let radio of formatOptions) {
      if (radio.value == res.format) {
        radio.checked = true;
      } else {
        radio.checked = false;
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
