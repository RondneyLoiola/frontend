import clsx from 'clsx';
import type { ComponentProps } from 'react';
import styles from './styles.module.css';

type ButtonProps = ComponentProps<'button'> & {
	variant?: 'info' | 'error';
};

function Button({ children, disabled, variant, ...props }: ButtonProps) {
	return (
		<button
			{...props}
			className={clsx(
				styles.button,
				variant === 'error' && styles.error,
				disabled && styles.disabled,
			)}
			disabled={disabled}
		>
			{children}
		</button>
	);
}

export default Button;
