export function setWindowTitle(title: string) {
    document.title = title;
    window.dispatchEvent(new CustomEvent('update-shell-title', { detail: title }));
  }
  