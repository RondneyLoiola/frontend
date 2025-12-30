/** biome-ignore-all lint/correctness/useExhaustiveDependencies: useEffect */

import { Calendar } from '@mantine/dates';
import { PaperPlaneRightIcon, TrashIcon } from '@phosphor-icons/react';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
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

function Habits() {
	const [habits, setHabits] = useState<Habit[]>([]);
	const nameInput = useRef<HTMLInputElement>(null);
	const today = dayjs().startOf('day').toISOString(); //pega o dia de hoje

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
						<div key={item._id} className={styles.habit}>
							<p>{item.name}</p>
							<div>
								<input
									type="checkbox"
									checked={item.completedDates.some((item) => item === today)}
									onChange={async () => await handleToggle(item._id)}
								/>
								<TrashIcon onClick={async () => await handleRemove(item._id)} />
							</div>
						</div>
					))}
				</div>
			</div>

			<div className={styles.metrics}>
				<h2>Camila te amo</h2>

				<div className={styles.infoContainer}>
					<Info value="23/31" label="Dias concluídos" />
					<Info value="70%" label="Porcentagem" />
				</div>

				<div className={styles.calendarContainer}>
					<Calendar />
				</div>
			</div>
		</div>
	);
}

export default Habits;
