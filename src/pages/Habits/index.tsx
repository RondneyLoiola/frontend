/** biome-ignore-all lint/correctness/useExhaustiveDependencies: useEffect */
import { PaperPlaneRightIcon, TrashIcon } from '@phosphor-icons/react';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import SideBar from '../../Components/Siderbar';
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
	const today = dayjs().startOf('day').toISOString();

	console.log(today);

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

	async function handleToggle(id: string){
		await api.patch(`/habits/${id}/toggle`);

		await loadHabits();
	}

	useEffect(() => {
		loadHabits();
	}, []);

	return (
		<div className={styles.app}>
			<SideBar />
			<div className={styles.container}>
				<div className={styles.content}>
					<header>
						<h1>Hábitos Diários</h1>
						<span>
							{`Hoje, ${new Intl.DateTimeFormat('pt-BR', {
								dateStyle: 'long',
								timeZone: 'America/Sao_Paulo',
							}).format(new Date())}`}
						</span>
					</header>
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
									<TrashIcon />
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

export default Habits;
