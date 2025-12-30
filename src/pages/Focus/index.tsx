import { PlusIcon } from '@phosphor-icons/react';
import dayjs from 'dayjs';
import { useRef, useState } from 'react';
import { useTimer } from 'react-timer-hook';
import Button from '../../Components/Button';
import Header from '../../Components/Header';
import api from '../../services/api';
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

const timerStateTitle = {
	[TimerState.PAUSED]: 'Pausado',
	[TimerState.FOCUS]: 'Foco',
	[TimerState.REST]: 'Descanso',
};

function Focus() {
	const focusInput = useRef<HTMLInputElement>(null);
	const restInput = useRef<HTMLInputElement>(null);
	const [timers, setTimers] = useState<Timers>({ focus: 0, rest: 0 });
	const [timerState, setTimerState] = useState(TimerState.PAUSED);
	const [timeFrom, setTimeFrom] = useState<Date | null>(null);

	function addSeconds(date: Date, seconds: number) {
		const time = dayjs(date).add(seconds, 'seconds');

		return time.toDate();
	}

	function handleStart() {
		restTimer.pause();

		const now = new Date();

		focusTimer.restart(addSeconds(now, timers.focus * 60));

		setTimeFrom(now);
	}

	async function handleEnd() {
		focusTimer.pause();

		await api.post('/focus-time', {
			timeFrom: timeFrom?.toISOString(),
			timeTo: new Date().toISOString(),
		});

		setTimeFrom(null);
	}

	const focusTimer = useTimer({
		expiryTimestamp: new Date(),
		onExpire: async () => {
			if (timerState === TimerState.PAUSED) {
				await handleEnd();
			}
		},
	});

	const restTimer = useTimer({
		expiryTimestamp: new Date(),
	});

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
		handleStart();

		setTimerState(TimerState.FOCUS);
	}

	async function handleRest() {
		await handleEnd();

		const now = new Date();

		restTimer.restart(addSeconds(now, timers.rest * 60));

		setTimerState(TimerState.REST);
	}

	function handleResume() {
		handleStart();

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
					<strong>{timerStateTitle[timerState]}</strong>
					{timerState === TimerState.PAUSED && (
						<span>{`${String(timers.focus).padStart(2, '0')}:00`}</span>
					)}

					{timerState === TimerState.FOCUS && (
						<span>{`${String(focusTimer.minutes).padStart(2, '0')}:${String(focusTimer.seconds).padStart(2, '0')}`}</span>
					)}

					{timerState === TimerState.REST && (
						<span>{`${String(restTimer.minutes).padStart(2, '0')}:${String(restTimer.seconds).padStart(2, '0')}`}</span>
					)}
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
