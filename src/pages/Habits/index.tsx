/** biome-ignore-all lint/correctness/useExhaustiveDependencies: useEffect */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: onClick in 'p' */

import { Calendar } from '@mantine/dates';
import { PaperPlaneRightIcon, TrashIcon } from '@phosphor-icons/react';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { useEffect, useMemo, useRef, useState } from 'react';
import Header from '../../Components/Header';
import Info from '../../Components/Info';
import api from '../../services/api';
import styles from './styles.module.css';

type Habit = {
	_id: string;
	name: string;
	completedDates: string[];
	userId: string;
	createdAt: string;
	updatedAt: string;
};

type HabitMetrics = {
	_id: string;
	name: string;
	completedDates: string[]; // string pq o json só entende string, quando vem da api
};

function Habits() {
	const [habits, setHabits] = useState<Habit[]>([]);
	const [metrics, _setMetricss] = useState<HabitMetrics>({} as HabitMetrics);
	const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null); //null pq não tem nenhum habito selecionado
	const nameInput = useRef<HTMLInputElement>(null);
	const today = dayjs().startOf('day'); //pega o dia de hoje

	const metricsInfo = useMemo(() => {
		//useMemo serve para memorizar os dados, evitando que eles sejam recalculados a cada renderização
		const numberOfMonthDays = today.endOf('month').get('date'); //pega o dia do mês
		const numberOfDays = metrics?.completedDates //pega os dias completados
			? metrics?.completedDates?.length
			: 0;

		const completedDatesPerMonth = `${numberOfDays}/${numberOfMonthDays}`;

		const completedMonthPercent = `${Math.round(
			(numberOfDays / numberOfMonthDays) * 100,
		)}%`;

		return {
			completedMonthPercent,
			completedDatesPerMonth,
		};
	}, [metrics]);

	async function handleSelectedHabit(habit: Habit) {
		setSelectedHabit(habit);
		console.log(habit);
	}

	async function loadHabits() {
		const { data } = await api.get<Habit[]>('/habits');

		setHabits(data);
	}

	async function handleSubmit() {
		if (!nameInput.current) return;

		const name = nameInput.current?.value;

		if (name) {
			await api.post('/habits', {
				name, //passa o name como propriedade/parâmetro
			});

			nameInput.current.value = '';

			loadHabits(); //recarrega os hábitos quando um novo é criado
		}
	}

	async function handleToggle(id: string) {
		await api.patch(`/habits/${id}/toggle`);

		await loadHabits(); //recarrega depois de marcado
	}

	async function handleRemove(id: string) {
		await api.delete(`/habits/${id}`);

		await loadHabits(); //recarrega depois de deletado
	}

	useEffect(() => {
		loadHabits();
	}, []);

	return (
		<div className={styles.container}>
			<div className={styles.content}>
				<Header title="Hábitos Diários" />
				<div className={styles.input}>
					<input
						ref={nameInput}
						type="text"
						placeholder="Digite aqui um novo hábito..."
					/>
					<PaperPlaneRightIcon onClick={handleSubmit} />
				</div>
				<div className={styles.habits}>
					{habits.map((item) => (
						<div
							key={item._id}
							className={clsx(
								styles.habit,
								item._id === selectedHabit?._id && styles['habit-active'],
							)}
						>
							<p onClick={async () => await handleSelectedHabit(item)}>
								{item.name}
							</p>
							<div>
								<input
									type="checkbox"
									checked={item.completedDates.some(
										(item) => item === today.toISOString(),
									)}
									onChange={async () => await handleToggle(item._id)}
								/>
								<TrashIcon onClick={async () => await handleRemove(item._id)} />
							</div>
						</div>
					))}
				</div>
			</div>

			{selectedHabit && (
				<div className={styles.metrics}>
					<h2>{selectedHabit.name}</h2>

					<div className={styles.infoContainer}>
						<Info
							value={metricsInfo.completedDatesPerMonth}
							label="Dias concluídos"
						/>
						<Info
							value={metricsInfo.completedMonthPercent}
							label="Porcentagem"
						/>
					</div>

					<div className={styles.calendarContainer}>
						<Calendar />
					</div>
				</div>
			)}
		</div>
	);
}

export default Habits;
