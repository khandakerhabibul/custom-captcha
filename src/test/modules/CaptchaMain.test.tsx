import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import userEvent from '@testing-library/user-event';
import CaptchaMain from '../../modules/Captcha/CaptchaMain';
import CaptchaError from '../../modules/Captcha/CaptchaError';

describe('CaptchaMain', () => {
  // TEST CASE 1 - check for loading camera
  it('loading captcha container', () => {
    render(<CaptchaMain />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  // TEST CASE 2 - check for targetted shapes and colors after clicking continue button
  it('targetted colors and shapes', async () => {
    render(<CaptchaMain />);

    const continueButton = screen.getByRole('button', { name: /continue/i });
    await userEvent.click(continueButton);
    const text = screen.getByText(/please select/i);

    expect(text).toBeInTheDocument();
  });

  // TEST CASE 3 - captcha error page
  it('captcha error page with blocked time', () => {
    render(<CaptchaError remainingTimeToUnlock={15} />);

    const text = screen.getByText(/wait for 15 seconds and try again/i);

    expect(text).toBeInTheDocument();
  });
});
