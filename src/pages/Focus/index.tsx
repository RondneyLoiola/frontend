import { PlusIcon } from '@phosphor-icons/react';
import { useRef, useState } from 'react';
import Button from '../../Components/Button';
import Header from '../../Components/Header';
import styles from './styles.module.css';

type Timers = {
	focus: number;
	rest: number;
};

enum TimerState {
	PAUSED = 'PAUSED',
	FOCUS = 'FOCUS',
	REST = 'REST',
}

function Focus() {
	const focusInput = useRef<HTMLInputElement>(null);
	const restInput = useRef<HTMLInputElement>(null);
	const [timers, setTimers] = useState<Timers>({ focus: 0, rest: 0 });
	const [timerState, setTimerState] = useState(TimerState.PAUSED);

	function handleAddMinutes(type: 'focus' | 'rest') {
		if (type === 'focus') {
			const currentValue = Number(focusInput.current?.value);

			if (focusInput.current) {
				const value = currentValue + 5;
				focusInput.current.value = String(value);

				setTimers((oldValue) => ({
					...oldValue, // pega o valor antigo
					focus: value, // valor novo
				}));
			}

			return;
		}

		const currentValue = Number(restInput.current?.value);

		if (restInput.current) {
			const value = currentValue + 5;
			restInput.current.value = String(value);

			setTimers((oldValue) => ({
				...oldValue, // pega o valor antigo
				rest: value, // valor novo
			}));
		}
	}

	function handleCancel() {
		setTimers({
			focus: 0,
			rest: 0,
		});

		setTimerState(TimerState.PAUSED);

		if (focusInput.current) {
			focusInput.current.value = '';
		}

		if (restInput.current) {
			restInput.current.value = '';
		}
	}

	function handleFocus() {
		setTimerState(TimerState.FOCUS);
	}

	function handleRest() {
		setTimerState(TimerState.REST);
	}

	function handleResume() {
		setTimerState(TimerState.FOCUS);
	}

	return (
		<div className={styles.container}>
			<div className={styles.content}>
				<Header title="Tempo de Foco" />
				<div className={styles.inputGroup}>
					<div className={styles.input}>
						<PlusIcon onClick={() => handleAddMinutes('focus')} />
						<input
							ref={focusInput}
							type="number"
							placeholder="Tempo de Foco"
							disabled
						/>
					</div>

					<div className={styles.input}>
						<PlusIcon onClick={() => handleAddMinutes('rest')} />
						<input
							ref={restInput}
							type="number"
							placeholder="Tempo de descanso"
							disabled
						/>
					</div>
				</div>

				<div className={styles.timer}>
					<span>25:00</span>
				</div>

				<div className={styles.buttonGroup}>
					{timerState === TimerState.PAUSED && (
						<Button
							onClick={handleFocus}
							disabled={timers.focus <= 0 || timers.rest <= 0}
						>
							Começar
						</Button>
					)}
					{timerState === TimerState.FOCUS && (
						<Button onClick={handleRest}>Iniciar Descanso</Button>
					)}
					{timerState === TimerState.REST && (
						<Button onClick={handleResume}>Retomar</Button>
					)}
					<Button onClick={handleCancel} variant="error">
						Cancelar
					</Button>
				</div>
			</div>
		</div>
	);
}

export default Focus;
