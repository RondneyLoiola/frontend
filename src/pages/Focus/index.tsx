/** biome-ignore-all lint/correctness/useExhaustiveDependencies: useEffect */
import { Indicator } from '@mantine/core';
import { Calendar } from '@mantine/dates';
import { PlusIcon } from '@phosphor-icons/react';
import dayjs from 'dayjs';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTimer } from 'react-timer-hook';
import Button from '../../Components/Button';
import Header from '../../Components/Header';
import Info from '../../Components/Info';
import api from '../../services/api';
import styles from './styles.module.css';

type Timers = {
	focus: number;
	rest: number;
};

type FocusMetrics = {
	_id: [number, number, number]; // tres posicoes, dia, mes e ano
	count: number;
};

type FocusTime = {
	_id: string;
	timeFrom: string;
	timeTo: string;
	userId: string;
	createdAt: string;
	updatedAt: string;
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
	const [focusMetrics, setFocusMetrics] = useState<FocusMetrics>(
		{} as FocusMetrics,
	);

	const [currentMonth, setCurrentMonth] = useState<dayjs.Dayjs>(
		dayjs().startOf('month'),
	);

	const [focusTimes, setFocusTimes] = useState<FocusTime[]>([]);

	const [currentDate, setCurrentDate] = useState<dayjs.Dayjs>(
		dayjs().startOf('day'),
	);

	function addSeconds(date: Date, seconds: number) {
		const time = dayjs(date).add(seconds, 'seconds');

		return time.toDate(); // transforma em data com os segundos adicionados
	}

	function handleStart() {
		restTimer.pause();

		const now = new Date(); // pega a data e hora atual

		focusTimer.restart(addSeconds(now, timers.focus * 60)); //

		setTimeFrom(now); // armazena a data e hora atual
	}

	async function handleEnd() {
		//finaliza e manda os dados pro backend
		focusTimer.pause(); // pausa o timer

		await api.post('/focus-time', {
			timeFrom: timeFrom?.toISOString(),
			timeTo: new Date().toISOString(),
		});

		setTimeFrom(null); // limpa o timer
	}

	const focusTimer = useTimer({
		expiryTimestamp: new Date(),
		onExpire: async () => {
			if (timerState === TimerState.PAUSED) {
				// se o timer estiver pausado
				await handleEnd(); // finaliza o timer
			}
		},
	});

	const restTimer = useTimer({
		expiryTimestamp: new Date(), // data de expiração do timer
	});

	function handleAddMinutes(type: 'focus' | 'rest') {
		if (type === 'focus') {
			const currentValue = Number(focusInput.current?.value); //armazena o valor atual do input

			if (focusInput.current) {
				//se tiver um valor atual
				const value = currentValue + 5; //soma o valor atual mais 5
				focusInput.current.value = String(value); // coloca o valor no input

				setTimers((oldValue) => ({
					...oldValue, // pega o valor antigo, zero
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
			//quando cancela, zera os valores do estado
			focus: 0,
			rest: 0,
		});

		setTimerState(TimerState.PAUSED); // pausa o timer

		if (focusInput.current) {
			focusInput.current.value = ''; // limpa o input
		}

		if (restInput.current) {
			restInput.current.value = ''; // limpa o input
		}
	}

	function handleFocus() {
		handleStart(); // inicia o timer

		setTimerState(TimerState.FOCUS); // define o estado como foco
	}

	async function handleRest() {
		await handleEnd(); // finaliza o timer

		const now = new Date();

		restTimer.restart(addSeconds(now, timers.rest * 60));

		setTimerState(TimerState.REST); // define o estado como descanso
	}

	function handleResume() {
		handleStart(); // inicia o timer

		setTimerState(TimerState.FOCUS); // define o estado como foco
	}

	async function loadFocusMetrics(currentMonth: string) {
		const { data } = await api.get<FocusMetrics[]>('/focus-time/metrics', {
			params: {
				date: currentMonth, //envia date como parametro e currentMonth como valor
			},
		});

		// a api retorna um array de FocusMetrics
		const [metrics] = data; //pega o primeiro item, const metrics = data[0]

		setFocusMetrics(metrics || ({} as FocusMetrics)); //se metrics for undefined, manda um objeto vazio
	}

	async function loadFocusTimes(currentDate: string) {
		const { data } = await api.get<FocusTime[]>('/focus-time', {
			params: {
				date: currentDate,
			},
		});

		console.log(data);

		setFocusTimes(data);
	}

	const metricsInfo = useMemo(() => {
		const timesMetrics = focusTimes.map((item) => ({
			timeFrom: dayjs(item.timeFrom),
			timeTo: dayjs(item.timeTo),
		}));

		let totalTimeInMinutes = 0;

		if (timesMetrics.length) {
			for (const { timeFrom, timeTo } of timesMetrics) {
				const diff = timeTo.diff(timeFrom, 'minutes'); // diferença em minutos

				totalTimeInMinutes += diff;
			}
		}

		return {
			timesMetrics,
			totalTimeInMinutes,
		};
	}, [focusTimes]);

	async function handleSelectMonth(date: Date | string) {
		const dateObject = typeof date === 'string' ? new Date(date) : date;

		setCurrentMonth(dayjs(dateObject));
	}

	async function handleSelectDay(date: Date | string) {
		const dateObject = typeof date === 'string' ? new Date(date) : date;

		setCurrentDate(dayjs(dateObject));
	}

	useEffect(() => {
		loadFocusMetrics(currentMonth.toISOString());
	}, [currentMonth]);

	useEffect(() => {
		loadFocusTimes(currentDate.toISOString());
	}, [currentDate]);

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
					{timerState === TimerState.PAUSED && ( //valor padrão do timerState é PAUSED
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
			<div className={styles.metrics}>
				<h2>Estatísticas</h2>

				<div className={styles.infoContainer}>
					<Info value={String(focusMetrics.count || 0)} label="Ciclos Totais" />
					<Info
						value={`${metricsInfo.totalTimeInMinutes} minutos`}
						label="Tempo total de Foco"
					/>
				</div>

				<div className={styles.calendarContainer}>
					<Calendar
						getDayProps={(date) => ({
							selected: dayjs(date).isSame(currentDate), // verifica se o dia selecionado do calendário é igual ao currentDate
							onClick: async () => await handleSelectDay(date),
						})}
						onMonthSelect={handleSelectMonth}
						onNextMonth={handleSelectMonth}
						onPreviousMonth={handleSelectMonth}
						renderDay={(date) => {
							const day = dayjs(date).date();
							// const isSameDate = metrics?.completedDates?.some(
							// 	(item) => dayjs(item).isSame(dayjs(date)),
							// 	verifica se tem alguma data de completedDates que seja igual ao dia do calendário
							// );
							return (
								<Indicator
									size={10}
									color="var(--info"
									offset={-2}
									//disabled={!isSameDate}
								>
									<div>{day}</div>
								</Indicator>
							);
						}}
					/>
				</div>
			</div>
		</div>
	);
}

export default Focus;
