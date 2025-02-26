import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';
import { cleanup } from '@testing-library/svelte';
import { afterEach } from 'vitest';

// required for svelte5 + jsdom as jsdom does not support matchMedia
Object.defineProperty(window, 'matchMedia', {
	writable: true,
	enumerable: true,
	value: vi.fn().mockImplementation((query) => ({
		matches: false,
		media: query,
		onchange: null,
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn()
	}))
});

afterEach(() => {
	cleanup();
});

// add more mocks here if you need them
