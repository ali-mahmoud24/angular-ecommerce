import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private container: HTMLElement | null = null;

  constructor() {
    this.ensureContainer();
  }

  private ensureContainer() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'fixed top-5 right-5 z-[1000] flex flex-col gap-3';
      document.body.appendChild(this.container);
    }
  }

  show(message: string, type: 'success' | 'error' = 'success') {
    const el = document.createElement('div');
    el.className = `
      px-4 py-2 rounded-lg shadow text-white text-sm font-medium
      animate-fade-in
      ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}
    `;
    el.textContent = message;

    this.container?.appendChild(el);
    setTimeout(() => el.classList.add('opacity-0'), 2500);
    setTimeout(() => el.remove(), 3000);
  }
}
